import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
    userId: mongoose.Types.ObjectId;
    assignmentId: mongoose.Types.ObjectId;
    courseSlug: string;
    lessonId: string;
    fileUrl?: string;
    fileType?: string;
    fileName?: string;
    textContent?: string;
    grade?: number;
    feedback?: string;
    gradedBy?: mongoose.Types.ObjectId;
    gradedAt?: Date;
    status: 'pending' | 'submitted' | 'graded' | 'late';
    submittedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
    courseSlug: { type: String, required: true },
    lessonId: { type: String, required: true },
    fileUrl: { type: String },
    fileType: { type: String },
    fileName: { type: String },
    textContent: { type: String },
    grade: { type: Number },
    feedback: { type: String },
    gradedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    gradedAt: { type: Date },
    status: {
        type: String,
        enum: ['pending', 'submitted', 'graded', 'late'],
        default: 'submitted'
    },
    submittedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Compound indexes for efficient queries
SubmissionSchema.index({ userId: 1, courseSlug: 1 });
SubmissionSchema.index({ assignmentId: 1, userId: 1 }, { unique: true });

export default mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);
