import { NextResponse } from 'next/server';
import { generateZoomSignature, getZoomSdkKey } from '@/lib/zoom';

/**
 * Test endpoint to verify Zoom SDK signature generation
 *
 * Usage: GET http://localhost:3000/api/zoom/test-signature?meetingNumber=87887878787
 *
 * Expected success response:
 * {
 *   "success": true,
 *   "message": "Zoom SDK signature generated successfully",
 *   "sdkKey": "ISf5...",
 *   "signaturePreview": "eyJhbG...",
 *   "meetingNumber": "87887878787"
 * }
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const meetingNumber = searchParams.get('meetingNumber') || '87887878787';

        console.log('=== ZOOM SIGNATURE TEST ===');
        console.log('Testing Meeting SDK signature generation...');
        console.log('Meeting Number:', meetingNumber);

        const sdkKey = getZoomSdkKey();
        if (!sdkKey) {
            throw new Error('ZOOM_SDK_KEY not configured');
        }

        const signature = generateZoomSignature(meetingNumber, 0);

        console.log('✅ Signature generated successfully');
        console.log('SDK Key:', sdkKey.substring(0, 6) + '...');
        console.log('Signature preview:', signature.substring(0, 50) + '...');

        return NextResponse.json({
            success: true,
            message: 'Zoom SDK signature generated successfully',
            sdkKey: sdkKey.substring(0, 10) + '...',
            signaturePreview: signature.substring(0, 50) + '...',
            meetingNumber: meetingNumber,
            signatureLength: signature.length
        });

    } catch (error: any) {
        console.error('❌ Signature generation failed:', error.message);

        return NextResponse.json({
            success: false,
            error: error.message,
            troubleshooting: [
                'Check that ZOOM_SDK_KEY and ZOOM_SDK_SECRET are set in .env.local',
                'Verify these are from the Meeting SDK App (General App), not OAuth app',
                'Ensure meeting number is in numeric format (no spaces or dashes)',
                'Check that Meeting SDK app is activated in Zoom Marketplace'
            ]
        }, { status: 500 });
    }
}
