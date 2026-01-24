import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Submission from '@/models/Submission';
import Assignment from '@/models/Assignment';

// GET - Get submissions for a user
export async function GET(req: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const courseSlug = searchParams.get('courseSlug');
        const assignmentId = searchParams.get('assignmentId');

        if (!userId) {
            return NextResponse.json(
                { message: 'User ID is required' },
                { status: 400 }
            );
        }

        const query: any = { userId };
        if (courseSlug) query.courseSlug = courseSlug;
        if (assignmentId) query.assignmentId = assignmentId;

        const submissions = await Submission.find(query)
            .populate('assignmentId')
            .sort({ submittedAt: -1 });

        return NextResponse.json({ submissions });

    } catch (error: any) {
        console.error('Error fetching submissions:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to fetch submissions' },
            { status: 500 }
        );
    }
}

// POST - Submit an assignment
export async function POST(req: Request) {
    try {
        await dbConnect();

        const {
            userId,
            assignmentId,
            courseSlug,
            lessonId,
            fileUrl,
            fileType,
            fileName,
            textContent
        } = await req.json();

        if (!userId || !assignmentId || !courseSlug || !lessonId) {
            return NextResponse.json(
                { message: 'Required fields are missing' },
                { status: 400 }
            );
        }

        // Check if already submitted
        const existingSubmission = await Submission.findOne({ userId, assignmentId });

        if (existingSubmission) {
            // Update existing submission
            existingSubmission.fileUrl = fileUrl;
            existingSubmission.fileType = fileType;
            existingSubmission.fileName = fileName;
            existingSubmission.textContent = textContent;
            existingSubmission.submittedAt = new Date();
            existingSubmission.status = 'submitted';

            await existingSubmission.save();

            return NextResponse.json({
                message: 'Submission updated',
                submission: existingSubmission
            });
        }

        // Check if assignment exists and if it's late
        const assignment = await Assignment.findById(assignmentId);
        let status: 'submitted' | 'late' = 'submitted';

        if (assignment?.dueDate && new Date() > assignment.dueDate) {
            if (!assignment.allowLateSubmission) {
                return NextResponse.json(
                    { message: 'This assignment is past due and does not accept late submissions' },
                    { status: 400 }
                );
            }
            status = 'late';
        }

        const submission = new Submission({
            userId,
            assignmentId,
            courseSlug,
            lessonId,
            fileUrl,
            fileType,
            fileName,
            textContent,
            status,
            submittedAt: new Date()
        });

        await submission.save();

        return NextResponse.json(
            { message: 'Assignment submitted successfully', submission },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Error submitting assignment:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to submit assignment' },
            { status: 500 }
        );
    }
}

// PUT - Grade a submission (admin only)
export async function PUT(req: Request) {
    try {
        await dbConnect();

        const { submissionId, grade, feedback, gradedBy } = await req.json();

        if (!submissionId || grade === undefined) {
            return NextResponse.json(
                { message: 'Submission ID and grade are required' },
                { status: 400 }
            );
        }

        const submission = await Submission.findByIdAndUpdate(
            submissionId,
            {
                grade,
                feedback,
                gradedBy,
                gradedAt: new Date(),
                status: 'graded'
            },
            { new: true }
        );

        if (!submission) {
            return NextResponse.json(
                { message: 'Submission not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Submission graded',
            submission
        });

    } catch (error: any) {
        console.error('Error grading submission:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to grade submission' },
            { status: 500 }
        );
    }
}
