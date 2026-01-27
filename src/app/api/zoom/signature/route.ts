import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Course from '@/models/Course';
import { generateZoomSignature, getZoomSdkKey } from '@/lib/zoom';

export async function POST(req: Request) {
    try {
        console.log('=== ZOOM SIGNATURE REQUEST ===');
        await dbConnect();

        const { userId, courseSlug, lessonId } = await req.json();
        console.log('Request params:', { userId, courseSlug, lessonId });

        if (!userId || !courseSlug || !lessonId) {
            console.error('❌ Missing required fields');
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // 1. Verify User & Enrollment
        console.log('Verifying user and enrollment...');
        const user = await User.findById(userId);
        if (!user) {
            console.error('❌ User not found:', userId);
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        console.log('✅ User found:', user.email);

        const isEnrolled = user.enrolledCourses.some(
            (enrollment: any) => enrollment.courseSlug === courseSlug && enrollment.isEnrolled
        );

        // Allow admin to join too
        if (!isEnrolled && user.role !== 'admin') {
            console.error('❌ User not enrolled in course:', courseSlug);
            return NextResponse.json({ message: 'Not enrolled in this course' }, { status: 403 });
        }
        console.log('✅ User is enrolled or is admin');

        // 2. Fetch Meeting Details from Course
        console.log('Fetching course and lesson...');
        const course = await Course.findOne({ slug: courseSlug });
        if (!course) {
            console.error('❌ Course not found:', courseSlug);
            return NextResponse.json({ message: 'Course not found' }, { status: 404 });
        }
        console.log('✅ Course found:', course.title);

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
            console.error('❌ Lesson not found:', lessonId);
            return NextResponse.json({ message: 'Lesson not found' }, { status: 404 });
        }
        console.log('✅ Lesson found:', targetLesson.title);

        if (!targetLesson.zoomMeetingNumber) {
            console.error('❌ No Zoom meeting number configured for lesson:', lessonId);
            return NextResponse.json({ message: 'No live class configured for this lesson' }, { status: 400 });
        }
        console.log('✅ Meeting number:', targetLesson.zoomMeetingNumber);

        // 3. Generate Signature
        // Role 0 for participant, 1 for host. Students are always participants (0).
        console.log('Generating Zoom signature...');
        const signature = generateZoomSignature(targetLesson.zoomMeetingNumber, 0);
        const sdkKey = getZoomSdkKey();

        console.log('✅ Signature generated successfully');
        console.log('SDK Key:', sdkKey.substring(0, 10) + '...');
        console.log('Signature preview:', signature.substring(0, 50) + '...');
        console.log('User name:', `${user.firstName} ${user.lastName}`);
        console.log('=== END ZOOM SIGNATURE REQUEST ===');

        return NextResponse.json({
            signature,
            meetingNumber: targetLesson.zoomMeetingNumber,
            password: targetLesson.zoomPassword || '',
            sdkKey: sdkKey,
            userName: `${user.firstName} ${user.lastName}`,
            userEmail: user.email
        });

    } catch (error: any) {
        console.error('=== ZOOM SIGNATURE ERROR ===');
        console.error('Error:', error);
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        console.error('=== END ERROR ===');
        return NextResponse.json({
            message: error.message || 'Server error',
            debug: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
