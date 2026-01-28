import { NextResponse } from 'next/server';
import { getZoomAccessToken } from '@/lib/zoom';
import axios from 'axios';

/**
 * Create a test Zoom meeting for LMS integration testing
 *
 * Usage: POST http://localhost:3000/api/zoom/create-meeting
 *
 * Body (optional):
 * {
 *   "topic": "Test LMS Live Class",
 *   "duration": 60,
 *   "scheduledTime": "2026-01-27T15:00:00Z"
 * }
 */
export async function POST(req: Request) {
    try {
        console.log('=== CREATING TEST ZOOM MEETING ===');

        const body = await req.json().catch(() => ({}));
        const topic = body.topic || 'Test LMS Live Class - Integration Test';
        const duration = body.duration || 60;
        const startTime = body.scheduledTime || new Date(Date.now() + 3600000).toISOString(); // 1 hour from now

        // Get OAuth access token
        const token = await getZoomAccessToken();
        console.log('✅ OAuth token obtained');

        // Create meeting via Zoom API
        const response = await axios.post(
            'https://api.zoom.us/v2/users/me/meetings',
            {
                topic: topic,
                type: 2, // Scheduled meeting
                start_time: startTime,
                duration: duration,
                timezone: 'UTC',
                settings: {
                    host_video: true,
                    participant_video: true,
                    join_before_host: true,        // CRITICAL: Students can join before instructor
                    waiting_room: false,            // CRITICAL: No waiting room
                    authentication_domains: '',     // No authentication required
                    auto_recording: 'none',
                    approval_type: 2,              // No registration required
                    audio: 'both',
                    mute_upon_entry: false,
                    watermark: false,
                    use_pmi: false
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const meetingData = response.data;

        console.log('✅ Meeting created successfully');
        console.log('Meeting ID:', meetingData.id);
        console.log('Meeting Number:', meetingData.id);
        console.log('Join URL:', meetingData.join_url);
        console.log('Start URL:', meetingData.start_url);

        return NextResponse.json({
            success: true,
            message: 'Test meeting created successfully',
            meeting: {
                id: meetingData.id,
                meetingNumber: String(meetingData.id),  // Use this in database
                topic: meetingData.topic,
                startTime: meetingData.start_time,
                duration: meetingData.duration,
                timezone: meetingData.timezone,
                joinUrl: meetingData.join_url,
                startUrl: meetingData.start_url,
                password: meetingData.password,
                settings: {
                    joinBeforeHost: meetingData.settings.join_before_host,
                    waitingRoom: meetingData.settings.waiting_room,
                }
            },
            instructions: {
                forDatabase: {
                    zoomMeetingNumber: String(meetingData.id),
                    zoomPassword: meetingData.password || '',
                    isLiveClass: true,
                    scheduledAt: meetingData.start_time
                },
                forInstructor: {
                    startUrl: meetingData.start_url,
                    info: 'Open this URL in Zoom desktop app to start the meeting'
                },
                forStudents: {
                    info: 'Students will join via the LMS interface - no direct URL needed'
                }
            }
        });

    } catch (error: any) {
        console.error('=== MEETING CREATION ERROR ===');
        console.error('Error:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);

        let errorMessage = 'Failed to create meeting';
        if (error.response?.status === 401) {
            errorMessage = 'OAuth authentication failed. Check Server-to-Server OAuth app credentials.';
        } else if (error.response?.status === 404) {
            errorMessage = 'User not found. Check ZOOM_ACCOUNT_ID is correct.';
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }

        return NextResponse.json({
            success: false,
            error: errorMessage,
            details: error.response?.data,
            troubleshooting: [
                'Verify Server-to-Server OAuth app is activated',
                'Check ZOOM_ACCOUNT_ID is correct',
                'Ensure OAuth app has meeting:write:admin scope',
                'Verify all credentials in .env.local are correct'
            ]
        }, { status: error.response?.status || 500 });
    }
}
