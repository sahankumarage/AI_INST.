import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Course from '@/models/Course';
import Assignment from '@/models/Assignment';
import Submission from '@/models/Submission';
import Note from '@/models/Note';
import Announcement from '@/models/Announcement';

// GET - Get complete classroom data for a course
export async function GET(req: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const courseSlug = searchParams.get('courseSlug');

        if (!userId || !courseSlug) {
            return NextResponse.json(
                { message: 'User ID and course slug are required' },
                { status: 400 }
            );
        }

        // Verify user is enrolled in this course
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        const enrollment = user.enrolledCourses.find(
            (c: any) => c.courseSlug === courseSlug
        );

        if (!enrollment) {
            return NextResponse.json(
                { message: 'Not enrolled in this course' },
                { status: 403 }
            );
        }

        // Get course details
        const course = await Course.findOne({ slug: courseSlug });
        if (!course) {
            return NextResponse.json(
                { message: 'Course not found' },
                { status: 404 }
            );
        }

        // Get all assignments for this course
        const assignments = await Assignment.find({ courseSlug }).sort({ createdAt: -1 });

        // Get user's submissions
        const submissions = await Submission.find({
            userId,
            courseSlug
        });

        // Get user's notes for this course
        const notes = await Note.find({
            userId,
            courseSlug
        }).sort({ createdAt: -1 });

        // Get course announcements
        const announcements = await Announcement.find({ courseSlug })
            .sort({ isPinned: -1, createdAt: -1 })
            .limit(10);

        // Calculate grades
        const gradedSubmissions = submissions.filter(s => s.status === 'graded');
        const totalGrade = gradedSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0);
        const totalMaxGrade = gradedSubmissions.length * 100; // Assuming max 100 per assignment
        const averageGrade = totalMaxGrade > 0 ? Math.round((totalGrade / totalMaxGrade) * 100) : null;

        // Count total lessons
        const totalLessons = course.modules?.reduce(
            (sum: number, m: any) => sum + (m.lessons?.length || 0), 0
        ) || 0;

        // Create lesson map with completion and assignment status
        const lessonMap: Record<string, any> = {};
        course.modules?.forEach((module: any) => {
            module.lessons?.forEach((lesson: any) => {
                const isCompleted = enrollment.completedLessons?.includes(lesson.id);
                const lessonAssignments = assignments.filter(a => a.lessonId === lesson.id);
                const lessonSubmissions = submissions.filter(s => s.lessonId === lesson.id);

                lessonMap[lesson.id] = {
                    ...lesson.toObject(),
                    isCompleted,
                    hasAssignment: lessonAssignments.length > 0,
                    submissionStatus: lessonSubmissions[0]?.status || null
                };
            });
        });

        return NextResponse.json({
            course: {
                id: course._id,
                title: course.title,
                slug: course.slug,
                description: course.description,
                thumbnail: course.thumbnail,
                duration: course.duration,
                level: course.level,
                instructor: course.instructor,
                modules: course.modules?.map((module: any) => ({
                    ...module.toObject(),
                    lessons: module.lessons?.map((lesson: any) => lessonMap[lesson.id] || lesson.toObject())
                }))
            },
            enrollment: {
                enrolledAt: enrollment.enrolledAt,
                progress: enrollment.progress,
                completedLessons: enrollment.completedLessons || [],
                paid: enrollment.paid
            },
            stats: {
                totalLessons,
                completedLessons: enrollment.completedLessons?.length || 0,
                totalAssignments: assignments.length,
                submittedAssignments: submissions.filter(s => s.status !== 'pending').length,
                gradedAssignments: gradedSubmissions.length,
                averageGrade,
                notesCount: notes.length
            },
            assignments: assignments.map(a => ({
                ...a.toObject(),
                submission: submissions.find(s => s.assignmentId?.toString() === a._id.toString())
            })),
            notes,
            announcements
        });

    } catch (error: any) {
        console.error('Error fetching classroom data:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to fetch classroom data' },
            { status: 500 }
        );
    }
}

// POST - Mark lesson as complete
export async function POST(req: Request) {
    try {
        await dbConnect();

        const { userId, courseSlug, lessonId, action } = await req.json();

        if (!userId || !courseSlug) {
            return NextResponse.json(
                { message: 'User ID and course slug are required' },
                { status: 400 }
            );
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        const enrollmentIndex = user.enrolledCourses.findIndex(
            (c: any) => c.courseSlug === courseSlug
        );

        if (enrollmentIndex === -1) {
            return NextResponse.json(
                { message: 'Not enrolled in this course' },
                { status: 403 }
            );
        }

        if (action === 'complete_lesson' && lessonId) {
            // Add lesson to completed list if not already there
            if (!user.enrolledCourses[enrollmentIndex].completedLessons) {
                user.enrolledCourses[enrollmentIndex].completedLessons = [];
            }

            if (!user.enrolledCourses[enrollmentIndex].completedLessons.includes(lessonId)) {
                user.enrolledCourses[enrollmentIndex].completedLessons.push(lessonId);
            }

            // Recalculate progress
            const course = await Course.findOne({ slug: courseSlug });
            if (course) {
                const totalLessons = course.modules?.reduce(
                    (sum: number, m: any) => sum + (m.lessons?.length || 0), 0
                ) || 1;
                const completedCount = user.enrolledCourses[enrollmentIndex].completedLessons.length;
                user.enrolledCourses[enrollmentIndex].progress = Math.round((completedCount / totalLessons) * 100);
            }

            await user.save();

            return NextResponse.json({
                message: 'Lesson marked as complete',
                progress: user.enrolledCourses[enrollmentIndex].progress,
                completedLessons: user.enrolledCourses[enrollmentIndex].completedLessons
            });
        }

        return NextResponse.json({ message: 'Invalid action' }, { status: 400 });

    } catch (error: any) {
        console.error('Error updating classroom:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to update' },
            { status: 500 }
        );
    }
}
