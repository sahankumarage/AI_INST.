import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnouncement extends Document {
    courseSlug: string;
    title: string;
    content: string;
    imageUrl?: string;
    authorId: string;
    authorName: string;
    isPinned: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>({
    courseSlug: { type: String, required: true, index: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    isPinned: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

export default mongoose.models.Announcement || mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
