import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Course from '@/models/Course';

// GET - Fetch single course by ID
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const resolvedParams = await params;
        const course = await Course.findById(resolvedParams.id);

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

// PUT - Update course
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    try {
        await dbConnect();

        const body = await req.json();

        // Remove fields that shouldn't be updated directly
        delete body._id;
        delete body.__v;
        delete body.createdAt;

        const course = await Course.findByIdAndUpdate(
            resolvedParams.id,
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

// DELETE - Delete course
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    try {
        await dbConnect();

        const course = await Course.findByIdAndDelete(resolvedParams.id);

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
