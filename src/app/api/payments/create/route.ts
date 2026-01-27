import { NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';

const client = new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY,
    environment: 'test_mode', // Defaults to 'live_mode'
});

export async function POST(req: Request) {
    try {
        const { userId, courseSlug, courseName, amount, successUrl, cancelUrl } = await req.json();

        if (!process.env.DODO_PAYMENTS_API_KEY) {
            return NextResponse.json(
                { message: 'Dodo Payments is not configured' },
                { status: 500 }
            );
        }

        // Create Dodo Payment session
        const session = await client.payments.create({
            billing: {
                city: 'New York',
                country: 'US',
                state: 'NY',
                street: '123 Main St',
                zipcode: '10001',
            },
            customer: {
                email: 'customer@example.com', // In a real app, this should come from user profile
                name: 'John Doe', // Should come from user profile
            },
            product_cart: [
                {
                    product_id: process.env.DODO_PRODUCT_ID || 'pdt_0NWZJ1b1yj2ve5zyDswrE', // Use env var or dynamic ID
                    quantity: 1,
                    amount: amount * 100, // Amount in lowest denomination (cents)
                },
            ],
            payment_link: true,
            return_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/portal/student?payment=success`,
            metadata: {
                userId,
                courseSlug,
                courseName
            }
        });

        return NextResponse.json({
            paymentUrl: session.payment_link,
            sessionId: session.payment_id
        });

    } catch (error: any) {
        console.error('Payment creation error:', error);
        return NextResponse.json(
            { message: error.message || 'Payment creation failed' },
            { status: 500 }
        );
    }
}
