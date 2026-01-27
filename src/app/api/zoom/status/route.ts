import { NextResponse } from 'next/server';
import { getMeetingStatus } from '@/lib/zoom';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const meetingId = searchParams.get('meetingId');

    if (!meetingId) {
        return NextResponse.json({ message: 'Meeting ID required' }, { status: 400 });
    }

    try {
        const status = await getMeetingStatus(meetingId);
        return NextResponse.json({ status });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
