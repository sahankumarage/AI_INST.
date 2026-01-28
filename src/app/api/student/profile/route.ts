import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// GET - Get user profile
export async function GET(req: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { message: 'User ID is required' },
                { status: 400 }
            );
        }

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ user });

    } catch (error: any) {
        console.error('Error fetching profile:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to fetch profile' },
            { status: 500 }
        );
    }
}

// PUT - Update user profile
export async function PUT(req: Request) {
    try {
        await dbConnect();

        const { userId, firstName, lastName, phone, avatar } = await req.json();

        if (!userId) {
            return NextResponse.json(
                { message: 'User ID is required' },
                { status: 400 }
            );
        }

        const updateData: any = {};
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (phone !== undefined) updateData.phone = phone;
        if (avatar !== undefined) updateData.avatar = avatar;

        console.log('Updating profile for:', userId, 'Data:', updateData);

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        ).select('-password');

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Profile updated successfully',
            user
        });

    } catch (error: any) {
        console.error('Error updating profile:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to update profile' },
            { status: 500 }
        );
    }
}
