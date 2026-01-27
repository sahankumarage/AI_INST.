import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Course from '@/models/Course';
import { generateZoomSignature, getZoomSdkKey } from '@/lib/zoom';

export async function POST(req: Request) {
    try {
        await dbConnect();

        const { userId, courseSlug, lessonId } = await req.json();

        if (!userId || !courseSlug || !lessonId) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // 1. Verify User & Enrollment
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const isEnrolled = user.enrolledCourses.some(
            (enrollment: any) => enrollment.courseSlug === courseSlug && enrollment.isEnrolled
        );

        // Allow admin to join too
        if (!isEnrolled && user.role !== 'admin') {
            return NextResponse.json({ message: 'Not enrolled in this course' }, { status: 403 });
        }

        // 2. Fetch Meeting Details from Course
        const course = await Course.findOne({ slug: courseSlug });
        if (!course) {
            return NextResponse.json({ message: 'Course not found' }, { status: 404 });
        }

        // Find the specific lesson
        let targetLesson: any = null;
        for (const module of course.modules) {
            const lesson = module.lessons.find((l: any) => l.id === lessonId);
            if (lesson) {
                targetLesson = lesson;
                break;
            }
        }

        if (!targetLesson) {
            return NextResponse.json({ message: 'Lesson not found' }, { status: 404 });
        }

        if (!targetLesson.zoomMeetingNumber) {
            return NextResponse.json({ message: 'No live class configured for this lesson' }, { status: 400 });
        }

        // 3. Generate Signature
        // Role 0 for participant, 1 for host. Students are always participants (0).
        const signature = generateZoomSignature(targetLesson.zoomMeetingNumber, 0);

        return NextResponse.json({
            signature,
            meetingNumber: targetLesson.zoomMeetingNumber,
            password: targetLesson.zoomPassword || '',
            sdkKey: getZoomSdkKey(),
            userName: `${user.firstName} ${user.lastName}`,
            userEmail: user.email
        });

    } catch (error: any) {
        console.error('Zoom Signature Error:', error);
        return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
    }
}
