import { NextResponse } from 'next/server';
import { getZoomAccessToken } from '@/lib/zoom';

/**
 * Test endpoint to verify Zoom Server-to-Server OAuth credentials
 *
 * Usage: GET http://localhost:3000/api/zoom/test-auth
 *
 * Expected success response:
 * {
 *   "success": true,
 *   "message": "Zoom OAuth working correctly",
 *   "tokenPreview": "eyJhbGc...",
 *   "credentials": {
 *     "accountId": "ZOhv...",
 *     "clientId": "b1z6..."
 *   }
 * }
 */
export async function GET() {
    try {
        console.log('=== ZOOM OAUTH TEST ===');
        console.log('Testing Server-to-Server OAuth credentials...');

        const token = await getZoomAccessToken();

        console.log('✅ OAuth token obtained successfully');
        console.log('Token preview:', token.substring(0, 30) + '...');

        return NextResponse.json({
            success: true,
            message: 'Zoom OAuth working correctly',
            tokenPreview: token.substring(0, 30) + '...',
            credentials: {
                accountId: process.env.ZOOM_ACCOUNT_ID?.substring(0, 6) + '...',
                clientId: process.env.ZOOM_CLIENT_ID?.substring(0, 6) + '...'
            }
        });

    } catch (error: any) {
        console.error('❌ OAuth test failed:', error.message);

        return NextResponse.json({
            success: false,
            error: error.message,
            troubleshooting: [
                'Check that .env.local file exists in root directory',
                'Verify ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET are set',
                'Ensure Server-to-Server OAuth app is activated in Zoom Marketplace',
                'Verify credentials match the app in Zoom Marketplace dashboard'
            ]
        }, { status: 500 });
    }
}
