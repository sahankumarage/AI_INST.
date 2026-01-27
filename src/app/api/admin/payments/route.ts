import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Payment from '@/models/Payment';

export async function GET() {
    try {
        await dbConnect();

        const payments = await Payment.find({})
            .sort({ submittedAt: -1 })
            .populate('userId', 'firstName lastName email');

        const formattedPayments = payments.map(p => {
            // Safe access to populated fields
            const user = p.userId as any;
            const studentName = user ? `${user.firstName} ${user.lastName}` : 'Unknown Student';
            const studentEmail = user ? user.email : 'Unknown Email';

            return {
                id: p._id,
                userId: user?._id,
                studentName,
                studentEmail,
                courseSlug: p.courseSlug,
                courseName: p.courseSlug, // Using slug as name since we don't populate course yet
                amount: p.amount,
                status: p.status,
                paymentMethod: p.method === 'manual' ? 'Bank Transfer' : 'Online',
                date: p.submittedAt,
                receiptImage: p.receiptUrl
            };
        });

        return NextResponse.json({ payments: formattedPayments });
    } catch (error: any) {
        console.error("Error fetching payments:", error);
        return NextResponse.json(
            { message: error.message || 'Failed to fetch payments' },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        await dbConnect();

        const { paymentId, action } = await req.json();

        const payment = await Payment.findById(paymentId);

        if (!payment) {
            return NextResponse.json({ message: 'Payment not found' }, { status: 404 });
        }

        if (action === 'approve') {
            payment.status = 'completed';
            payment.processedAt = new Date();
            // payment.processedBy = ... // If we had auth user context

            await payment.save();

            // Activate course in DB for the user
            try {
                const user = await User.findById(payment.userId);

                if (user) {
                    const alreadyEnrolled = user.enrolledCourses.some((c: any) => c.courseSlug === payment.courseSlug);

                    if (!alreadyEnrolled) {
                        // Create new enrollment
                        user.enrolledCourses.push({
                            courseSlug: payment.courseSlug,
                            courseName: payment.courseSlug, // Use slug as name
                            enrolledAt: new Date(),
                            progress: 0,
                            completedLessons: [],
                            paid: true
                        });
                        await user.save();
                    } else {
                        // Mark as paid if they were already enrolled (e.g. pending/free)
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
                // We don't rollback payment status here, but might want to flag it or log critical error
            }

        } else if (action === 'reject') {
            payment.status = 'rejected'; // Using 'rejected' enum instead of failed for admin rejection
            payment.processedAt = new Date();
            await payment.save();
        }

        return NextResponse.json({ message: `Payment ${action}d` });

    } catch (error: any) {
        console.error("Error updating payment:", error);
        return NextResponse.json(
            { message: error.message || 'Failed to update payment' },
            { status: 500 }
        );
    }
}
