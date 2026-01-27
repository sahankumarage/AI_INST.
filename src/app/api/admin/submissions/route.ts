import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Submission from '@/models/Submission';
import User from '@/models/User';

// GET - Get all submissions for an assignment (admin)
export async function GET(req: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const assignmentId = searchParams.get('assignmentId');
        const courseSlug = searchParams.get('courseSlug');

        if (!assignmentId && !courseSlug) {
            return NextResponse.json(
                { message: 'Assignment ID or course slug is required' },
                { status: 400 }
            );
        }

        const query: any = {};
        if (assignmentId) query.assignmentId = assignmentId;
        if (courseSlug) query.courseSlug = courseSlug;

        const submissions = await Submission.find(query)
            .populate('assignmentId')
            .sort({ submittedAt: -1 });

        // Get user details for each submission
        const submissionsWithUsers = await Promise.all(
            submissions.map(async (submission) => {
                let user = null;
                try {
                    user = await User.findById(submission.userId).select('firstName lastName email');
                } catch (e) {
                    console.log(`Error finding user for submission ${submission._id}:`, e);
                }

                return {
                    ...submission.toObject(),
                    user: user ? {
                        name: `${user.firstName} ${user.lastName}`,
                        email: user.email
                    } : {
                        name: 'Unknown Student',
                        email: 'N/A',
                        id: submission.userId // Return ID for debugging
                    }
                };
            })
        );

        return NextResponse.json({ submissions: submissionsWithUsers });

    } catch (error: any) {
        console.error('Error fetching submissions:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to fetch submissions' },
            { status: 500 }
        );
    }
}

// PUT - Grade a submission
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

        const updateData: any = {
            grade,
            feedback,
            gradedAt: new Date(),
            status: 'graded'
        };

        // Only add gradedBy if it's a valid ObjectId, ignore 'admin' string
        if (gradedBy && gradedBy !== 'admin' && gradedBy.match(/^[0-9a-fA-F]{24}$/)) {
            updateData.gradedBy = gradedBy;
        }

        const submission = await Submission.findByIdAndUpdate(
            submissionId,
            updateData,
            { new: true }
        ).populate('assignmentId');

        if (!submission) {
            return NextResponse.json(
                { message: 'Submission not found' },
                { status: 404 }
            );
        }

        // Get user info
        const user = await User.findById(submission.userId).select('firstName lastName email');

        return NextResponse.json({
            message: 'Submission graded successfully',
            submission: {
                ...submission.toObject(),
                user: user ? {
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email
                } : null
            }
        });

    } catch (error: any) {
        console.error('Error grading submission:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to grade submission' },
            { status: 500 }
        );
    }
}
