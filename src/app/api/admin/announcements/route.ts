import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Announcement from '@/models/Announcement';

// GET - Get announcements for a course
export async function GET(req: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const courseSlug = searchParams.get('courseSlug');

        const query = courseSlug
            ? { courseSlug, isDeleted: { $ne: true } }
            : { isDeleted: { $ne: true } };
        const announcements = await Announcement.find(query)
            .sort({ isPinned: -1, createdAt: -1 });

        return NextResponse.json({ announcements });

    } catch (error: any) {
        console.error('Error fetching announcements:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to fetch announcements' },
            { status: 500 }
        );
    }
}

// POST - Create a new announcement
export async function POST(req: Request) {
    try {
        await dbConnect();

        const { courseSlug, title, content, authorId, authorName, isPinned } = await req.json();

        if (!courseSlug || !title || !content || !authorId || !authorName) {
            return NextResponse.json(
                { message: 'Required fields are missing' },
                { status: 400 }
            );
        }

        const announcement = new Announcement({
            courseSlug,
            title,
            content,
            authorId,
            authorName,
            isPinned: isPinned || false
        });

        await announcement.save();

        return NextResponse.json(
            { message: 'Announcement created', announcement },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Error creating announcement:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to create announcement' },
            { status: 500 }
        );
    }
}

// PUT - Update an announcement
export async function PUT(req: Request) {
    try {
        await dbConnect();

        const { id, ...updateData } = await req.json();

        if (!id) {
            return NextResponse.json(
                { message: 'Announcement ID is required' },
                { status: 400 }
            );
        }

        const announcement = await Announcement.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!announcement) {
            return NextResponse.json(
                { message: 'Announcement not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Announcement updated',
            announcement
        });

    } catch (error: any) {
        console.error('Error updating announcement:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to update announcement' },
            { status: 500 }
        );
    }
}

// DELETE - Delete an announcement
export async function DELETE(req: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { message: 'Announcement ID is required' },
                { status: 400 }
            );
        }

        // Soft delete
        const deleted = await Announcement.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );

        if (!deleted) {
            return NextResponse.json(
                { message: 'Announcement not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Announcement deleted' });

    } catch (error: any) {
        console.error('Error deleting announcement:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to delete announcement' },
            { status: 500 }
        );
    }
}
