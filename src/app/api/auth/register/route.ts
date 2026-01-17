
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        await dbConnect();

        const { firstName, lastName, email, password, courseSlug } = await req.json();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 400 }
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: 'student',
            enrolledCourses: courseSlug ? [{ slug: courseSlug }] : []
        });

        await newUser.save();

        // In a real app, generate JWT here
        const userResponse = {
            name: `${newUser.firstName} ${newUser.lastName}`,
            email: newUser.email,
            role: newUser.role,
            id: newUser._id
        };

        return NextResponse.json({ message: 'User created', user: userResponse }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Something went wrong' },
            { status: 500 }
        );
    }
}
