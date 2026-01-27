import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Course from '@/models/Course';
import Payment from '@/models/Payment';

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

        // Check for pending payments using Payment model
        const pendingPayments = await Payment.find({ userId: userId, status: 'pending' });

        const pendingCourses = pendingPayments.map((p: any) => ({
            courseSlug: p.courseSlug,
            // We might not have courseName stored in Payment, so we'll fetch it or use slug
            courseName: p.courseSlug,
            enrolledAt: p.submittedAt,
            progress: 0,
            completedLessons: [],
            paid: false,
            isPendingVerification: true
        }));

        // Add pending slugs to fetch details
        pendingPayments.forEach((p: any) => {
            if (!enrolledCourseSlugs.includes(p.courseSlug)) {
                enrolledCourseSlugs.push(p.courseSlug);
            }
        });

        const courses = await Course.find({ slug: { $in: enrolledCourseSlugs } });

        // Merge enrollment data with course details
        const activeEnrollments = user.enrolledCourses.map((enrollment: any) => {
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

        // Map pending courses with details
        const pendingEnrollments = pendingCourses.map((enrollment: any) => {
            const courseDetails = courses.find(c => c.slug === enrollment.courseSlug);
            return {
                ...enrollment,
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

        // Combine lists
        // Filter out any active enrollments from pending list (if approved but somehow still pending in Payment, active takes precedence)
        const finalPending = pendingEnrollments.filter((p: any) =>
            !activeEnrollments.some((a: any) => a.courseSlug === p.courseSlug)
        );

        const allCourses = [...activeEnrollments, ...finalPending];

        // Calculate stats (exclude pending from stats)
        const totalCourses = activeEnrollments.length;
        const completedCourses = activeEnrollments.filter((c: any) => c.progress >= 100).length;
        const inProgressCourses = activeEnrollments.filter((c: any) => c.progress > 0 && c.progress < 100).length;

        return NextResponse.json({
            enrolledCourses: allCourses,
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

        const body = await req.json();
        const { userId, courseSlug, courseName, paymentMethod, amountPaid, receiptImage } = body;

        if (!userId || !courseSlug) {
            return NextResponse.json(
                { message: 'User ID and course slug are required' },
                { status: 400 }
            );
        }

        // Handle Bank Transfer - Save to Pending Payments Collection
        if (paymentMethod === 'bank') {

            // Create new payment record
            await Payment.create({
                userId,
                courseSlug,
                amount: amountPaid || 0,
                method: 'manual',
                receiptUrl: receiptImage,
                status: 'pending',
                transactionId: `bank_${Date.now()}`
            });

            return NextResponse.json({
                message: 'Receipt submitted successfully',
                enrollment: { courseSlug, status: 'pending' }
            }, { status: 201 });
        }

        // Standard Enrollment (Card / Free)
        await dbConnect();

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
            paid: true
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
