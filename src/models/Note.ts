import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
    userId: mongoose.Types.ObjectId;
    courseSlug: string;
    lessonId: string;
    content: string;
    timestamp?: number; // Video timestamp in seconds
    isDeleted?: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const NoteSchema = new Schema<INote>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    courseSlug: { type: String, required: true },
    lessonId: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Number },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
}, {
    timestamps: true
});

// Compound index for efficient queries
NoteSchema.index({ userId: 1, courseSlug: 1, lessonId: 1 });

// Prevent Mongoose OverwriteModelError while allowing schema updates in dev
if (process.env.NODE_ENV !== 'production') {
    delete mongoose.models.Note;
}

export default mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);


