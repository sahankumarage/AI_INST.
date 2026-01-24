import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// --- Configuration ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-institute';

const ADMIN_USER = {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@aiinst.io',
    password: 'Admin@123', // Change this in production!
    role: 'admin'
};

// --- User Schema (inline for standalone script) ---
const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    avatar: { type: String },
    phone: { type: String },
    enrolledCourses: [{
        courseSlug: String,
        courseName: String,
        enrolledAt: { type: Date, default: Date.now },
        progress: { type: Number, default: 0 },
        completedLessons: [String],
        paid: { type: Boolean, default: false },
        paymentId: String,
        amount: Number
    }]
}, { timestamps: true });

async function seedAdmin() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: ADMIN_USER.email });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists:', existingAdmin.email);
            console.log('   Role:', existingAdmin.role);
        } else {
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(ADMIN_USER.password, salt);

            // Create admin user
            const adminUser = new User({
                ...ADMIN_USER,
                password: hashedPassword
            });

            await adminUser.save();
            console.log('✅ Admin user created successfully!');
            console.log('   Email:', ADMIN_USER.email);
            console.log('   Password:', ADMIN_USER.password);
            console.log('   Role:', ADMIN_USER.role);
        }

        // List all users
        const allUsers = await User.find({}).select('email role firstName lastName');
        console.log('\n📋 All Users in Database:');
        console.log('------------------------');
        allUsers.forEach((user: any, index: number) => {
            console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - ${user.role}`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

seedAdmin();
