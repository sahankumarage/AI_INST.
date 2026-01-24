"use client";

import { useParams, useRouter } from "next/navigation";
import { courseData } from "@/data/courses";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, ShieldCheck, Check, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function EnrollPage() {
    const params = useParams();
    const router = useRouter();
    const slug = typeof params?.slug === 'string' ? params.slug : '';
    const course = courseData[slug];
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");
    const [userId, setUserId] = useState<string | null>(null);
    const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);

    useEffect(() => {
        // Get user from localStorage
        const userStr = localStorage.getItem("lms_user");
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setUserId(user.id);

                // Check if already enrolled
                if (user.enrolledCourses) {
                    const enrolled = user.enrolledCourses.some(
                        (c: any) => c.courseSlug === slug || c === slug
                    );
                    setIsAlreadyEnrolled(enrolled);
                }
            } catch (e) {
                console.error("Error parsing user data", e);
            }
        }
    }, [slug]);

    if (!course) {
        return (
            <div className="p-8 text-center bg-white rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-4 text-slate-800">Course not found</h1>
                <Link href="/portal/student/courses" className="text-indigo-600 hover:underline">
                    Back to Courses
                </Link>
            </div>
        );
    }

    const handlePayment = async () => {
        if (!userId) {
            setError("Please log in to enroll in this course");
            return;
        }

        setIsProcessing(true);
        setError("");

        try {
            // Call the enrollment API
            const res = await fetch('/api/student/enrollments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    courseSlug: slug,
                    courseName: course.title
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Enrollment failed');
            }

            // Update localStorage with new enrollment
            const userStr = localStorage.getItem("lms_user");
            if (userStr) {
                const user = JSON.parse(userStr);
                if (!user.enrolledCourses) {
                    user.enrolledCourses = [];
                }
                user.enrolledCourses.push({
                    courseSlug: slug,
                    courseName: course.title,
                    progress: 0,
                    paid: true,
                    enrolledAt: new Date().toISOString()
                });
                localStorage.setItem("lms_user", JSON.stringify(user));
            }

            // Redirect to courses page with success message
            router.push("/portal/student/courses?enrolled=success");

        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isAlreadyEnrolled) {
        return (
            <div className="max-w-2xl mx-auto py-12 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 border border-green-200 rounded-2xl p-8"
                >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-green-800 mb-2">You're Already Enrolled!</h1>
                    <p className="text-green-600 mb-6">You have access to this course. Start learning now!</p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/portal/student/courses">
                            <button className="px-6 py-3 bg-white text-green-700 rounded-xl font-medium border border-green-200 hover:bg-green-50 transition-colors">
                                Go to My Courses
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8">
            <Link
                href="/portal/student/courses"
                className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-8"
            >
                <ArrowLeft size={20} /> Back to Courses
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Course Info */}
                <div>
                    <span className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${course.gradient} text-white text-xs font-bold mb-4`}>
                        {course.level}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{course.title}</h1>
                    <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                        {course.description}
                    </p>

                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4 text-lg">What's included in this plan:</h3>
                        <ul className="space-y-4">
                            {course.features.map((feature: any, i: number) => (
                                <li key={i} className="flex items-center gap-3 text-slate-600">
                                    <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 border border-indigo-100">
                                        <Check size={14} className="text-indigo-600" />
                                    </div>
                                    <span className="text-sm font-medium">{feature.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Payment Card */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sticky top-8"
                    >
                        <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-8">
                            <div>
                                <p className="text-slate-500 text-sm mb-1 font-medium">Total Investment</p>
                                <h2 className="text-4xl font-bold text-slate-900">${course.price || 499}</h2>
                            </div>
                            <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
                                One-time payment
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
                            >
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <p className="text-red-600 text-sm">{error}</p>
                            </motion.div>
                        )}

                        <div className="space-y-4 mb-8">
                            <h4 className="font-bold text-slate-900 text-sm mb-2">Payment Method</h4>
                            <div className="flex items-center gap-4 p-4 border-2 border-indigo-600 bg-indigo-50/10 rounded-xl relative cursor-pointer">
                                <CreditCard className="text-indigo-600" size={24} />
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">Credit / Debit Card</p>
                                    <p className="text-slate-500 text-xs">Secure processing via Stripe</p>
                                </div>
                                <div className="ml-auto w-5 h-5 rounded-full border-4 border-indigo-600 flex items-center justify-center">
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all flex items-center justify-center gap-2 ${isProcessing
                                ? 'bg-slate-400 cursor-not-allowed'
                                : `bg-gradient-to-r ${course.gradient} hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`
                                }`}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Pay & Enroll
                                </>
                            )}
                        </button>

                        <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-xs font-medium">
                            <ShieldCheck size={14} />
                            <span>Secure 256-bit SSL Encrypted Payment</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

