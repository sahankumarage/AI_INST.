import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

const DODO_API_KEY = process.env.DODO_PAYMENTS_API_KEY;
const DODO_PAYMENT_LINK = process.env.DODO_PAYMENT_LINK;

export async function POST(req: Request) {
    try {
        const { userId, courseSlug, courseName, amount, successUrl, cancelUrl } = await req.json();

        if (!DODO_API_KEY) {
            return NextResponse.json(
                { message: 'Dodo Payments is not configured' },
                { status: 500 }
            );
        }

        // Create Dodo Payment session
        // This is a simplified example - adjust based on Dodo's actual API
        const paymentData = {
            amount: amount * 100, // Convert to cents if needed
            currency: 'USD',
            metadata: {
                userId,
                courseSlug,
                courseName
            },
            success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/portal/student?payment=success`,
            cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseSlug}?payment=cancelled`
        };

        // If using Dodo payment link approach
        if (DODO_PAYMENT_LINK) {
            const paymentUrl = `${DODO_PAYMENT_LINK}?amount=${amount}&user_id=${userId}&course=${courseSlug}`;
            return NextResponse.json({ paymentUrl });
        }

        // Or create a checkout session via API
        const response = await fetch('https://api.dodopayments.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${DODO_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        });

        if (!response.ok) {
            throw new Error('Failed to create payment session');
        }

        const session = await response.json();

        return NextResponse.json({
            paymentUrl: session.url,
            sessionId: session.id
        });

    } catch (error: any) {
        console.error('Payment creation error:', error);
        return NextResponse.json(
            { message: error.message || 'Payment creation failed' },
            { status: 500 }
        );
    }
}
