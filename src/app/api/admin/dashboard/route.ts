import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Course from '@/models/Course';

// GET - Admin Dashboard Stats
export async function GET(req: Request) {
    try {
        await dbConnect();

        // Get total students
        const totalStudents = await User.countDocuments({ role: 'student' });

        // Get total courses
        const totalCourses = await Course.countDocuments({});
        const publishedCourses = await Course.countDocuments({ isPublished: true });

        // Get total enrollments
        const enrollmentData = await User.aggregate([
            { $match: { role: 'student' } },
            { $unwind: { path: '$enrolledCourses', preserveNullAndEmptyArrays: true } },
            { $group: { _id: null, totalEnrollments: { $sum: 1 }, paidEnrollments: { $sum: { $cond: ['$enrolledCourses.paid', 1, 0] } } } }
        ]);

        const totalEnrollments = enrollmentData[0]?.totalEnrollments || 0;
        const paidEnrollments = enrollmentData[0]?.paidEnrollments || 0;

        // Get recent students (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const newStudentsThisWeek = await User.countDocuments({
            role: 'student',
            createdAt: { $gte: sevenDaysAgo }
        });

        // Get revenue (sum of paid enrollment amounts)
        const revenueData = await User.aggregate([
            { $match: { role: 'student' } },
            { $unwind: '$enrolledCourses' },
            { $match: { 'enrolledCourses.paid': true } },
            { $group: { _id: null, totalRevenue: { $sum: '$enrolledCourses.amount' } } }
        ]);
        const totalRevenue = revenueData[0]?.totalRevenue || 0;

        // Get recent enrollments
        const recentEnrollments = await User.aggregate([
            { $match: { role: 'student' } },
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

        // Get popular courses by enrollment count
        const popularCourses = await Course.find({})
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
