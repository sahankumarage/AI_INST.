/**
 * Payment Verification API
 * Verifies payment status and enrolls user in course
 * Supports verification by paymentId (from Dodo) or transactionRef
 */

import { NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import PaymentTransaction from '@/models/PaymentTransaction';
import Course from '@/models/Course';

const client = new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY,
    environment: 'live_mode',
});

export async function GET(req: Request) {
    console.log('=== PAYMENT VERIFICATION REQUEST ===');

    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const paymentId = searchParams.get('paymentId');
        const transactionRef = searchParams.get('ref');
        const userId = searchParams.get('userId');
        const courseSlug = searchParams.get('courseSlug');

        console.log('Verification params:', { paymentId, transactionRef, userId, courseSlug });

        // Need at least paymentId or transactionRef
        if (!paymentId && !transactionRef) {
            return NextResponse.json(
                { success: false, message: 'Missing paymentId or transaction reference' },
                { status: 400 }
            );
        }

        let payment: any = null;
        let transaction: any = null;
        let finalUserId = userId;
        let finalCourseSlug = courseSlug;
        let courseName = '';

        // ----------------------------------------
        // Strategy 1: Verify via Dodo paymentId
        // ----------------------------------------
        if (paymentId) {
            try {
                console.log('Fetching payment from Dodo:', paymentId);
                payment = await client.payments.retrieve(paymentId);
                console.log('Dodo payment status:', payment.status);
                console.log('Dodo payment metadata:', payment.metadata);

                // Extract metadata from Dodo payment
                if (payment.metadata) {
                    finalUserId = finalUserId || payment.metadata.userId;
                    finalCourseSlug = finalCourseSlug || payment.metadata.courseSlug;
                    courseName = payment.metadata.courseName || '';
                }
            } catch (dodoError: any) {
                console.error('Dodo API error:', dodoError.message);
                // Continue to try transactionRef lookup
            }
        }

        // ----------------------------------------
        // Strategy 2: Look up our transaction record
        // ----------------------------------------
        if (transactionRef || paymentId) {
            const query: any = {};
            if (transactionRef) query.transactionRef = transactionRef;
            if (paymentId) query.dodoPaymentId = paymentId;

            transaction = await PaymentTransaction.findOne({
                $or: Object.keys(query).map(k => ({ [k]: query[k] }))
            });

            if (transaction) {
                console.log('Found transaction:', transaction.transactionRef, 'Status:', transaction.status);
                finalUserId = finalUserId || transaction.userId;
                finalCourseSlug = finalCourseSlug || transaction.courseSlug;
                courseName = transaction.courseName || courseName;
            }
        }

        // ----------------------------------------
        // Determine payment success
        // ----------------------------------------
        const isPaymentSuccessful =
            payment?.status === 'succeeded' ||
            payment?.status === 'completed' ||
            transaction?.status === 'completed';

        console.log('Payment successful:', isPaymentSuccessful);

        if (!isPaymentSuccessful) {
            // Check if payment is still processing
            const isProcessing =
                payment?.status === 'pending' ||
                payment?.status === 'processing' ||
                transaction?.status === 'processing' ||
                transaction?.status === 'pending';

            if (isProcessing) {
                return NextResponse.json({
                    success: false,
                    status: 'processing',
                    message: 'Payment is still being processed'
                });
            }

            return NextResponse.json({
                success: false,
                status: payment?.status || transaction?.status || 'unknown',
                message: 'Payment not yet confirmed'
            });
        }

        // ----------------------------------------
        // Enroll user in course
        // ----------------------------------------
        if (!finalUserId || !finalCourseSlug) {
            console.error('Missing userId or courseSlug for enrollment');
            return NextResponse.json({
                success: true,
                verified: true,
                status: 'succeeded',
                message: 'Payment verified but enrollment info missing. Please contact support.'
            });
        }

        console.log('Enrolling user:', finalUserId, 'in course:', finalCourseSlug);

        // Get course details
        const course = await Course.findOne({ slug: finalCourseSlug });
        if (course) {
            courseName = course.title;
        }

        // Check if user exists and is already enrolled
        const user = await User.findById(finalUserId);
        if (!user) {
            console.error('User not found:', finalUserId);
            return NextResponse.json({
                success: true,
                verified: true,
                status: 'succeeded',
                message: 'Payment verified but user not found. Please contact support.'
            });
        }

        const isAlreadyEnrolled = user.enrolledCourses?.some(
            (c: any) => c.courseSlug === finalCourseSlug && c.paid === true
        );

        if (isAlreadyEnrolled) {
            console.log('User already enrolled and paid');
            return NextResponse.json({
                success: true,
                verified: true,
                status: 'succeeded',
                message: 'Already enrolled in this course'
            });
        }

        // Check if there's a pending enrollment to update
        const existingEnrollmentIndex = user.enrolledCourses?.findIndex(
            (c: any) => c.courseSlug === finalCourseSlug
        );

        if (existingEnrollmentIndex !== undefined && existingEnrollmentIndex >= 0) {
            // Update existing enrollment to paid
            await User.updateOne(
                { _id: finalUserId, "enrolledCourses.courseSlug": finalCourseSlug },
                {
                    $set: {
                        "enrolledCourses.$.paid": true,
                        "enrolledCourses.$.isPendingVerification": false,
                        "enrolledCourses.$.paymentId": paymentId || transaction?.dodoPaymentId,
                        "enrolledCourses.$.amount": transaction?.finalPrice || (payment?.total_amount / 100),
                        "enrolledCourses.$.paymentDate": new Date()
                    }
                }
            );
            console.log('Updated existing enrollment to paid');
        } else {
            // Create new enrollment
            await User.findByIdAndUpdate(finalUserId, {
                $push: {
                    enrolledCourses: {
                        courseSlug: finalCourseSlug,
                        courseName: courseName || finalCourseSlug,
                        paid: true,
                        isPendingVerification: false,
                        paymentId: paymentId || transaction?.dodoPaymentId,
                        amount: transaction?.finalPrice || (payment?.total_amount / 100),
                        enrolledAt: new Date(),
                        paymentDate: new Date(),
                        progress: 0,
                        completedLessons: []
                    }
                }
            });
            console.log('Created new paid enrollment');
        }

        // ----------------------------------------
        // Update transaction record
        // ----------------------------------------
        if (transaction && transaction.status !== 'completed') {
            transaction.status = 'completed';
            transaction.completedAt = new Date();
            await transaction.save();
            console.log('Transaction marked as completed');
        }

        // ----------------------------------------
        // Create Payment record for admin dashboard
        // ----------------------------------------
        try {
            const Payment = (await import('@/models/Payment')).default;

            const existingPaymentRecord = await Payment.findOne({
                transactionId: paymentId || transaction?.dodoPaymentId
            });

            if (!existingPaymentRecord) {
                await Payment.create({
                    userId: finalUserId,
                    courseSlug: finalCourseSlug,
                    amount: transaction?.finalPrice || (payment?.total_amount / 100),
                    method: 'online',
                    status: 'completed',
                    transactionId: paymentId || transaction?.dodoPaymentId || transactionRef,
                    submittedAt: new Date(),
                    processedAt: new Date()
                });
                console.log('Payment record created for admin dashboard');
            }
        } catch (paymentRecordError) {
            console.error('Failed to create payment record:', paymentRecordError);
            // Don't fail the verification
        }

        return NextResponse.json({
            success: true,
            verified: true,
            status: 'succeeded',
            message: 'Payment verified and course access granted',
            courseSlug: finalCourseSlug,
            courseName
        });

    } catch (error: any) {
        console.error('=== VERIFICATION ERROR ===');
        console.error('Error:', error);

        return NextResponse.json(
            {
                success: false,
                message: error.message || 'Verification failed',
                status: 'error'
            },
            { status: 500 }
        );
    }
}
