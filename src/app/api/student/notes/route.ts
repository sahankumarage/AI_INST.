import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Note from '@/models/Note';

// GET - Get notes for a lesson
export async function GET(req: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const courseSlug = searchParams.get('courseSlug');
        const lessonId = searchParams.get('lessonId');

        if (!userId || !courseSlug) {
            return NextResponse.json(
                { message: 'User ID and course slug are required' },
                { status: 400 }
            );
        }

        const query: any = { userId, courseSlug };
        if (lessonId) {
            query.lessonId = lessonId;
        }

        const notes = await Note.find(query).sort({ createdAt: -1 });

        return NextResponse.json({ notes });

    } catch (error: any) {
        console.error('Error fetching notes:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to fetch notes' },
            { status: 500 }
        );
    }
}

// POST - Create a new note
export async function POST(req: Request) {
    try {
        await dbConnect();

        const { userId, courseSlug, lessonId, content, timestamp } = await req.json();

        if (!userId || !courseSlug || !lessonId || !content) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            );
        }

        const note = new Note({
            userId,
            courseSlug,
            lessonId,
            content,
            timestamp
        });

        await note.save();

        return NextResponse.json(
            { message: 'Note created', note },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Error creating note:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to create note' },
            { status: 500 }
        );
    }
}

// PUT - Update a note
export async function PUT(req: Request) {
    try {
        await dbConnect();

        const { noteId, content } = await req.json();

        if (!noteId || !content) {
            return NextResponse.json(
                { message: 'Note ID and content are required' },
                { status: 400 }
            );
        }

        const note = await Note.findByIdAndUpdate(
            noteId,
            { content },
            { new: true }
        );

        if (!note) {
            return NextResponse.json(
                { message: 'Note not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Note updated', note });

    } catch (error: any) {
        console.error('Error updating note:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to update note' },
            { status: 500 }
        );
    }
}

// DELETE - Delete a note (soft delete)
export async function DELETE(req: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const noteId = searchParams.get('noteId');

        if (!noteId) {
            return NextResponse.json(
                { message: 'Note ID is required' },
                { status: 400 }
            );
        }

        // Soft delete - set isDeleted flag instead of removing
        const deleted = await Note.findByIdAndUpdate(
            noteId,
            { isDeleted: true, deletedAt: new Date() },
            { new: true }
        );

        if (!deleted) {
            return NextResponse.json(
                { message: 'Note not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Note deleted' });

    } catch (error: any) {
        console.error('Error deleting note:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to delete note' },
            { status: 500 }
        );
    }
}
