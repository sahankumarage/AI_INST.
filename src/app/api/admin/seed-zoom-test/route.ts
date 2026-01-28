import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Course from '@/models/Course';

/**
 * Seed a test course with Zoom meeting data for testing
 *
 * Usage: POST http://localhost:3000/api/admin/seed-zoom-test
 *
 * Body:
 * {
 *   "courseSlug": "your-course-slug",
 *   "moduleIndex": 0,
 *   "lessonIndex": 0,
 *   "meetingNumber": "87887878787",
 *   "meetingPassword": "optional",
 *   "scheduledAt": "2026-01-27T15:00:00Z"
 * }
 */
export async function POST(req: Request) {
    try {
        await dbConnect();
        console.log('=== SEEDING ZOOM TEST DATA ===');

        const body = await req.json();
        const {
            courseSlug,
            moduleIndex = 0,
            lessonIndex = 0,
            meetingNumber,
            meetingPassword = '',
            scheduledAt
        } = body;

        if (!courseSlug || !meetingNumber) {
            return NextResponse.json({
                success: false,
                error: 'courseSlug and meetingNumber are required'
            }, { status: 400 });
        }

        // Find course
        const course = await Course.findOne({ slug: courseSlug });
        if (!course) {
            return NextResponse.json({
                success: false,
                error: `Course not found with slug: ${courseSlug}`
            }, { status: 404 });
        }

        // Check module exists
        if (!course.modules[moduleIndex]) {
            return NextResponse.json({
                success: false,
                error: `Module at index ${moduleIndex} not found. Course has ${course.modules.length} modules.`
            }, { status: 404 });
        }

        // Check lesson exists
        if (!course.modules[moduleIndex].lessons[lessonIndex]) {
            return NextResponse.json({
                success: false,
                error: `Lesson at index ${lessonIndex} not found in module ${moduleIndex}. Module has ${course.modules[moduleIndex].lessons.length} lessons.`
            }, { status: 404 });
        }

        // Update lesson with Zoom data
        const lesson = course.modules[moduleIndex].lessons[lessonIndex];
        const oldData = {
            isLiveClass: lesson.isLiveClass,
            zoomMeetingNumber: lesson.zoomMeetingNumber,
            scheduledAt: lesson.scheduledAt
        };

        lesson.isLiveClass = true;
        lesson.zoomMeetingNumber = String(meetingNumber);
        lesson.zoomPassword = meetingPassword;
        lesson.scheduledAt = scheduledAt ? new Date(scheduledAt) : new Date();
        lesson.meetingStatus = 'scheduled';

        await course.save();

        console.log('✅ Course updated successfully');
        console.log('Course:', course.title);
        console.log('Module:', course.modules[moduleIndex].title);
        console.log('Lesson:', lesson.title);
        console.log('Meeting Number:', lesson.zoomMeetingNumber);

        return NextResponse.json({
            success: true,
            message: 'Lesson updated with Zoom meeting data',
            course: {
                slug: course.slug,
                title: course.title
            },
            module: {
                index: moduleIndex,
                title: course.modules[moduleIndex].title
            },
            lesson: {
                index: lessonIndex,
                id: lesson.id,
                title: lesson.title,
                isLiveClass: lesson.isLiveClass,
                zoomMeetingNumber: lesson.zoomMeetingNumber,
                scheduledAt: lesson.scheduledAt
            },
            changes: {
                before: oldData,
                after: {
                    isLiveClass: lesson.isLiveClass,
                    zoomMeetingNumber: lesson.zoomMeetingNumber,
                    scheduledAt: lesson.scheduledAt
                }
            },
            nextSteps: [
                '1. Ensure student is enrolled in this course',
                '2. Start Zoom meeting from desktop app using the meeting number',
                '3. Login as student and navigate to this lesson',
                '4. Click "Join Live Class" button',
                '5. Check browser console for detailed logs'
            ]
        });

    } catch (error: any) {
        console.error('=== SEED ERROR ===');
        console.error('Error:', error);

        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to seed Zoom test data',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}

/**
 * Get course structure to help identify module and lesson indices
 *
 * Usage: GET http://localhost:3000/api/admin/seed-zoom-test?courseSlug=your-slug
 */
export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const courseSlug = searchParams.get('courseSlug');

        if (!courseSlug) {
            // List all courses
            const courses = await Course.find({ isDeleted: { $ne: true } })
                .select('slug title modules.title modules.lessons.id modules.lessons.title')
                .limit(10);

            return NextResponse.json({
                success: true,
                courses: courses.map(c => ({
                    slug: c.slug,
                    title: c.title,
                    moduleCount: c.modules.length
                })),
                message: 'Use ?courseSlug=slug to see course structure'
            });
        }

        // Get specific course structure
        const course = await Course.findOne({ slug: courseSlug });
        if (!course) {
            return NextResponse.json({
                success: false,
                error: `Course not found: ${courseSlug}`
            }, { status: 404 });
        }

        const structure = {
            slug: course.slug,
            title: course.title,
            modules: course.modules.map((module: any, mIdx: number) => ({
                index: mIdx,
                id: module.id,
                title: module.title,
                lessons: module.lessons.map((lesson: any, lIdx: number) => ({
                    index: lIdx,
                    id: lesson.id,
                    title: lesson.title,
                    isLiveClass: lesson.isLiveClass || false,
                    hasZoomMeeting: !!lesson.zoomMeetingNumber
                }))
            }))
        };

        return NextResponse.json({
            success: true,
            course: structure,
            usage: {
                toSeedLesson: {
                    method: 'POST',
                    url: '/api/admin/seed-zoom-test',
                    body: {
                        courseSlug: course.slug,
                        moduleIndex: 0,
                        lessonIndex: 0,
                        meetingNumber: 'YOUR_MEETING_NUMBER',
                        scheduledAt: new Date().toISOString()
                    }
                }
            }
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
