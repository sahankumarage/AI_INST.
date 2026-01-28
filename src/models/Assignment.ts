import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission {
    lessonId: string;
    submittedAt: Date;
    fileUrl?: string;
    fileType?: string;
    fileName?: string;
    textContent?: string;
    grade?: number;
    maxGrade: number;
    feedback?: string;
    gradedAt?: Date;
    status: 'pending' | 'submitted' | 'graded' | 'late';
}

export interface IAssignment extends Document {
    courseSlug: string;
    lessonId: string;
    title: string;
    description: string;
    dueDate?: Date;
    maxGrade: number;
    attachments?: { name: string; url: string }[];
    allowLateSubmission: boolean;
    isDeleted?: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>({
    courseSlug: { type: String, required: true, index: true },
    lessonId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date },
    maxGrade: { type: Number, default: 100 },
    attachments: [{ name: String, url: String }],
    allowLateSubmission: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
}, {
    timestamps: true
});

// Compound index for efficient queries
AssignmentSchema.index({ courseSlug: 1, lessonId: 1 });

// Prevent Mongoose OverwriteModelError while allowing schema updates in dev
if (process.env.NODE_ENV !== 'production') {
    delete mongoose.models.Assignment;
}

export default mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema);


