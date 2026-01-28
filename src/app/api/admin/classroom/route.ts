import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Course from '@/models/Course';

// GET - Fetch all classrooms with enrolled students
export async function GET() {
    try {
        await dbConnect();

        // Get all students with enrollments (excluding soft-deleted)
        const students = await User.find({
            role: 'student',
            'enrolledCourses.0': { $exists: true },
            isDeleted: { $ne: true }
        }).lean();

        // Get all courses for reference (excluding soft-deleted)
        const courses = await Course.find({ isDeleted: { $ne: true } }).lean();
        const courseMap = new Map(courses.map((c: any) => [c.slug, c]));

        // Group students by course
        const classroomMap = new Map<string, any>();

        students.forEach((student: any) => {
            student.enrolledCourses
                .filter((e: any) => e.isEnrolled !== false) // Only include active enrollments
                .forEach((enrollment: any) => {
                    const slug = enrollment.courseSlug;

                    if (!classroomMap.has(slug)) {
                        const courseInfo = courseMap.get(slug);
                        classroomMap.set(slug, {
                            courseSlug: slug,
                            courseName: enrollment.courseName || courseInfo?.title || slug,
                            totalStudents: 0,
                            activeStudents: 0,
                            totalProgress: 0,
                            students: []
                        });
                    }

                    const classroom = classroomMap.get(slug);
                    const courseInfo = courseMap.get(slug);

                    // Calculate total lessons from course modules
                    let totalLessons = 0;
                    if (courseInfo?.modules) {
                        courseInfo.modules.forEach((mod: any) => {
                            totalLessons += mod.lessons?.length || 0;
                        });
                    }

                    classroom.students.push({
                        id: student._id.toString(),
                        name: `${student.firstName} ${student.lastName}`,
                        email: student.email,
                        enrolledAt: enrollment.enrolledAt,
                        progress: enrollment.progress || 0,
                        completedLessons: enrollment.completedLessons || [],
                        totalLessons: totalLessons || enrollment.completedLessons?.length || 0,
                        paid: enrollment.paid,
                        amount: enrollment.amount
                    });

                    classroom.totalStudents++;
                    classroom.totalProgress += (enrollment.progress || 0);

                    // Count as active if started (progress > 0) but not completed
                    if (enrollment.progress > 0 && enrollment.progress < 100) {
                        classroom.activeStudents++;
                    }
                });
        });

        // Calculate averages and format response
        const classrooms = Array.from(classroomMap.values()).map(classroom => ({
            ...classroom,
            averageProgress: classroom.totalStudents > 0
                ? Math.round(classroom.totalProgress / classroom.totalStudents)
                : 0
        }));

        // Sort by number of students
        classrooms.sort((a, b) => b.totalStudents - a.totalStudents);

        // Calculate overall stats
        let totalEnrollments = 0;
        let totalActiveStudents = 0;
        let completedCourses = 0;
        let totalProgress = 0;

        classrooms.forEach(c => {
            totalEnrollments += c.totalStudents;
            totalActiveStudents += c.activeStudents;
            totalProgress += c.totalProgress;
            completedCourses += c.students.filter((s: any) => s.progress >= 100).length;
        });

        const stats = {
            totalEnrollments,
            activeStudents: totalActiveStudents,
            completedCourses,
            averageProgress: totalEnrollments > 0
                ? Math.round(totalProgress / totalEnrollments)
                : 0
        };

        return NextResponse.json({ classrooms, stats });

    } catch (error: any) {
        console.error('Error fetching classrooms:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to fetch classroom data' },
            { status: 500 }
        );
    }
}

// PATCH - Update student progress
export async function PATCH(req: Request) {
    try {
        await dbConnect();

        const { studentId, courseSlug, progress } = await req.json();

        if (!studentId || !courseSlug || progress === undefined) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const user = await User.findById(studentId);
        if (!user) {
            return NextResponse.json(
                { message: 'Student not found' },
                { status: 404 }
            );
        }

        // Find and update the enrollment
        const enrollment = user.enrolledCourses.find(
            (e: any) => e.courseSlug === courseSlug
        );

        if (!enrollment) {
            return NextResponse.json(
                { message: 'Enrollment not found' },
                { status: 404 }
            );
        }

        enrollment.progress = progress;
        await user.save();

        return NextResponse.json({
            message: 'Progress updated successfully',
            progress
        });

    } catch (error: any) {
        console.error('Error updating progress:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to update progress' },
            { status: 500 }
        );
    }
}

// DELETE - Remove student from course
export async function DELETE(req: Request) {
    try {
        await dbConnect();

        const { studentId, courseSlug } = await req.json();

        if (!studentId || !courseSlug) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const user = await User.findById(studentId);
        if (!user) {
            return NextResponse.json(
                { message: 'Student not found' },
                { status: 404 }
            );
        }

        // Soft unenroll - set isEnrolled to false instead of removing
        const enrollment = user.enrolledCourses.find(
            (e: any) => e.courseSlug === courseSlug
        );

        if (!enrollment) {
            return NextResponse.json(
                { message: 'Enrollment not found' },
                { status: 404 }
            );
        }

        enrollment.isEnrolled = false;
        await user.save();

        return NextResponse.json({
            message: 'Enrollment removed successfully'
        });

    } catch (error: any) {
        console.error('Error removing enrollment:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to remove enrollment' },
            { status: 500 }
        );
    }
}
