import mongoose, { Schema, Document } from 'mongoose';

/**
 * Enrollment Model
 * Tracks student enrollments in courses
 */

export interface IEnrollment extends Document {
    userId: string;
    courseId?: string;
    courseSlug: string;
    courseName: string;

    // Status
    status: 'pending' | 'active' | 'completed' | 'cancelled' | 'expired';
    paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';

    // Payment details
    paymentMethod?: 'card' | 'bank_transfer';
    paymentRef?: string;
    amountPaid?: number;
    currency?: string;

    // Progress tracking
    progress: number;
    completedLessons?: string[];
    lastAccessedAt?: Date;

    // Timestamps
    enrolledAt: Date;
    paidAt?: Date;
    completedAt?: Date;
    expiresAt?: Date;

    // Bank transfer specific
    bankReceiptUrl?: string;
    verifiedBy?: string;
    verifiedAt?: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>({
    userId: { type: String, required: true, index: true },
    courseId: { type: String },
    courseSlug: { type: String, required: true, index: true },
    courseName: { type: String, required: true },

    // Status
    status: {
        type: String,
        enum: ['pending', 'active', 'completed', 'cancelled', 'expired'],
        default: 'pending',
        index: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded', 'failed'],
        default: 'pending'
    },

    // Payment
    paymentMethod: { type: String, enum: ['card', 'bank_transfer'] },
    paymentRef: { type: String, index: true },
    amountPaid: { type: Number },
    currency: { type: String, default: 'LKR' },

    // Progress
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completedLessons: [{ type: String }],
    lastAccessedAt: { type: Date },

    // Timestamps
    enrolledAt: { type: Date, default: Date.now },
    paidAt: { type: Date },
    completedAt: { type: Date },
    expiresAt: { type: Date },

    // Bank transfer
    bankReceiptUrl: { type: String },
    verifiedBy: { type: String },
    verifiedAt: { type: Date }
}, {
    timestamps: true
});

// Compound unique index - one enrollment per user per course
EnrollmentSchema.index({ userId: 1, courseSlug: 1 }, { unique: true });

// Prevent model overwrite in development
if (process.env.NODE_ENV !== 'production') {
    delete mongoose.models.Enrollment;
}

export default mongoose.models.Enrollment ||
    mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
