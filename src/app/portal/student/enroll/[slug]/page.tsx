"use client";

import { useParams, useRouter } from "next/navigation";
import { courseData } from "@/data/courses";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, ShieldCheck, Check, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAlert } from "@/components/ui/AlertService";

export default function EnrollPage() {
    const params = useParams();
    const router = useRouter();
    const alertService = useAlert();
    const slug = typeof params?.slug === 'string' ? params.slug : '';
    const course = courseData[slug];

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");
    const [userId, setUserId] = useState<string | null>(null);
    const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);

    // New State
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [promoCode, setPromoCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [isPromoApplied, setIsPromoApplied] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem("lms_user");
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setUserId(user.id);
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

    // Calculations
    const originalPrice = course.price || 499;
    const discountAmount = originalPrice * discount;
    const finalPrice = originalPrice - discountAmount;

    const handleApplyPromo = () => {
        if (!promoCode) return;

        // Mock promo code logic
        if (promoCode.toUpperCase() === 'AI_INST_2025' || promoCode.toUpperCase() === 'WELCOME10') {
            setDiscount(0.1); // 10%
            setIsPromoApplied(true);
            alertService.success("Promo Code Applied", "You saved 10%!");
        } else {
            alertService.error("Invalid Code", "This promo code is invalid or expired.");
            setDiscount(0);
            setIsPromoApplied(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setReceiptFile(e.target.files[0]);
        }
    };

    const handlePayment = async () => {
        if (!userId) {
            setError("Please log in to enroll in this course");
            alertService.error("Login Required", "Please log in to enroll in this course");
            return;
        }

        if (paymentMethod === 'bank' && !receiptFile) {
            setError("Please upload your payment receipt");
            alertService.error("Receipt Missing", "Please upload the bank transfer receipt to continue.");
            return;
        }

        setIsProcessing(true);
        setError("");
        const loadingId = alertService.loading("Processing Enrollment", "Please wait...");

        try {
            let receiptBase64 = null;
            if (paymentMethod === 'bank' && receiptFile) {
                const reader = new FileReader();
                receiptBase64 = await new Promise((resolve, reject) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(receiptFile);
                });
            }

            // Call the enrollment API
            const res = await fetch('/api/student/enrollments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    courseSlug: slug,
                    courseName: course.title,
                    paymentMethod,
                    amountPaid: finalPrice,
                    status: paymentMethod === 'bank' ? 'pending' : 'active',
                    receiptImage: receiptBase64
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Enrollment failed');
            }

            // Update localStorage
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
                    paid: paymentMethod === 'card', // If bank, pending
                    enrolledAt: new Date().toISOString()
                });
                localStorage.setItem("lms_user", JSON.stringify(user));
            }

            alertService.dismissAlert(loadingId);

            if (paymentMethod === 'bank') {
                alertService.success("Receipt Submitted", "Your enrollment is processing. We will verify it as soon as possible.");
            } else {
                alertService.success("Enrollment Successful! 🎉", "You're now enrolled. Start learning!");
            }

            router.push("/portal/student/courses?enrolled=success");

        } catch (err: any) {
            alertService.dismissAlert(loadingId);
            alertService.error("Enrollment Failed", err.message || 'Something went wrong.');
            setError(err.message || 'Something went wrong.');
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
        <div className="max-w-6xl mx-auto py-8">
            <Link
                href="/portal/student/courses"
                className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-8"
            >
                <ArrowLeft size={20} /> Back to Courses
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Course Info - Left 2 Columns */}
                <div className="lg:col-span-2">
                    <span className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${course.gradient} text-white text-xs font-bold mb-4`}>
                        {course.level}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{course.title}</h1>
                    <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                        {course.description}
                    </p>

                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-8">
                        <h3 className="font-bold text-slate-900 mb-4 text-lg">What's included:</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    {/* Bank Details Section (Only visible if bank selected) */}
                    {paymentMethod === 'bank' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-slate-50 rounded-2xl p-6 border border-slate-200 overflow-hidden"
                        >
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-indigo-600" />
                                Bank Transfer Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="p-4 bg-white rounded-xl border border-slate-200">
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Bank Name</p>
                                    <p className="font-semibold text-slate-900">Commercial Bank</p>
                                </div>
                                <div className="p-4 bg-white rounded-xl border border-slate-200">
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Account Name</p>
                                    <p className="font-semibold text-slate-900">AI INST Academy</p>
                                </div>
                                <div className="p-4 bg-white rounded-xl border border-slate-200">
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Account Number</p>
                                    <p className="font-mono font-bold text-lg text-indigo-600">1000 5566 8890</p>
                                </div>
                                <div className="p-4 bg-white rounded-xl border border-slate-200">
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Branch</p>
                                    <p className="font-semibold text-slate-900">Colombo Head Office</p>
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-start gap-3 mb-6">
                                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-yellow-800">Verification Process</p>
                                    <p className="text-sm text-yellow-700 mt-1 mb-2">
                                        After uploading your receipt, please allow some time for verification. Your access will be activated as soon as possible.
                                    </p>
                                    <div className="text-xs text-yellow-800/80 pt-2 border-t border-yellow-200/50">
                                        <p>Questions? Contact support@aiinst.lk or +94 77 123 4567</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Payment Card - Right Column */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sticky top-8"
                    >
                        {/* Price Section */}
                        <div className="mb-6 border-b border-slate-100 pb-6">
                            <p className="text-slate-500 text-sm mb-1 font-medium">Total Investment</p>
                            <div className="flex items-end gap-2">
                                <h2 className="text-4xl font-bold text-slate-900">${finalPrice.toFixed(2)}</h2>
                                {isPromoApplied && (
                                    <span className="text-lg text-slate-400 line-through mb-1">${originalPrice}</span>
                                )}
                            </div>
                        </div>

                        {/* Payment Method Selector */}
                        <div className="mb-6">
                            <h4 className="font-bold text-slate-900 text-sm mb-3">Select Payment Method</h4>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setPaymentMethod('card')}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${paymentMethod === 'card'
                                        ? 'border-indigo-600 bg-indigo-50/20'
                                        : 'border-slate-100 hover:border-slate-200'
                                        }`}
                                >
                                    <CreditCard className={paymentMethod === 'card' ? 'text-indigo-600' : 'text-slate-400'} size={20} />
                                    <div className="text-left">
                                        <p className={`font-semibold text-sm ${paymentMethod === 'card' ? 'text-indigo-900' : 'text-slate-600'}`}>Credit / Debit Card</p>
                                    </div>
                                    <div className={`ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-indigo-600' : 'border-slate-300'
                                        }`}>
                                        {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                                    </div>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod('bank')}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${paymentMethod === 'bank'
                                        ? 'border-indigo-600 bg-indigo-50/20'
                                        : 'border-slate-100 hover:border-slate-200'
                                        }`}
                                >
                                    <div className={paymentMethod === 'bank' ? 'text-indigo-600' : 'text-slate-400'}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21v-7M19 21v-7M4 10l8-5 8 5M2 10h20" /></svg>
                                    </div>
                                    <div className="text-left">
                                        <p className={`font-semibold text-sm ${paymentMethod === 'bank' ? 'text-indigo-900' : 'text-slate-600'}`}>Bank Transfer</p>
                                    </div>
                                    <div className={`ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'bank' ? 'border-indigo-600' : 'border-slate-300'
                                        }`}>
                                        {paymentMethod === 'bank' && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Promo Code */}
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Promo Code</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    placeholder="Enter code"
                                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                />
                                <button
                                    onClick={handleApplyPromo}
                                    disabled={isPromoApplied}
                                    className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isPromoApplied ? 'Applied' : 'Apply'}
                                </button>
                            </div>
                        </div>

                        {/* Bank Receipt Upload */}
                        {paymentMethod === 'bank' && (
                            <div className="mb-6 animate-in fade-in slide-in-from-top-2">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Upload Receipt</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                    {receiptFile && (
                                        <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                                            <Check size={12} /> {receiptFile.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                <p className="text-red-600 text-xs">{error}</p>
                            </div>
                        )}

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
                                    {paymentMethod === 'bank' ? 'Submit Receipt' : 'Pay & Enroll'}
                                </>
                            )}
                        </button>

                        <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-xs font-medium">
                            <ShieldCheck size={14} />
                            <span>Secure Enrollment Processing</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

