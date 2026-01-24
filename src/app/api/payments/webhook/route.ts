import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

const DODO_WEBHOOK_SECRET = process.env.DODO_PAYMENTS_WEBHOOK_SECRET;

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = req.headers.get('x-dodo-signature');

        // Verify webhook signature (implement based on Dodo's documentation)
        // if (!verifyWebhookSignature(body, signature, DODO_WEBHOOK_SECRET)) {
        //   return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
        // }

        const event = JSON.parse(body);

        // Handle different event types
        switch (event.type) {
            case 'checkout.session.completed':
                await handleSuccessfulPayment(event.data);
                break;
            case 'payment.failed':
                await handleFailedPayment(event.data);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { message: error.message || 'Webhook processing failed' },
            { status: 500 }
        );
    }
}

async function handleSuccessfulPayment(data: any) {
    try {
        await dbConnect();

        const { userId, courseSlug, courseName, amount } = data.metadata || {};

        if (!userId || !courseSlug) {
            console.error('Missing metadata in payment');
            return;
        }

        // Update user's enrolled course as paid
        await User.findByIdAndUpdate(userId, {
            $set: {
                'enrolledCourses.$[elem].paid': true,
                'enrolledCourses.$[elem].paymentId': data.payment_id,
                'enrolledCourses.$[elem].amount': amount
            }
        }, {
            arrayFilters: [{ 'elem.courseSlug': courseSlug }]
        });

        console.log(`Payment successful for user ${userId}, course ${courseSlug}`);

    } catch (error) {
        console.error('Error processing successful payment:', error);
    }
}

async function handleFailedPayment(data: any) {
    const { userId, courseSlug } = data.metadata || {};
    console.log(`Payment failed for user ${userId}, course ${courseSlug}`);
    // Could send notification email here
}
