import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// POST - Seed admin user
export async function POST(req: Request) {
    try {
        await dbConnect();

        const { secretKey } = await req.json();

        // Simple security check - require a secret key
        if (secretKey !== 'seed-admin-2024') {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const ADMIN_USER = {
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@aiinst.io',
            password: 'Admin@123',
            role: 'admin' as const
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: ADMIN_USER.email });

        if (existingAdmin) {
            return NextResponse.json({
                message: 'Admin user already exists',
                admin: {
                    email: existingAdmin.email,
                    role: existingAdmin.role,
                    name: `${existingAdmin.firstName} ${existingAdmin.lastName}`
                }
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(ADMIN_USER.password, salt);

        // Create admin user
        const adminUser = new User({
            ...ADMIN_USER,
            password: hashedPassword
        });

        await adminUser.save();

        return NextResponse.json({
            message: 'Admin user created successfully',
            admin: {
                email: ADMIN_USER.email,
                password: ADMIN_USER.password, // Only shown once on creation
                role: ADMIN_USER.role,
                name: `${ADMIN_USER.firstName} ${ADMIN_USER.lastName}`
            }
        }, { status: 201 });

    } catch (error: any) {
        console.error('Seed admin error:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to seed admin' },
            { status: 500 }
        );
    }
}

// GET - List all users (admin only - for debugging)
export async function GET(req: Request) {
    try {
        await dbConnect();

        // Filter out soft-deleted users
        const users = await User.find({ isDeleted: { $ne: true } }).select('email role firstName lastName createdAt');

        return NextResponse.json({
            users: users.map(u => ({
                id: u._id,
                email: u.email,
                role: u.role,
                name: `${u.firstName} ${u.lastName}`,
                createdAt: u.createdAt
            })),
            totalUsers: users.length,
            admins: users.filter(u => u.role === 'admin').length,
            students: users.filter(u => u.role === 'student').length
        });

    } catch (error: any) {
        console.error('List users error:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to list users' },
            { status: 500 }
        );
    }
}
