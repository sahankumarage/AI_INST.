/**
 * Dodo Payment Webhook Handler
 * Verifies payments and grants course access based on transaction metadata
 */

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PaymentTransaction from '@/models/PaymentTransaction';
import Enrollment from '@/models/Enrollment';
import User from '@/models/User';
import { incrementPromoCodeUsage } from '@/lib/paymentUtils';

// ============================================
// Webhook Secret Verification (Optional)
// ============================================
const WEBHOOK_SECRET = process.env.DODO_WEBHOOK_SECRET;

function verifyWebhookSignature(
    payload: string,
    signature: string | null
): boolean {
    // If no secret configured, skip verification (not recommended for production)
    if (!WEBHOOK_SECRET) {
        console.warn('DODO_WEBHOOK_SECRET not configured - skipping signature verification');
        return true;
    }

    // Dodo uses HMAC-SHA256 for webhook signatures
    // Implement based on Dodo's documentation
    // For now, we'll skip verification if secret is set
    // TODO: Implement proper HMAC verification when Dodo provides documentation

    return true;
}

// ============================================
// POST: Handle Dodo Webhook
// ============================================

export async function POST(req: Request) {
    console.log('=== DODO WEBHOOK RECEIVED ===');
    console.log('Timestamp:', new Date().toISOString());

    try {
        await dbConnect();

        // Get raw body for signature verification
        const rawBody = await req.text();
        const signature = req.headers.get('x-dodo-signature');

        // Verify webhook signature
        if (!verifyWebhookSignature(rawBody, signature)) {
            console.error('Webhook signature verification failed');
            return NextResponse.json(
                { message: 'Invalid signature' },
                { status: 401 }
            );
        }

        // Parse webhook payload
        const payload = JSON.parse(rawBody);
        console.log('Webhook Payload:', JSON.stringify(payload, null, 2));

        // Extract event type and data
        const eventType = payload.type || payload.event;
        const paymentData = payload.data || payload;

        console.log('Event Type:', eventType);

        // ----------------------------------------
        // Handle different webhook events
        // ----------------------------------------

        switch (eventType) {
            case 'payment.succeeded':
            case 'payment.completed':
            case 'payment_intent.succeeded':
                return await handlePaymentSuccess(paymentData, payload);

            case 'payment.failed':
            case 'payment_intent.failed':
                return await handlePaymentFailure(paymentData, payload);

            case 'payment.refunded':
                return await handlePaymentRefund(paymentData, payload);

            default:
                console.log('Unhandled webhook event type:', eventType);
                return NextResponse.json({
                    success: true,
                    message: `Event ${eventType} acknowledged`
                });
        }

    } catch (error: any) {
        console.error('=== WEBHOOK ERROR ===');
        console.error('Error:', error);

        return NextResponse.json(
            { message: 'Webhook processing failed', error: error.message },
            { status: 500 }
        );
    }
}

// ============================================
// Payment Success Handler
// ============================================

