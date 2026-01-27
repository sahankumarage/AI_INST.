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

        console.log('Processing successful payment:', JSON.stringify(data, null, 2));

        const { userId, courseSlug, courseName } = data.metadata || {};
        // Amount might be in data (e.g. data.amount, data.total_amount) or metadata if we put it there
        // Dodo likely returns amount in the main data object
        const amount = data.amount || data.total_amount || data.metadata?.amount || 0;
        const paymentId = data.payment_id || data.id;

        if (!userId || !courseSlug) {
            console.error('Missing metadata in payment:', data);
            return;
        }

        // Update user's enrolled course as paid
        const result = await User.findByIdAndUpdate(userId, {
            $set: {
                'enrolledCourses.$[elem].paid': true,
                'enrolledCourses.$[elem].paymentId': paymentId,
                'enrolledCourses.$[elem].amount': amount,
                'enrolledCourses.$[elem].paymentDate': new Date()
            }
        }, {
            arrayFilters: [{ 'elem.courseSlug': courseSlug }],
            new: true
        });

        if (!result) {
            console.error(`User not found or course not found for user ${userId}, course ${courseSlug}`);
            // Fallback: Add enrollment if it doesn't exist? 
            // Ideally we shouldn't because enrollment happens at "pending" stage in the frontend
            // But if they paid directly via link without enrolling first?
            // For now assume they enrolled first.
        } else {
            console.log(`Payment confirmed for user ${userId}, course ${courseSlug}`);
        }

    } catch (error) {
        console.error('Error processing successful payment:', error);
    }
}

async function handleFailedPayment(data: any) {
    const { userId, courseSlug } = data.metadata || {};
    console.log(`Payment failed for user ${userId}, course ${courseSlug}`);
    // Could send notification email here
}
