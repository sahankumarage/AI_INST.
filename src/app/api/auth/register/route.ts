import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        await dbConnect();

        const { firstName, lastName, email, password, courseSlug, courseName } = await req.json();

        // Validate required fields
        if (!firstName || !lastName || !email || !password) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { message: 'An account with this email already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with optional course enrollment
        const enrolledCourses = courseSlug && courseName
            ? [{ courseSlug, courseName, paid: false }]
            : [];

        const newUser = new User({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: 'student',
            enrolledCourses
        });

        await newUser.save();

        const userResponse = {
            id: newUser._id,
            name: `${newUser.firstName} ${newUser.lastName}`,
            email: newUser.email,
            role: newUser.role,
            enrolledCourses: newUser.enrolledCourses
        };

        return NextResponse.json(
            { message: 'Account created successfully', user: userResponse },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: error.message || 'Something went wrong' },
            { status: 500 }
        );
    }
}
