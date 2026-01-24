import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Course from '@/models/Course';

// GET - Student Dashboard Stats
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

        // Get enrolled course details
        const enrolledCourseSlugs = user.enrolledCourses.map((c: any) => c.courseSlug);
        const courses = await Course.find({ slug: { $in: enrolledCourseSlugs } });

        // Calculate stats
        const totalCourses = user.enrolledCourses.length;
        const completedCourses = user.enrolledCourses.filter((c: any) => c.progress >= 100).length;
        const inProgressCourses = user.enrolledCourses.filter((c: any) => c.progress > 0 && c.progress < 100).length;

        // Calculate total learning hours (estimate based on course durations)
        let totalLearningMinutes = 0;
        user.enrolledCourses.forEach((enrollment: any) => {
            const course = courses.find(c => c.slug === enrollment.courseSlug);
            if (course && course.duration) {
                // Parse duration like "8 Weeks" or "4 Weeks"
                const weekMatch = course.duration.match(/(\d+)\s*Week/i);
                if (weekMatch) {
                    // Assume ~5 hours per week of course content
                    totalLearningMinutes += parseInt(weekMatch[1]) * 5 * 60 * (enrollment.progress / 100);
                }
            }
        });
        const totalLearningHours = Math.round(totalLearningMinutes / 60);

        // Get currently active course (most recent with progress < 100)
        const activeCourses = user.enrolledCourses
            .filter((c: any) => c.progress < 100)
            .sort((a: any, b: any) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime());

        let currentCourse = null;
        if (activeCourses.length > 0) {
            const activeEnrollment = activeCourses[0];
            const courseDetails = courses.find(c => c.slug === activeEnrollment.courseSlug);
            if (courseDetails) {
                currentCourse = {
                    ...activeEnrollment.toObject(),
                    title: courseDetails.title,
                    description: courseDetails.description,
                    thumbnail: courseDetails.thumbnail,
                    modules: courseDetails.modules,
                    totalLessons: courseDetails.modules?.reduce((sum: number, m: any) =>
                        sum + (m.lessons?.length || 0), 0) || 0
                };
            }
        }

        // Get recent activity (last completed lessons)
        const recentActivity: any[] = [];
        user.enrolledCourses.forEach((enrollment: any) => {
            const course = courses.find(c => c.slug === enrollment.courseSlug);
            if (course && enrollment.completedLessons?.length > 0) {
                // Get last 3 completed lessons
                const lastLessons = enrollment.completedLessons.slice(-3);
                lastLessons.forEach((lessonId: string) => {
                    // Find lesson title from course modules
                    course.modules?.forEach((module: any) => {
                        const lesson = module.lessons?.find((l: any) => l.id === lessonId);
                        if (lesson) {
                            recentActivity.push({
                                type: 'lesson_completed',
                                courseName: course.title,
                                lessonTitle: lesson.title,
                                moduleTitle: module.title
                            });
                        }
                    });
                });
            }
        });

        // Upcoming deadlines / Recommended next steps
        const recommendations: any[] = [];
        activeCourses.slice(0, 2).forEach((enrollment: any) => {
            const course = courses.find(c => c.slug === enrollment.courseSlug);
            if (course) {
                recommendations.push({
                    type: 'continue_learning',
                    courseName: course.title,
                    courseSlug: course.slug,
                    progress: enrollment.progress,
                    message: `Continue "${course.title}" - ${enrollment.progress}% complete`
                });
            }
        });

        return NextResponse.json({
            user: {
                id: user._id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                avatar: user.avatar,
                memberSince: user.createdAt
            },
            stats: {
                totalCourses,
                completedCourses,
                inProgressCourses,
                totalLearningHours,
                certificatesEarned: completedCourses // 1 certificate per completed course
            },
            currentCourse,
            recentActivity: recentActivity.slice(0, 5),
            recommendations
        });

    } catch (error: any) {
        console.error('Error fetching dashboard:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to fetch dashboard' },
            { status: 500 }
        );
    }
}
