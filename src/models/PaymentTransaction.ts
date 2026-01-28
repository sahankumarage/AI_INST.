import mongoose, { Schema, Document } from 'mongoose';

/**
 * PaymentTransaction Model
 * Stores all payment attempts with full metadata for verification and auditing
 */

export interface IPaymentTransaction extends Document {
    // Unique transaction reference
    transactionRef: string;

    // User information
    userId: string;
    userEmail?: string;
    userName?: string;

    // Course information
    courseId: string;
    courseSlug: string;
    courseName: string;

    // Pricing breakdown
    originalPrice: number;
    discountCode?: string;
    discountType?: 'percentage' | 'fixed';
    discountAmount?: number;
    discountValue?: number; // Actual amount discounted
    finalPrice: number;
    currency: string;

    // Dodo payment details
    dodoPaymentId?: string;
    dodoProductId?: string;
    paymentLink?: string;

    // Payment status
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
    paymentMethod?: 'card' | 'bank_transfer' | 'other';

    // Bank transfer specific
    bankReceiptUrl?: string;

    // Timestamps
    initiatedAt: Date;
    completedAt?: Date;

    // Webhook data
    webhookReceivedAt?: Date;
    webhookPayload?: any;

    // Error tracking
    errorMessage?: string;
    retryCount: number;

    // Metadata
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
}

const PaymentTransactionSchema = new Schema<IPaymentTransaction>({
    transactionRef: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    // User info
    userId: { type: String, required: true, index: true },
    userEmail: { type: String },
    userName: { type: String },

    // Course info
    courseId: { type: String, required: true },
    courseSlug: { type: String, required: true, index: true },
    courseName: { type: String, required: true },

    // Pricing
    originalPrice: { type: Number, required: true },
    discountCode: { type: String },
    discountType: { type: String, enum: ['percentage', 'fixed'] },
    discountAmount: { type: Number }, // e.g., 20 for 20%
    discountValue: { type: Number },  // e.g., 2000 for LKR 2000 off
    finalPrice: { type: Number, required: true },
    currency: { type: String, default: 'LKR' },

    // Dodo
    dodoPaymentId: { type: String, index: true },
    dodoProductId: { type: String },
    paymentLink: { type: String },

    // Status
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
        default: 'pending',
        index: true
    },
    paymentMethod: { type: String, enum: ['card', 'bank_transfer', 'other'] },

    // Bank transfer
    bankReceiptUrl: { type: String },

    // Timestamps
    initiatedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },

    // Webhook
    webhookReceivedAt: { type: Date },
    webhookPayload: { type: Schema.Types.Mixed },

    // Errors
    errorMessage: { type: String },
    retryCount: { type: Number, default: 0 },

    // Metadata
    ipAddress: { type: String },
    userAgent: { type: String },
    metadata: { type: Schema.Types.Mixed }
}, {
    timestamps: true
});

// Compound indexes for common queries
PaymentTransactionSchema.index({ userId: 1, courseSlug: 1 });
PaymentTransactionSchema.index({ status: 1, createdAt: -1 });
PaymentTransactionSchema.index({ dodoPaymentId: 1 });

// Prevent model overwrite in development
if (process.env.NODE_ENV !== 'production') {
    delete mongoose.models.PaymentTransaction;
}

export default mongoose.models.PaymentTransaction ||
    mongoose.model<IPaymentTransaction>('PaymentTransaction', PaymentTransactionSchema);
