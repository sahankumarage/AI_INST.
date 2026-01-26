import mongoose, { Schema, Document } from 'mongoose';

export interface IEnrolledCourse {
    courseSlug: string;
    courseName: string;
    enrolledAt: Date;
    progress: number;
    completedLessons: string[];
    paid: boolean;
    paymentId?: string;
    amount?: number;
    isEnrolled: boolean; // For soft unenroll
}

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'student' | 'admin';
    avatar?: string;
    phone?: string;
    enrolledCourses: IEnrolledCourse[];
    createdAt: Date;
    updatedAt: Date;
}

const EnrolledCourseSchema = new Schema({
    courseSlug: { type: String, required: true },
    courseName: { type: String, required: true },
    enrolledAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 },
    completedLessons: [{ type: String }],
    paid: { type: Boolean, default: false },
    paymentId: { type: String },
    amount: { type: Number },
    isEnrolled: { type: Boolean, default: true } // For soft unenroll
});

const UserSchema = new Schema<IUser>({
    firstName: {
        type: String,
        required: [true, 'Please provide a first name'],
        maxlength: 60,
    },
    lastName: {
        type: String,
        required: [true, 'Please provide a last name'],
        maxlength: 60,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student',
    },
    avatar: { type: String },
    phone: { type: String },
    enrolledCourses: [EnrolledCourseSchema],
}, {
    timestamps: true,
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
