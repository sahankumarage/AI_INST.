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

        // Also check for pending payments
        const fs = require('fs');
        const path = require('path');
        const dataPath = path.join(process.cwd(), 'src/data/pending_payments.json');
        let pendingCourses: any[] = [];

        if (fs.existsSync(dataPath)) {
            try {
                const fileContent = fs.readFileSync(dataPath, 'utf8');
                const allPending = JSON.parse(fileContent);
                const userPending = allPending.filter((p: any) => p.userId === userId && p.status === 'pending');

                pendingCourses = userPending.map((p: any) => ({
                    courseSlug: p.courseSlug,
                    courseName: p.courseName,
                    enrolledAt: p.date,
                    progress: 0,
                    completedLessons: [],
                    paid: false,
                    isPendingVerification: true
                }));

                // Add pending slugs to fetch details
                userPending.forEach((p: any) => {
                    if (!enrolledCourseSlugs.includes(p.courseSlug)) {
                        enrolledCourseSlugs.push(p.courseSlug);
                    }
                });
            } catch (e) {
                console.error("Error reading pending payments", e);
            }
        }

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
        // Filter out any active enrollments from pending list (if approved but JSON not updated yet, active takes precedence)
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
        const body = await req.json();
        const { userId, courseSlug, courseName, paymentMethod, amountPaid, receiptImage } = body;

        if (!userId || !courseSlug) {
            return NextResponse.json(
                { message: 'User ID and course slug are required' },
                { status: 400 }
            );
        }

        // Handle Bank Transfer - Save to local JSON for Admin Review
        if (paymentMethod === 'bank') {
            const fs = require('fs');
            const path = require('path');
            const dataPath = path.join(process.cwd(), 'src/data/pending_payments.json');

            // Ensure directory exists
            const dir = path.dirname(dataPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            // Read existing data
            let pendingPayments = [];
            if (fs.existsSync(dataPath)) {
                try {
                    const fileContent = fs.readFileSync(dataPath, 'utf8');
                    pendingPayments = JSON.parse(fileContent);
                } catch (e) {
                    pendingPayments = [];
                }
            }

            // Mock getting user details since we aren't querying DB here for speed/safety
            // In a real app, we'd query User.findById(userId)
            // leveraging what we might have or just generic data

            // Create new payment record
            const newPayment = {
                id: Date.now().toString(),
                userId,
                studentName: "Student (Pending)", // Should ideally fetch from DB
                studentEmail: "student@example.com",
                courseSlug,
                courseName: courseName || courseSlug,
                amount: amountPaid || 0,
                status: 'pending',
                paymentMethod: 'Bank Transfer',
                date: new Date().toISOString().replace('T', ' ').substring(0, 16),
                transactionId: `bank_${Date.now()}`,
                receiptImage
            };

            // Try to fetch real user name if DB connects
            try {
                await dbConnect();
                const user = await User.findById(userId);
                if (user) {
                    newPayment.studentName = `${user.firstName} ${user.lastName}`;
                    newPayment.studentEmail = user.email;
                }
            } catch (e) {
                console.log("Could not fetch user details for receipt, using defaults");
            }

            pendingPayments.unshift(newPayment);

            fs.writeFileSync(dataPath, JSON.stringify(pendingPayments, null, 2));

            // NOTE: We do NOT add to User.enrolledCourses here. 
            // The user is not enrolled until Admin approves the payment.

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
