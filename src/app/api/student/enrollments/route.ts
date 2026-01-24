import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Course from '@/models/Course';

// GET student's enrolled courses with course details
export async function GET(req: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { message: 'User ID is required' },
                { status: 400 }
            );
        }

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        // Get full course details for enrolled courses
        const enrolledCourseSlugs = user.enrolledCourses.map((c: any) => c.courseSlug);
        const courses = await Course.find({ slug: { $in: enrolledCourseSlugs } });

        // Merge enrollment data with course details
        const enrolledCourses = user.enrolledCourses.map((enrollment: any) => {
            const courseDetails = courses.find(c => c.slug === enrollment.courseSlug);
            return {
                ...enrollment.toObject(),
                courseDetails: courseDetails ? {
                    title: courseDetails.title,
                    description: courseDetails.description,
                    thumbnail: courseDetails.thumbnail,
                    duration: courseDetails.duration,
                    level: courseDetails.level,
                    modules: courseDetails.modules,
                    totalLessons: courseDetails.modules?.reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0) || 0
                } : null
            };
        });

        // Calculate stats
        const totalCourses = enrolledCourses.length;
        const completedCourses = enrolledCourses.filter((c: any) => c.progress >= 100).length;
        const inProgressCourses = enrolledCourses.filter((c: any) => c.progress > 0 && c.progress < 100).length;

        return NextResponse.json({
            enrolledCourses,
            stats: {
                totalCourses,
                completedCourses,
                inProgressCourses
            }
        });

    } catch (error: any) {
        console.error('Error fetching enrolled courses:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to fetch enrolled courses' },
            { status: 500 }
        );
    }
}

// POST enroll in a new course
export async function POST(req: Request) {
    try {
        await dbConnect();

        const { userId, courseSlug, courseName } = await req.json();

        if (!userId || !courseSlug) {
            return NextResponse.json(
                { message: 'User ID and course slug are required' },
                { status: 400 }
            );
        }

        // Check if already enrolled
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        const alreadyEnrolled = user.enrolledCourses.some((c: any) => c.courseSlug === courseSlug);
        if (alreadyEnrolled) {
            return NextResponse.json(
                { message: 'Already enrolled in this course' },
                { status: 400 }
            );
        }

        // Add enrollment
        user.enrolledCourses.push({
            courseSlug,
            courseName: courseName || courseSlug,
            enrolledAt: new Date(),
            progress: 0,
            completedLessons: [],
            paid: false
        });

        await user.save();

        // Increment course enrolled count
        await Course.findOneAndUpdate(
            { slug: courseSlug },
            { $inc: { enrolledCount: 1 } }
        );

        return NextResponse.json({
            message: 'Enrolled successfully',
            enrollment: user.enrolledCourses[user.enrolledCourses.length - 1]
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error enrolling:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to enroll' },
            { status: 500 }
        );
    }
}

// PUT update progress
export async function PUT(req: Request) {
    try {
        await dbConnect();

        const { userId, courseSlug, progress, completedLessonId } = await req.json();

        if (!userId || !courseSlug) {
            return NextResponse.json(
                { message: 'User ID and course slug are required' },
                { status: 400 }
            );
        }

        const updateQuery: any = {};

        if (progress !== undefined) {
            updateQuery['enrolledCourses.$[elem].progress'] = progress;
        }

        const user = await User.findOneAndUpdate(
            { _id: userId },
            { $set: updateQuery },
            {
                arrayFilters: [{ 'elem.courseSlug': courseSlug }],
                new: true
            }
        );

        // Add completed lesson if provided
        if (completedLessonId) {
            await User.findOneAndUpdate(
                { _id: userId },
                { $addToSet: { 'enrolledCourses.$[elem].completedLessons': completedLessonId } },
                { arrayFilters: [{ 'elem.courseSlug': courseSlug }] }
            );
        }

        return NextResponse.json({
            message: 'Progress updated',
            user
        });

    } catch (error: any) {
        console.error('Error updating progress:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to update progress' },
            { status: 500 }
        );
    }
}
