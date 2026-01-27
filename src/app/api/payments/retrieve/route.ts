import { NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';
import dbConnect from '@/lib/db';
import User from '@/models/User';

const client = new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY,
    environment: 'test_mode', // Defaults to 'live_mode'
});

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const paymentId = searchParams.get('paymentId');

        if (!paymentId) {
            return NextResponse.json({ message: 'Missing paymentId' }, { status: 400 });
        }

        // Fetch payment details from Dodo
        const payment = await client.payments.retrieve(paymentId);

        if (payment.status === 'succeeded') {
            await dbConnect();

            const { userId, courseSlug } = payment.metadata || {};

            if (userId && courseSlug) {
                // Update user enrollment
                await User.findByIdAndUpdate(userId, {
                    $set: {
                        'enrolledCourses.$[elem].paid': true,
                        'enrolledCourses.$[elem].paymentId': paymentId,
                        'enrolledCourses.$[elem].amount': payment.total_amount, // Adjust mapping if needed
                        'enrolledCourses.$[elem].paymentDate': new Date()
                    }
                }, {
                    arrayFilters: [{ 'elem.courseSlug': courseSlug }],
                    new: true
                });
            }

            return NextResponse.json({
                status: 'succeeded',
                verified: true
            });
        }

        return NextResponse.json({
            status: payment.status,
            verified: false
        });

    } catch (error: any) {
        console.error('Payment retrieval error:', error);
        return NextResponse.json(
            { message: error.message || 'Verification failed' },
            { status: 500 }
        );
    }
}
