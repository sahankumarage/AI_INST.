import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Course from '@/models/Course';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { slug, code } = await req.json();

        if (!slug || !code) {
            return NextResponse.json(
                { message: 'Missing parameters', isValid: false },
                { status: 400 }
            );
        }

        const course = await Course.findOne({ slug });

        if (!course) {
            return NextResponse.json(
                { message: 'Course not found', isValid: false },
                { status: 404 }
            );
        }

        console.log(`Verifying Promo: Code '${code}' for Course '${slug}'`);

        // Debug: Log available codes (safely)
        console.log('Available Promo Codes in DB:', course.promoCodes?.map((p: any) => p.code));

        const promo = course.promoCodes?.find(
            (p: any) => p.code?.toUpperCase() === code.toUpperCase()
        );

        if (!promo) {
            return NextResponse.json(
                { message: 'Invalid promo code', isValid: false },
                { status: 200 } // Not an error, just invalid code
            );
        }

        // Check if expired
        if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
            return NextResponse.json(
                { message: 'Promo code has expired', isValid: false },
                { status: 200 }
            );
        }

        // Check limits
        if (promo.maxUses && promo.usedCount >= promo.maxUses) {
            return NextResponse.json(
                { message: 'Promo code usage limit reached', isValid: false },
                { status: 200 }
            );
        }

        return NextResponse.json({
            isValid: true,
            discountType: promo.discountType,
            discountAmount: promo.discountAmount,
            message: 'Promo code applied!'
        });

    } catch (error: any) {
        console.error('Verify promo error:', error);
        return NextResponse.json(
            { message: 'Failed to verify promo code', isValid: false },
            { status: 500 }
        );
    }
}