async function handlePaymentSuccess(paymentData: any, fullPayload: any) {
    console.log('Processing successful payment...');

    // Extract payment ID and metadata
    const paymentId = paymentData.payment_id || paymentData.id;
    const metadata = paymentData.metadata || {};

    console.log('Payment ID:', paymentId);
    console.log('Metadata:', JSON.stringify(metadata, null, 2));

    // Find transaction by Dodo payment ID or transaction reference
    let transaction = await PaymentTransaction.findOne({
        $or: [
            { dodoPaymentId: paymentId },
            { transactionRef: metadata.transactionRef }
        ]
    });

    if (!transaction) {
        console.error('Transaction not found for payment:', paymentId);

        // Create a new transaction record from webhook data
        transaction = new PaymentTransaction({
            transactionRef: metadata.transactionRef || `WH-${paymentId}`,
            userId: metadata.userId || 'unknown',
            courseSlug: metadata.courseSlug || 'unknown',
            courseName: metadata.courseName || 'Unknown Course',
            courseId: metadata.courseId || 'unknown',
            originalPrice: parseFloat(metadata.originalPrice) || 0,
            finalPrice: parseFloat(metadata.finalPrice) || 0,
            currency: metadata.currency || 'LKR',
            dodoPaymentId: paymentId,
            status: 'completed',
            webhookReceivedAt: new Date(),
            webhookPayload: fullPayload,
            discountCode: metadata.discountCode || undefined
        });
        await transaction.save();
    }

    // Update transaction status
    transaction.status = 'completed';
    transaction.completedAt = new Date();
    transaction.webhookReceivedAt = new Date();
    transaction.webhookPayload = fullPayload;
    await transaction.save();

    console.log('Transaction updated to completed:', transaction.transactionRef);

    // ----------------------------------------
    // Grant course access
    // ----------------------------------------

    try {
        const { userId, courseSlug, courseName, courseId } = transaction;

        // Check if enrollment already exists
        const existingEnrollment = await Enrollment.findOne({
            $or: [
                { 'user.id': userId, courseSlug },
                { userId, courseSlug }
            ]
        });

        if (existingEnrollment) {
            console.log('Enrollment already exists, updating status...');
            existingEnrollment.status = 'active';
            existingEnrollment.paymentStatus = 'paid';
            existingEnrollment.paidAt = new Date();
            existingEnrollment.paymentRef = transaction.transactionRef;
            await existingEnrollment.save();
        } else {
            // Create new enrollment
            console.log('Creating new enrollment...');
            const enrollment = new Enrollment({
                userId,
                courseSlug,
                courseName,
                courseId,
                status: 'active',
                paymentStatus: 'paid',
                paymentMethod: 'card',
                paymentRef: transaction.transactionRef,
                amountPaid: transaction.finalPrice,
                enrolledAt: new Date(),
                paidAt: new Date(),
                progress: 0
            });
            await enrollment.save();
        }

        // Update user's enrolled courses
        await User.findByIdAndUpdate(
            userId,
            {
                $addToSet: {
                    enrolledCourses: {
                        courseSlug,
                        courseName,
                        enrolledAt: new Date(),
                        progress: 0
                    }
                }
            }
        );

        console.log('Course access granted for:', courseSlug);

        // Increment promo code usage if applicable
        if (transaction.discountCode) {
            await incrementPromoCodeUsage(courseSlug, transaction.discountCode);
            console.log('Promo code usage incremented:', transaction.discountCode);
        }

    } catch (enrollError: any) {
        console.error('Failed to grant course access:', enrollError);
        transaction.errorMessage = `Enrollment failed: ${enrollError.message}`;
        await transaction.save();
    }

    return NextResponse.json({
        success: true,
        message: 'Payment processed successfully',
        transactionRef: transaction.transactionRef
    });
}

// ============================================
// Payment Failure Handler
// ============================================

async function handlePaymentFailure(paymentData: any, fullPayload: any) {
    console.log('Processing failed payment...');

    const paymentId = paymentData.payment_id || paymentData.id;
    const metadata = paymentData.metadata || {};
    const errorMessage = paymentData.failure_reason || paymentData.error || 'Payment failed';

    // Find and update transaction
    const transaction = await PaymentTransaction.findOne({
        $or: [
            { dodoPaymentId: paymentId },
            { transactionRef: metadata.transactionRef }
        ]
    });

    if (transaction) {
        transaction.status = 'failed';
        transaction.errorMessage = errorMessage;
        transaction.webhookReceivedAt = new Date();
        transaction.webhookPayload = fullPayload;
        transaction.retryCount += 1;
        await transaction.save();
        console.log('Transaction marked as failed:', transaction.transactionRef);
    }

    return NextResponse.json({
        success: true,
        message: 'Payment failure recorded'
    });
}

// ============================================
// Payment Refund Handler
// ============================================

async function handlePaymentRefund(paymentData: any, fullPayload: any) {
    console.log('Processing refund...');

    const paymentId = paymentData.payment_id || paymentData.id;
    const metadata = paymentData.metadata || {};

    // Find and update transaction
    const transaction = await PaymentTransaction.findOne({
        $or: [
            { dodoPaymentId: paymentId },
            { transactionRef: metadata.transactionRef }
        ]
    });

    if (transaction) {
        transaction.status = 'refunded';
        transaction.webhookReceivedAt = new Date();
        transaction.webhookPayload = fullPayload;
        await transaction.save();
        console.log('Transaction marked as refunded:', transaction.transactionRef);

        // Optionally revoke course access
        await Enrollment.updateOne(
            { paymentRef: transaction.transactionRef },
            { status: 'cancelled', paymentStatus: 'refunded' }
        );
    }

    return NextResponse.json({
        success: true,
        message: 'Refund processed'
    });
}
