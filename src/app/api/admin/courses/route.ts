import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Course from '@/models/Course';

// GET all courses (including drafts for admin)
export async function GET(req: Request) {
    try {
        await dbConnect();

        // Filter out soft-deleted courses
        const courses = await Course.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 });

        // Calculate stats
        const totalCourses = courses.length;
        const publishedCourses = courses.filter(c => c.isPublished).length;
        const totalEnrolled = courses.reduce((sum, c) => sum + (c.enrolledCount || 0), 0);

        return NextResponse.json({
            courses,
            stats: {
                totalCourses,
                publishedCourses,
                totalEnrolled
            }
        });

    } catch (error: any) {
        console.error('Error fetching courses:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to fetch courses' },
            { status: 500 }
        );
    }
}

// POST create a new course
export async function POST(req: Request) {
    try {
        await dbConnect();

        const courseData = await req.json();

        // Generate slug from title
        const slug = courseData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        // Check if slug already exists
        const existing = await Course.findOne({ slug });
        if (existing) {
            return NextResponse.json(
                { message: 'A course with this title already exists' },
                { status: 400 }
            );
        }

        const newCourse = new Course({
            ...courseData,
            slug,
            instructor: courseData.instructor || { name: 'AI Institute Team' },
            modules: courseData.modules || [],
            features: courseData.features || [],
            outcomes: courseData.outcomes || [],
            promoCodes: courseData.promoCodes || [], // Explicitly include promoCodes
            enrolledCount: 0,
            rating: 0
        });

        console.log('Creating Course with PromoCodes:', courseData.promoCodes);

        await newCourse.save();

        return NextResponse.json(
            { message: 'Course created successfully', course: newCourse },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Error creating course:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to create course' },
            { status: 500 }
        );
    }
}

// PUT update a course
export async function PUT(req: Request) {
    try {
        await dbConnect();

        const { id, ...updateData } = await req.json();

        console.log('Update Data received:', updateData);
        console.log('Update PromoCodes:', updateData.promoCodes); // Debug log

        if (!id) {
            return NextResponse.json(
                { message: 'Course ID is required' },
                { status: 400 }
            );
        }

        // If title changed, regenerate slug
        if (updateData.title) {
            updateData.slug = updateData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        // Use $set explicitly for promoCodes to ensure array updates work correctly
        const updatePayload: any = {
            ...updateData,
            updatedAt: new Date()
        };

        // If promoCodes is in the update, ensure it's set explicitly
        if (updateData.promoCodes !== undefined) {
            console.log('Setting promoCodes explicitly:', updateData.promoCodes);
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            { $set: updatePayload },
            { new: true, runValidators: false }
        );

        console.log('Updated Course Result:', updatedCourse); // Debug log

        if (!updatedCourse) {
            return NextResponse.json(
                { message: 'Course not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Course updated successfully',
            course: updatedCourse
        });

    } catch (error: any) {
        console.error('Error updating course:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to update course' },
            { status: 500 }
        );
    }
}

// DELETE a course
export async function DELETE(req: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { message: 'Course ID is required' },
                { status: 400 }
            );
        }

        // Soft delete - set isDeleted flag instead of removing
        const deleted = await Course.findByIdAndUpdate(
            id,
            { isDeleted: true, deletedAt: new Date() },
            { new: true }
        );

        if (!deleted) {
            return NextResponse.json(
                { message: 'Course not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Course deleted successfully' });

    } catch (error: any) {
        console.error('Error deleting course:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to delete course' },
            { status: 500 }
        );
    }
}
