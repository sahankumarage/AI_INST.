import mongoose, { Schema, Document } from 'mongoose';

export interface ILesson {
    id: string;
    title: string;
    description?: string;
    // Video/Recording
    videoUrl?: string;
    recordingUrl?: string;
    duration?: string;
    // Live Class Support
    isLiveClass?: boolean;
    liveClassUrl?: string; // Zoom link for instructor/fallback
    zoomMeetingId?: string; // Zoom Meeting ID (string to avoid overflow)
    zoomMeetingNumber?: string; // Numeric ID for joining
    zoomPassword?: string;
    meetingStatus?: 'scheduled' | 'active' | 'ended';
    scheduledAt?: Date;
    scheduledEndAt?: Date;
    scheduledDuration?: number; // Duration in minutes
    // Resources
    resources?: { name: string; url: string }[];
    order: number;
}

export interface IModule {
    id: string;
    title: string;
    description?: string;
    lessons: ILesson[];
    order: number;
}

export interface ICourse extends Document {
    title: string;
    slug: string;
    subtitle?: string;
    description: string;
    longDescription?: string;
    thumbnail?: string;
    price: number;
    currency: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: string;
    category: string;
    modules: IModule[];
    instructor: {
        name: string;
        bio?: string;
        avatar?: string;
    };
    features: string[];
    outcomes: string[];
    isPublished: boolean;
    enrolledCount: number;
    rating: number;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const LessonSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    videoUrl: { type: String },
    recordingUrl: { type: String },
    duration: { type: String },
    isLiveClass: { type: Boolean, default: false },
    liveClassUrl: { type: String },
    zoomMeetingId: { type: String },
    zoomMeetingNumber: { type: String },
    zoomPassword: { type: String },
    meetingStatus: { type: String, enum: ['scheduled', 'active', 'ended'], default: 'scheduled' },
    scheduledAt: { type: Date },
    scheduledEndAt: { type: Date },
    scheduledDuration: { type: Number },
    resources: [{ name: String, url: String }],
    order: { type: Number, required: true }
});

const ModuleSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    lessons: [LessonSchema],
    order: { type: Number, required: true }
});

const CourseSchema = new Schema<ICourse>({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    subtitle: { type: String },
    description: { type: String, required: true },
    longDescription: { type: String },
    thumbnail: { type: String },
    price: { type: Number, required: true, default: 0 },
    currency: { type: String, default: 'USD' },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    duration: { type: String },
    category: { type: String },
    modules: [ModuleSchema],
    instructor: {
        name: { type: String, required: true },
        bio: { type: String },
        avatar: { type: String }
    },
    features: [{ type: String }],
    outcomes: [{ type: String }],
    isPublished: { type: Boolean, default: false },
    enrolledCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
}, {
    timestamps: true
});

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
