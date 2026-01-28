"use client";

import { useParams, useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, ShieldCheck, Check, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAlert } from "@/components/ui/AlertService";

export default function EnrollPage() {
    const params = useParams();
    const router = useRouter();
    const alertService = useAlert();
    const slug = typeof params?.slug === 'string' ? params.slug : '';

    // State
    const [course, setCourse] = useState<any>(null);
    const [isLoadingCourse, setIsLoadingCourse] = useState(true);
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

    // Fetch Course Data
    useEffect(() => {
        const fetchCourse = async () => {
            if (!slug) return;
            try {
                const res = await fetch(`/api/courses?slug=${slug}`);
                if (!res.ok) throw new Error('Failed to load course');
                const data = await res.json();

                // Add fallback gradient if missing (since DB might not have it)
                const courseData = data.course;
                if (courseData && !courseData.gradient) {
                    courseData.gradient = "from-indigo-600 to-violet-600";
                }
                setCourse(courseData);
            } catch (err) {
                console.error("Error fetching course:", err);
                setError("Could not load course details.");
            } finally {
                setIsLoadingCourse(false);
            }
        };

        fetchCourse();
    }, [slug]);

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

    if (isLoadingCourse) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="p-8 text-center bg-white rounded-lg shadow max-w-2xl mx-auto my-12">
                <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2 text-slate-800">Course Not Found</h1>
                <p className="text-slate-500 mb-6">The course you are looking for does not exist or has been removed.</p>
                <Link href="/portal/student/courses" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                    Back to Courses
                </Link>
            </div>
        );
    }

    // Calculations
    const originalPrice = course.price || 0;
    const discountAmount = originalPrice * discount;
    const finalPrice = originalPrice - discountAmount;

    const handleApplyPromo = async () => {
        if (!promoCode) return;

        setIsProcessing(true); // Re-using processing state for loading indicator if needed, or create new one
        try {
            const res = await fetch('/api/courses/verify-promo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug, code: promoCode })
            });
            const data = await res.json();

            if (data.isValid) {
                // Calculate discount factor (e.g., 10% -> 0.1)
                // Assuming stored as percentage number (e.g., 20)
                const discountFactor = data.discountType === 'percentage'
                    ? (data.discountAmount / 100)
                    : 0; // Fixed amount logic would range differently, keeping simple for now

                // If it's a fixed amount, we might need to adjust logic, but let's assume percentage for now as per previous UI

                setDiscount(discountFactor);
                setIsPromoApplied(true);
                alertService.success("Promo Code Applied", `You saved ${data.discountAmount}%!`);
            } else {
                alertService.error("Invalid Code", data.message || "This promo code is invalid.");
                setDiscount(0);
                setIsPromoApplied(false);
            }
        } catch (error) {
            console.error("Promo check error", error);
            alertService.error("Error", "Could not verify promo code");
        } finally {
            setIsProcessing(false);
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
            if (paymentMethod === 'card') {
                // Get user details from localStorage for Dodo
                const userStr = localStorage.getItem("lms_user");
                const user = userStr ? JSON.parse(userStr) : {};

                // Call Dodo Payment initialization with new dynamic pricing API
                const res = await fetch('/api/payments/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId,
                        courseSlug: slug,
                        promoCode: isPromoApplied ? promoCode : undefined,
                        userEmail: user.email,
                        userName: user.name,
                        successUrl: `${window.location.origin}/portal/student/courses?enrolled=success&slug=${slug}`,
                        cancelUrl: `${window.location.href}?payment=cancelled`
                    })
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || 'Payment processing failed');
                }

                if (data.paymentUrl) {
                    window.location.href = data.paymentUrl;
                    return; // Prevent further execution as we are redirecting
                } else {
                    throw new Error('No payment URL received');
                }
            }

            // Bank transfer logic
            let receiptUrl = '';
            if (paymentMethod === 'bank' && receiptFile) {
                // Upload to Cloudinary first
                const formData = new FormData();
                formData.append('file', receiptFile);
                formData.append('folder', 'receipts');

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });

                if (!uploadRes.ok) {
                    throw new Error('Failed to upload receipt image');
                }

                const uploadData = await uploadRes.json();
                receiptUrl = uploadData.url;
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
                    receiptImage: receiptUrl
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
                    paid: false, // If bank, pending. Card payments redirect before this.
                    enrolledAt: new Date().toISOString()
                });
                localStorage.setItem("lms_user", JSON.stringify(user));
            }

            alertService.dismissAlert(loadingId);

            // At this point, it must be a bank transfer or successful API call that didn't redirect (which shouldn't happen for card)
            alertService.dismissAlert(loadingId);
            alertService.success("Receipt Submitted", "Your enrollment is processing. We will verify it as soon as possible.");
            setIsProcessing(false);

            router.push("/portal/student/courses?enrolled=success");

        } catch (err: any) {
            alertService.dismissAlert(loadingId);
            alertService.error("Enrollment Failed", err.message || 'Something went wrong.');
            setError(err.message || 'Something went wrong.');
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
                    <p className="text-slate-600 text-lg leading-relaxed mb-6">
                        {course.description}
                    </p>

                    <a
                        href={`/courses/${slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 hover:underline mb-8"
                    >
                        See Full Course Details <ArrowRight size={16} />
                    </a>

                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-8">
                        <h3 className="font-bold text-slate-900 mb-4 text-lg">What's included:</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {course.features?.map((feature: any, i: number) => (
                                <li key={i} className="flex items-center gap-3 text-slate-600">
                                    <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 border border-indigo-100">
                                        <Check size={14} className="text-indigo-600" />
                                    </div>
                                    <span className="text-sm font-medium">
                                        {typeof feature === 'string' ? feature : feature.text}
                                    </span>
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
                                    <p className="font-semibold text-slate-900">Sampath Bank</p>
                                </div>
                                <div className="p-4 bg-white rounded-xl border border-slate-200">
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Account Name</p>
                                    <p className="font-semibold text-slate-900">Sahan Kumarage</p>
                                </div>
                                <div className="p-4 bg-white rounded-xl border border-slate-200">
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Account Number</p>
                                    <p className="font-mono font-bold text-lg text-indigo-600">119952914782</p>
                                </div>
                                <div className="p-4 bg-white rounded-xl border border-slate-200">
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Branch</p>
                                    <p className="font-semibold text-slate-900">Mount Lavinia</p>
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
                            <div className="flex items-end gap-2 mb-2">
                                <h2 className="text-4xl font-bold text-slate-900">
                                    {course.currency === 'USD' ? '$' : 'LKR '}
                                    {finalPrice.toLocaleString()}
                                </h2>
                                {isPromoApplied && (
                                    <span className="text-lg text-slate-400 line-through mb-1">
                                        {course.currency === 'USD' ? '$' : 'LKR '}
                                        {originalPrice.toLocaleString()}
                                    </span>
                                )}
                            </div>
                            {isPromoApplied && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">
                                                ✓
                                            </div>
                                            <p className="text-sm font-semibold text-green-800">
                                                Promo Code Applied!
                                            </p>
                                        </div>
                                        <p className="text-lg font-bold text-green-700">
                                            Save {course.currency === 'USD' ? '$' : 'LKR '}{discountAmount.toLocaleString()}
                                        </p>
                                    </div>
                                    <p className="text-xs text-green-600 mt-2">
                                        You'll be charged <strong>{course.currency === 'USD' ? '$' : 'LKR '}{finalPrice.toLocaleString()}</strong> on the payment page.
                                    </p>
                                </div>
                            )}
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
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                                    Upload Payment Receipt
                                </label>

                                {/* Custom File Upload Button */}
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="receipt-upload"
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="receipt-upload"
                                        className="block w-full cursor-pointer"
                                    >
                                        <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${receiptFile
                                                ? 'border-green-300 bg-green-50'
                                                : 'border-slate-300 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50'
                                            }`}>
                                            {receiptFile ? (
                                                // File Selected State
                                                <div className="space-y-3">
                                                    <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">
                                                        <Check size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-green-700">
                                                            Receipt Uploaded Successfully
                                                        </p>
                                                        <p className="text-xs text-green-600 mt-1">
                                                            {receiptFile.name}
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setReceiptFile(null);
                                                        }}
                                                        className="text-xs text-slate-600 hover:text-slate-800 underline"
                                                    >
                                                        Choose Different File
                                                    </button>
                                                </div>
                                            ) : (
                                                // Upload State
                                                <div className="space-y-3">
                                                    <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-800">
                                                            Click to Upload Receipt
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            or drag and drop
                                                        </p>
                                                    </div>
                                                    <p className="text-xs text-slate-400">
                                                        PNG, JPG, PDF up to 10MB
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                </div>

                                {/* Bank Transfer Instructions */}
                                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-xs font-semibold text-blue-800 mb-2">
                                        📋 Bank Transfer Instructions
                                    </p>
                                    <ul className="text-xs text-blue-700 space-y-1">
                                        <li>• Transfer to: [Your Bank Account Details]</li>
                                        <li>• Upload receipt after payment</li>
                                        <li>• We'll verify within 24 hours</li>
                                    </ul>
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

