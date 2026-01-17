
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
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
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student',
    },
    enrolledCourses: [{
        slug: String,
        enrolledAt: { type: Date, default: Date.now },
        progress: { type: Number, default: 0 },
        paid: { type: Boolean, default: false } // Will be handled by payment gateway later
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
