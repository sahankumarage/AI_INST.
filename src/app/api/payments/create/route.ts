/**
 * Dynamic Payment Creation API
 * Creates Dodo payments with dynamic pricing and full transaction tracking
 */

import { NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';
import dbConnect from '@/lib/db';
import Course from '@/models/Course';
import PaymentTransaction from '@/models/PaymentTransaction';
import {
    generateTransactionRef,
    validateAndCalculateDiscount,
    toSmallestUnit,
    getPaymentDisplayName
} from '@/lib/paymentUtils';

// Initialize Dodo client
const client = new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY,
    environment: 'live_mode',
});

// ============================================
// POST: Create Dynamic Payment
// ============================================

export async function POST(req: Request) {
    try {
        await dbConnect();

        // Get request data
        const {
            userId,
            courseSlug,
            promoCode,
            successUrl,
            cancelUrl,
            userEmail,
            userName
        } = await req.json();

        // Get client info for logging
        const ipAddress = req.headers.get('x-forwarded-for') || 'unknown';
        const userAgent = req.headers.get('user-agent') || 'unknown';

        console.log('=== PAYMENT CREATION REQUEST ===');
        console.log('User ID:', userId);
        console.log('Course Slug:', courseSlug);
        console.log('Promo Code:', promoCode || 'None');

        // ----------------------------------------
        // STEP 1: Validate input
        // ----------------------------------------
        if (!userId || !courseSlug) {
            return NextResponse.json(
                { message: 'User ID and Course Slug are required' },
                { status: 400 }
            );
        }

        // ----------------------------------------
        // STEP 2: Fetch course and validate
        // ----------------------------------------
        const course = await Course.findOne({ slug: courseSlug });

        if (!course) {
            return NextResponse.json(
                { message: 'Course not found' },
                { status: 404 }
            );
        }

        // Use course's productId or fallback to default product from env
        const productId = course.productId || process.env.DODO_PRODUCT_ID;

        if (!productId) {
            return NextResponse.json(
                { message: 'Payment not configured. Please set DODO_DEFAULT_PRODUCT_ID or add productId to course.' },
                { status: 400 }
            );
        }

        console.log('Course found:', course.title);
        console.log('Original Price:', course.price, course.currency);
        console.log('Product ID:', productId, course.productId ? '(from course)' : '(default)');

        // ----------------------------------------
        // STEP 3: Calculate discount
        // ----------------------------------------
        const discountResult = await validateAndCalculateDiscount(
            courseSlug,
            promoCode,
            course.price
        );

        console.log('Discount Result:', discountResult);

        // ----------------------------------------
        // STEP 4: Generate unique transaction reference
        // ----------------------------------------
        const transactionRef = generateTransactionRef(courseSlug);
        console.log('Transaction Reference:', transactionRef);

        // ----------------------------------------
        // STEP 5: Create payment transaction record
        // ----------------------------------------
        const transaction = new PaymentTransaction({
            transactionRef,
            userId,
            userEmail,
            userName,
            courseId: course._id.toString(),
            courseSlug: course.slug,
            courseName: course.title,
            originalPrice: course.price,
            finalPrice: discountResult.finalPrice,
            currency: course.currency || 'LKR',
            dodoProductId: productId,
            status: 'pending',
            paymentMethod: 'card',
            ipAddress,
            userAgent,
            ...(discountResult.isValid && promoCode && {
                discountCode: promoCode.toUpperCase(),
                discountType: discountResult.discountType,
                discountAmount: discountResult.discountAmount,
                discountValue: discountResult.discountValue
            }),
            metadata: {
                promoValidation: discountResult,
                requestTimestamp: new Date().toISOString()
            }
        });

        await transaction.save();
        console.log('Transaction record created:', transaction._id);

        // ----------------------------------------
        // STEP 6: Convert LKR to USD for Dodo
        // ----------------------------------------
        // Dodo doesn't support LKR, so we convert to USD
        const LKR_TO_USD_RATE = 0.0031; // 1 LKR = $0.0031 USD (approx 323 LKR = $1)

        let dodoCurrency = course.currency || 'LKR';
        let dodoAmount = discountResult.finalPrice;

        // Convert LKR to USD
        if (dodoCurrency === 'LKR') {
            dodoAmount = Math.round(discountResult.finalPrice * LKR_TO_USD_RATE * 100) / 100;
            dodoCurrency = 'USD';
            console.log(`Converting ${discountResult.finalPrice} LKR to ${dodoAmount} USD`);
        }

        const priceInSmallestUnit = toSmallestUnit(dodoAmount);

        console.log(`Payment Details:`);
        console.log(`  LKR Amount: ${discountResult.finalPrice} LKR`);
        console.log(`  USD Amount: ${dodoAmount} USD`);
        console.log(`  Smallest Unit: ${priceInSmallestUnit}`);

        // ----------------------------------------
        // STEP 7: Create Dodo payment session
        // ----------------------------------------
        const displayName = getPaymentDisplayName(
            course.title,
            discountResult.discountValue ? discountResult.discountValue > 0 : false
        );

        const returnUrl = successUrl ||
            `${process.env.NEXT_PUBLIC_APP_URL}/portal/student/courses?enrolled=success&ref=${transactionRef}`;

        console.log('Creating Dodo payment session...');
        console.log('Display Name:', displayName);
        console.log('Return URL:', returnUrl);

        const session = await client.payments.create({
            billing: {
                city: 'Global',
                country: 'US',
                state: 'NY',
                street: 'Digital',
                zipcode: '00000',
            },
            customer: {
                email: userEmail || 'student@aiinstitute.io',
                name: userName || 'Student',
            },
            product_cart: [
                {
                    product_id: productId,
                    quantity: 1,
                    amount: priceInSmallestUnit, // Amount in smallest unit (paisa for LKR)
                },
            ],
            billing_currency: dodoCurrency, // USD after conversion
            payment_link: true,
            return_url: returnUrl,
            metadata: {
                transactionRef,
                userId,
                courseSlug,
                courseId: course._id.toString(),
                courseName: course.title,
                originalPrice: course.price.toString(),
                finalPrice: discountResult.finalPrice.toString(),
                discountCode: promoCode || '',
                discountValue: (discountResult.discountValue || 0).toString(),
                currency: course.currency || 'LKR'
            }
        });

        console.log('Dodo payment session created:', session.payment_id);

        // ----------------------------------------
        // STEP 8: Update transaction with Dodo details
        // ----------------------------------------
        transaction.dodoPaymentId = session.payment_id;
        transaction.paymentLink = session.payment_link;
        transaction.status = 'processing';
        await transaction.save();

        // ----------------------------------------
        // STEP 9: Return payment URL
        // ----------------------------------------
        return NextResponse.json({
            success: true,
            paymentUrl: session.payment_link,
            sessionId: session.payment_id,
            transactionRef,
            pricing: {
                originalPrice: course.price,
                finalPrice: discountResult.finalPrice,
                discountApplied: discountResult.discountValue || 0,
                currency: course.currency || 'LKR'
            }
        });

    } catch (error: any) {
        console.error('=== PAYMENT CREATION ERROR ===');
        console.error('Error:', error);

        return NextResponse.json(
            {
                success: false,
                message: error.message || 'Payment creation failed',
                error: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}

// ============================================
// GET: Retrieve transaction by reference
// ============================================

export async function GET(req: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const transactionRef = searchParams.get('ref');
        const userId = searchParams.get('userId');

        if (!transactionRef && !userId) {
            return NextResponse.json(
                { message: 'Transaction reference or User ID required' },
                { status: 400 }
            );
        }

        let query: any = {};
        if (transactionRef) {
            query.transactionRef = transactionRef;
        }
        if (userId) {
            query.userId = userId;
        }

        const transactions = await PaymentTransaction.find(query)
            .sort({ createdAt: -1 })
            .limit(50);

        return NextResponse.json({
            success: true,
            transactions
        });

    } catch (error: any) {
        console.error('Transaction retrieval error:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to retrieve transactions' },
            { status: 500 }
        );
    }
}
