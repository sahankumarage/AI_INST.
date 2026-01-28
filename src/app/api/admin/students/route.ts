import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// GET all students
export async function GET(req: Request) {
    try {
        await dbConnect();

        const students = await User.find({ role: 'student' })
            .select('-password')
            .sort({ createdAt: -1 });

        // Calculate stats
        const totalStudents = students.length;
        const paidStudents = students.filter(s =>
            s.enrolledCourses.some((c: any) => c.paid)
        ).length;
        const totalRevenue = students.reduce((sum, s) => {
            return sum + s.enrolledCourses.reduce((courseSum: number, c: any) => {
                return courseSum + (c.paid && c.amount ? c.amount : 0);
            }, 0);
        }, 0);
        const totalEnrollments = students.reduce((sum, s) => sum + s.enrolledCourses.length, 0);

        return NextResponse.json({
            students: students.map(s => ({
                id: s._id,
                name: `${s.firstName} ${s.lastName}`,
                email: s.email,
                phone: s.phone,
                avatar: s.avatar,
                enrolledCourses: s.enrolledCourses,
                createdAt: s.createdAt
            })),
            stats: {
                totalStudents,
                paidStudents,
                totalRevenue,
                totalEnrollments
            }
        });

    } catch (error: any) {
        console.error('Error fetching students:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to fetch students' },
            { status: 500 }
        );
    }
}

// DELETE a student
export async function DELETE(req: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { message: 'Student ID is required' },
                { status: 400 }
            );
        }

        const deleted = await User.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json(
                { message: 'Student not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Student deleted successfully' });

    } catch (error: any) {
        console.error('Error deleting student:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to delete student' },
            { status: 500 }
        );
    }
}

// PUT update a student
export async function PUT(req: Request) {
    try {
        await dbConnect();

        const { id, ...updateData } = await req.json();

        if (!id) {
            return NextResponse.json(
                { message: 'Student ID is required' },
                { status: 400 }
            );
        }

        const updated = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).select('-password');

        if (!updated) {
            return NextResponse.json(
                { message: 'Student not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Student updated successfully',
            student: updated
        });

    } catch (error: any) {
        console.error('Error updating student:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to update student' },
            { status: 500 }
        );
    }
}
