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
                // Find user first to check if already enrolled
                const user = await User.findById(userId);

                if (user) {
                    const isEnrolled = user.enrolledCourses?.some((c: any) => c.courseSlug === courseSlug);

                    if (isEnrolled) {
                        // Update existing enrollment
                        await User.updateOne(
                            { _id: userId, "enrolledCourses.courseSlug": courseSlug },
                            {
                                $set: {
                                    "enrolledCourses.$.paid": true,
                                    "enrolledCourses.$.paymentId": paymentId,
                                    "enrolledCourses.$.amount": payment.total_amount / 100,
                                    "enrolledCourses.$.paymentDate": new Date()
                                }
                            }
                        );
                    } else {
                        // Create new enrollment
                        await User.findByIdAndUpdate(userId, {
                            $push: {
                                enrolledCourses: {
                                    courseSlug,
                                    courseName: payment.metadata?.courseName || courseSlug,
                                    paid: true,
                                    paymentId,
                                    amount: payment.total_amount / 100,
                                    enrolledAt: new Date(),
                                    progress: 0,
                                    completedLessons: []
                                }
                            }
                        });
                    }

                    // Create Payment Record for Admin Dashboard
                    try {
                        const Payment = (await import('@/models/Payment')).default;
                        await Payment.create({
                            userId: userId,
                            courseSlug: courseSlug,
                            amount: payment.total_amount / 100,
                            method: 'online', // Correct enum value
                            status: 'completed',
                            transactionId: paymentId,
                            submittedAt: new Date(),
                            processedAt: new Date()
                        });
                    } catch (paymentRecordError) {
                        console.error("Failed to create payment record:", paymentRecordError);
                        // Don't fail the request, just log it. The user got their course access.
                    }
                }
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
