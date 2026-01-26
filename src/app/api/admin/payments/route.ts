import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
    try {
        const dataPath = path.join(process.cwd(), 'src/data/pending_payments.json');

        let payments = [];
        if (fs.existsSync(dataPath)) {
            const fileContent = fs.readFileSync(dataPath, 'utf8');
            payments = JSON.parse(fileContent);
        }

        return NextResponse.json({ payments });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Failed to fetch payments' },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        const { paymentId, action } = await req.json();

        const dataPath = path.join(process.cwd(), 'src/data/pending_payments.json');

        if (!fs.existsSync(dataPath)) {
            return NextResponse.json({ message: 'No payments found' }, { status: 404 });
        }

        const fileContent = fs.readFileSync(dataPath, 'utf8');
        let payments = JSON.parse(fileContent);

        const paymentIndex = payments.findIndex((p: any) => p.id === paymentId);
        if (paymentIndex === -1) {
            return NextResponse.json({ message: 'Payment not found' }, { status: 404 });
        }

        const payment = payments[paymentIndex];

        if (action === 'approve') {
            payment.status = 'completed';

            // Activate course in DB
            try {
                await dbConnect();

                const user = await User.findById(payment.userId);

                if (user) {
                    const alreadyEnrolled = user.enrolledCourses.some((c: any) => c.courseSlug === payment.courseSlug);

                    if (!alreadyEnrolled) {
                        // Create new enrollment
                        user.enrolledCourses.push({
                            courseSlug: payment.courseSlug,
                            courseName: payment.courseName,
                            enrolledAt: new Date(),
                            progress: 0,
                            completedLessons: [],
                            paid: true
                        });
                        await user.save();
                    } else {
                        // Just in case they were somehow enrolled but unpaid
                        await User.findOneAndUpdate(
                            {
                                _id: payment.userId,
                                "enrolledCourses.courseSlug": payment.courseSlug
                            },
                            {
                                $set: { "enrolledCourses.$.paid": true }
                            }
                        );
                    }
                }
            } catch (e) {
                console.error("DB update failed during approval", e);
            }

        } else if (action === 'reject') {
            payment.status = 'failed';
        }

        payments[paymentIndex] = payment;
        fs.writeFileSync(dataPath, JSON.stringify(payments, null, 2));

        return NextResponse.json({ message: `Payment ${action}d` });

    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Failed to update payment' },
            { status: 500 }
        );
    }
}
