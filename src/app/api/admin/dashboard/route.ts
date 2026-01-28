import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Course from '@/models/Course';

// GET - Admin Dashboard Stats
export async function GET(req: Request) {
    try {
        await dbConnect();

        // Get total students (excluding soft-deleted)
        const totalStudents = await User.countDocuments({ role: 'student', isDeleted: { $ne: true } });

        // Get total courses (excluding soft-deleted)
        const totalCourses = await Course.countDocuments({ isDeleted: { $ne: true } });
        const publishedCourses = await Course.countDocuments({ isPublished: true, isDeleted: { $ne: true } });

        // Get total enrollments (excluding soft-deleted students)
        const enrollmentData = await User.aggregate([
            { $match: { role: 'student', isDeleted: { $ne: true } } },
            { $unwind: { path: '$enrolledCourses', preserveNullAndEmptyArrays: true } },
            { $group: { _id: null, totalEnrollments: { $sum: 1 }, paidEnrollments: { $sum: { $cond: ['$enrolledCourses.paid', 1, 0] } } } }
        ]);

        const totalEnrollments = enrollmentData[0]?.totalEnrollments || 0;
        const paidEnrollments = enrollmentData[0]?.paidEnrollments || 0;

        // Get recent students (last 7 days, excluding soft-deleted)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const newStudentsThisWeek = await User.countDocuments({
            role: 'student',
            isDeleted: { $ne: true },
            createdAt: { $gte: sevenDaysAgo }
        });

        // Get revenue (sum of paid enrollment amounts, excluding soft-deleted students)
        const revenueData = await User.aggregate([
            { $match: { role: 'student', isDeleted: { $ne: true } } },
            { $unwind: '$enrolledCourses' },
            { $match: { 'enrolledCourses.paid': true } },
            { $group: { _id: null, totalRevenue: { $sum: '$enrolledCourses.amount' } } }
        ]);
        const totalRevenue = revenueData[0]?.totalRevenue || 0;

        // Get recent enrollments (excluding soft-deleted students)
        const recentEnrollments = await User.aggregate([
            { $match: { role: 'student', isDeleted: { $ne: true } } },
            { $unwind: '$enrolledCourses' },
            { $sort: { 'enrolledCourses.enrolledAt': -1 } },
            { $limit: 5 },
            {
                $project: {
                    studentName: { $concat: ['$firstName', ' ', '$lastName'] },
                    studentEmail: '$email',
                    courseName: '$enrolledCourses.courseName',
                    courseSlug: '$enrolledCourses.courseSlug',
                    enrolledAt: '$enrolledCourses.enrolledAt',
                    paid: '$enrolledCourses.paid'
                }
            }
        ]);

        // Get popular courses by enrollment count (excluding soft-deleted)
        const popularCourses = await Course.find({ isDeleted: { $ne: true } })
            .sort({ enrolledCount: -1 })
            .limit(5)
            .select('title slug enrolledCount rating price');

        return NextResponse.json({
            stats: {
                totalStudents,
                totalCourses,
                publishedCourses,
                totalEnrollments,
                paidEnrollments,
                newStudentsThisWeek,
                totalRevenue
            },
            recentEnrollments,
            popularCourses
        });

    } catch (error: any) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to fetch dashboard stats' },
            { status: 500 }
        );
    }
}
