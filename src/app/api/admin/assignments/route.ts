import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Assignment from '@/models/Assignment';
import Submission from '@/models/Submission';

// GET - Get all assignments (optionally filtered by course)
export async function GET(req: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const courseSlug = searchParams.get('courseSlug');

        // Filter out soft-deleted assignments
        const query: any = { isDeleted: { $ne: true } };
        if (courseSlug) {
            query.courseSlug = courseSlug;
        }
        const assignments = await Assignment.find(query).sort({ createdAt: -1 });

        // Get submission counts for each assignment (excluding soft-deleted)
        const assignmentsWithStats = await Promise.all(
            assignments.map(async (assignment) => {
                const submissions = await Submission.find({ assignmentId: assignment._id, isDeleted: { $ne: true } });
                const gradedCount = submissions.filter(s => s.status === 'graded').length;

                return {
                    ...assignment.toObject(),
                    totalSubmissions: submissions.length,
                    gradedSubmissions: gradedCount,
                    pendingSubmissions: submissions.length - gradedCount
                };
            })
        );

        return NextResponse.json({ assignments: assignmentsWithStats });

    } catch (error: any) {
        console.error('Error fetching assignments:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to fetch assignments' },
            { status: 500 }
        );
    }
}

// POST - Create a new assignment
export async function POST(req: Request) {
    try {
        await dbConnect();

        const {
            courseSlug,
            lessonId,
            title,
            description,
            dueDate,
            maxGrade,
            attachments,
            allowLateSubmission
        } = await req.json();

        if (!courseSlug || !lessonId || !title || !description) {
            return NextResponse.json(
                { message: 'Required fields are missing' },
                { status: 400 }
            );
        }

        const assignment = new Assignment({
            courseSlug,
            lessonId,
            title,
            description,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            maxGrade: maxGrade || 100,
            attachments,
            allowLateSubmission: allowLateSubmission !== false
        });

        await assignment.save();

        return NextResponse.json(
            { message: 'Assignment created successfully', assignment },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Error creating assignment:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to create assignment' },
            { status: 500 }
        );
    }
}

// PUT - Update an assignment
export async function PUT(req: Request) {
    try {
        await dbConnect();

        const { id, ...updateData } = await req.json();

        if (!id) {
            return NextResponse.json(
                { message: 'Assignment ID is required' },
                { status: 400 }
            );
        }

        if (updateData.dueDate) {
            updateData.dueDate = new Date(updateData.dueDate);
        }

        const assignment = await Assignment.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!assignment) {
            return NextResponse.json(
                { message: 'Assignment not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Assignment updated',
            assignment
        });

    } catch (error: any) {
        console.error('Error updating assignment:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to update assignment' },
            { status: 500 }
        );
    }
}

// DELETE - Delete an assignment (soft delete)
export async function DELETE(req: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { message: 'Assignment ID is required' },
                { status: 400 }
            );
        }

        // Soft delete - set isDeleted flag instead of removing
        const deleted = await Assignment.findByIdAndUpdate(
            id,
            { isDeleted: true, deletedAt: new Date() },
            { new: true }
        );

        if (!deleted) {
            return NextResponse.json(
                { message: 'Assignment not found' },
                { status: 404 }
            );
        }

        // Soft delete related submissions as well
        await Submission.updateMany(
            { assignmentId: id },
            { isDeleted: true, deletedAt: new Date() }
        );

        return NextResponse.json({ message: 'Assignment deleted' });

    } catch (error: any) {
        console.error('Error deleting assignment:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to delete assignment' },
            { status: 500 }
        );
    }
}
