import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Course from '@/models/Course';

// GET - Fetch promo codes for a specific course
export async function GET(req: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get('courseId');
        const slug = searchParams.get('slug');

        let course;
        if (courseId) {
            course = await Course.findById(courseId);
        } else if (slug) {
            course = await Course.findOne({ slug });
        } else {
            return NextResponse.json(
                { message: 'Course ID or slug required' },
                { status: 400 }
            );
        }

        if (!course) {
            return NextResponse.json(
                { message: 'Course not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            courseId: course._id,
            courseTitle: course.title,
            promoCodes: course.promoCodes || []
        });

    } catch (error: any) {
        console.error('Error fetching promo codes:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to fetch promo codes' },
            { status: 500 }
        );
    }
}

// POST - Add a new promo code to a course
export async function POST(req: Request) {
    try {
        await dbConnect();

        const { courseId, code, discountType, discountAmount, expiresAt, maxUses } = await req.json();

        if (!courseId || !code || !discountAmount) {
            return NextResponse.json(
                { message: 'Course ID, code, and discount amount are required' },
                { status: 400 }
            );
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return NextResponse.json(
                { message: 'Course not found' },
                { status: 404 }
            );
        }

        // Check if code already exists
        const existingCode = course.promoCodes?.find(
            (p: any) => p.code.toUpperCase() === code.toUpperCase()
        );

        if (existingCode) {
            return NextResponse.json(
                { message: 'Promo code already exists for this course' },
                { status: 400 }
            );
        }

        // Add the new promo code
        const newPromo = {
            code: code.toUpperCase(),
            discountType: discountType || 'percentage',
            discountAmount: Number(discountAmount),
            expiresAt: expiresAt ? new Date(expiresAt) : undefined,
            maxUses: maxUses ? Number(maxUses) : undefined,
            usedCount: 0
        };

        // Use $push to add to array
        const updated = await Course.findByIdAndUpdate(
            courseId,
            { $push: { promoCodes: newPromo } },
            { new: true }
        );

        console.log('Added promo code:', newPromo);
        console.log('Updated course promoCodes:', updated?.promoCodes);

        return NextResponse.json({
            message: 'Promo code added successfully',
            promoCodes: updated?.promoCodes || []
        });

    } catch (error: any) {
        console.error('Error adding promo code:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to add promo code' },
            { status: 500 }
        );
    }
}

// DELETE - Remove a promo code from a course
export async function DELETE(req: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get('courseId');
        const code = searchParams.get('code');

        if (!courseId || !code) {
            return NextResponse.json(
                { message: 'Course ID and code are required' },
                { status: 400 }
            );
        }

        const updated = await Course.findByIdAndUpdate(
            courseId,
            { $pull: { promoCodes: { code: code.toUpperCase() } } },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json(
                { message: 'Course not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Promo code removed successfully',
            promoCodes: updated.promoCodes || []
        });

    } catch (error: any) {
        console.error('Error removing promo code:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to remove promo code' },
            { status: 500 }
        );
    }
}
