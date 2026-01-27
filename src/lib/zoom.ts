import axios from 'axios';
import KJUR from 'jsrsasign';

const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID;
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const ZOOM_SDK_KEY = process.env.ZOOM_SDK_KEY;
const ZOOM_SDK_SECRET = process.env.ZOOM_SDK_SECRET;

// Cache token
let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

export async function getZoomAccessToken() {
    const now = Date.now();
    if (cachedToken && now < tokenExpiresAt - 60000) { // Buffer 1 min
        return cachedToken;
    }

    try {
        const auth = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64');
        const response = await axios.post('https://zoom.us/oauth/token', null, {
            params: {
                grant_type: 'account_credentials',
                account_id: ZOOM_ACCOUNT_ID
            },
            headers: {
                Authorization: `Basic ${auth}`
            }
        });

        cachedToken = response.data.access_token;
        // Expires in 3600 seconds typically
        tokenExpiresAt = now + (response.data.expires_in * 1000);
        return cachedToken;
    } catch (error: any) {
        console.error('Error fetching Zoom token:', error?.response?.data || error.message);
        throw new Error('Failed to get Zoom access token');
    }
}

/**
 * Generate Zoom Meeting SDK signature for joining meetings
 * 
 * Uses the credentials from the General App (SDK credentials):
 * - appKey: ZOOM_SDK_KEY
 * - sdkKey: ZOOM_SDK_KEY
 * - Signed with: ZOOM_SDK_SECRET
 * 
 * @param meetingNumber - The Zoom meeting number
 * @param role - 0 for participant, 1 for host
 * @returns JWT signature string
 */
export function generateZoomSignature(meetingNumber: string, role: number = 0): string {
    // Explicitly use the SDK credentials for signature
    const appKey = ZOOM_SDK_KEY;
    const appSecret = ZOOM_SDK_SECRET;

    if (!appKey || !appSecret) {
        console.error('Missing Zoom SDK credentials.');
        throw new Error('Zoom SDK credentials missing. Please check ZOOM_SDK_KEY and ZOOM_SDK_SECRET');
    }

    // Clean the meeting number - remove any spaces or dashes
    const cleanMeetingNumber = meetingNumber.replace(/[\s-]/g, '');

    // Meeting number must be an integer for the payload
    const meetingNumberInt = parseInt(cleanMeetingNumber, 10);

    if (isNaN(meetingNumberInt)) {
        throw new Error('Invalid meeting number');
    }

    const iat = Math.round(Date.now() / 1000) - 30;
    const exp = iat + 60 * 60 * 2; // 2 hours expiry

    const oHeader = { alg: 'HS256', typ: 'JWT' };

    // Payload format per official Zoom documentation for Meeting SDK
    const oPayload = {
        appKey: appKey,     // Use SDK Key
        sdkKey: appKey,     // Use SDK Key
        mn: meetingNumberInt,   // CRITICAL: Must be integer
        role: role,
        iat: iat,
        exp: exp,
        tokenExp: exp
    };

    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);

    // Sign with HS256 using the SDK Secret
    const signature = KJUR.KJUR.jws.JWS.sign('HS256', sHeader, sPayload, appSecret);

    console.log('Zoom Signature Debug:');
    console.log('  App Key:', appKey.substring(0, 5) + '...');
    console.log('  Meeting Number (Int):', meetingNumberInt);
    console.log('  Role:', role);
    console.log('  IAT:', iat);
    console.log('  EXP:', exp);

    return signature;
}

export function getZoomSdkKey(): string {
    return ZOOM_SDK_KEY || '';
}

export async function getMeetingStatus(meetingId: string) {
    try {
        const token = await getZoomAccessToken();
        const response = await axios.get(`https://api.zoom.us/v2/meetings/${meetingId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Zoom status: waiting, started, finished
        return response.data.status;
    } catch (error: any) {
        console.error('Error fetching meeting status:', error?.response?.data || error.message);
        if (error?.response?.status === 404) {
            return 'not_found';
        }
        throw new Error('Failed to get meeting status');
    }
}
