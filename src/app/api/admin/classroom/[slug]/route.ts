import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Course from '@/models/Course';

// GET - Fetch single course by slug
export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await dbConnect();
        const resolvedParams = await params;
        const course = await Course.findOne({ slug: resolvedParams.slug });

        if (!course) {
            return NextResponse.json(
                { message: 'Course not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ course });
    } catch (error: any) {
        console.error('Error fetching course:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to fetch course' },
            { status: 500 }
        );
    }
}

// PUT - Update course by slug
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const resolvedParams = await params;
    try {
        await dbConnect();

        const body = await req.json();

        // Remove fields that shouldn't be updated directly
        delete body._id;
        delete body.__v;
        delete body.createdAt;

        // Update the slug if title changed
        if (body.title && body.title !== body.slug) {
            body.slug = body.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        const course = await Course.findOneAndUpdate(
            { slug: resolvedParams.slug },
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!course) {
            return NextResponse.json(
                { message: 'Course not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Course updated successfully',
            course
        });
    } catch (error: any) {
        console.error('Error updating course:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to update course' },
            { status: 500 }
        );
    }
}

// DELETE - Delete course by slug
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const resolvedParams = await params;
    try {
        await dbConnect();

        const course = await Course.findOneAndDelete({ slug: resolvedParams.slug });

        if (!course) {
            return NextResponse.json(
                { message: 'Course not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Course deleted successfully'
        });
    } catch (error: any) {
        console.error('Error deleting course:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to delete course' },
            { status: 500 }
        );
    }
}
