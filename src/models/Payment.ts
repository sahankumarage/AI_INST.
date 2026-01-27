import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseSlug: { type: String, required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['manual', 'online'], required: true },

    // For manual payments (bank transfer)
    receiptUrl: { type: String }, // URL from Cloudinary
    transactionId: { type: String },

    // For online payments (Dodo)
    paymentId: { type: String },

    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'rejected'],
        default: 'pending'
    },

    submittedAt: { type: Date, default: Date.now },
    processedAt: { type: Date },
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rejectionReason: { type: String }
});

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
