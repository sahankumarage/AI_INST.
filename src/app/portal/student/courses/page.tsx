"use client";

import { motion } from "framer-motion";
import { Play, Clock, BookOpen, ArrowRight, CheckCircle, Loader2, Search, Star, DollarSign } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAlert } from "@/components/ui/AlertService";

interface EnrolledCourse {
    courseSlug: string;
    courseName: string;
    enrolledAt: string;
    progress: number;
    completedLessons: string[];
    paid: boolean;
    isPendingVerification?: boolean;
    courseDetails?: {
        title: string;
        description: string;
        thumbnail?: string;
        duration: string;
        level: string;
        totalLessons: number;
        modules: any[];
    };
}

interface BrowseCourse {
    _id: string;
    slug: string;
    title: string;
    description: string;
    duration: string;
    price: number;
    level: string;
    thumbnail?: string;
    lessons?: number;
    rating?: number;
    gradient?: string;
    isPublished: boolean;
}

// Gradient based on index
const getGradient = (index: number, courseGradient?: string) => {
    if (courseGradient) return courseGradient;
    const gradients = [
        "from-indigo-500 to-violet-500",
        "from-blue-500 to-cyan-500",
        "from-rose-500 to-orange-400",
        "from-emerald-500 to-teal-500",
        "from-purple-500 to-pink-500"
    ];
    return gradients[index % gradients.length];
};

export default function StudentCoursesPage() {
    const alert = useAlert();
    const [courses, setCourses] = useState<EnrolledCourse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'enrolled' | 'completed'>('enrolled');
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const userStr = localStorage.getItem("lms_user");
        if (userStr) {
            const userData = JSON.parse(userStr);
            fetchEnrollments(userData.id);
        } else {
            setIsLoading(false);
        }
    }, []);

    const fetchEnrollments = async (userId: string) => {
        try {
            const res = await fetch(`/api/student/enrollments?userId=${userId}`);
            const data = await res.json();
            setCourses(data.enrolledCourses || []);
        } catch (error) {
            console.error('Error fetching enrollments:', error);
            alert.error("Failed to load enrollments", "Please refresh the page");
        } finally {
            setIsLoading(false);
        }
    };



    // Verify Payment on Return
    useEffect(() => {
        const verifyPayment = async () => {
            const params = new URLSearchParams(window.location.search);
            const paymentId = params.get('payment_id') || params.get('paymentId');
            const transactionRef = params.get('ref');
            const enrolledStatus = params.get('enrolled');
            const courseSlug = params.get('slug');

            // Only proceed if we have some indicator of a payment return
            if (enrolledStatus !== 'success') return;

            // Get user from localStorage
            const userStr = localStorage.getItem("lms_user");
            if (!userStr) return;
            const userData = JSON.parse(userStr);

            const loadingId = alert.loading("Verifying Payment", "Please wait while we confirm your enrollment...");

            try {
                let verifyUrl = '/api/payments/verify?';

                // Try payment_id first (Dodo sends this in return URL)
                if (paymentId) {
                    verifyUrl += `paymentId=${paymentId}`;
                }
                // Fall back to transactionRef if we have it
                else if (transactionRef) {
                    verifyUrl += `ref=${transactionRef}`;
                }
                // Include userId and courseSlug for additional context
                if (userData.id) {
                    verifyUrl += `&userId=${userData.id}`;
                }
                if (courseSlug) {
                    verifyUrl += `&courseSlug=${courseSlug}`;
                }

                console.log('Verifying payment at:', verifyUrl);
                const res = await fetch(verifyUrl);
                const data = await res.json();

                console.log('Verification response:', data);

                if (data.success || data.verified || data.status === 'succeeded') {
                    alert.dismissAlert(loadingId);
                    alert.success("Enrollment Confirmed!", "You now have access to the course.");
                    // Refresh enrollments
                    fetchEnrollments(userData.id);
                } else if (data.status === 'pending' || data.status === 'processing') {
                    alert.dismissAlert(loadingId);
                    alert.info("Payment Processing", "Your payment is still being processed. Please check back in a few minutes.");
                } else if (data.message) {
                    alert.dismissAlert(loadingId);
                    alert.error("Verification Issue", data.message);
                } else {
                    alert.dismissAlert(loadingId);
                    // Silently close if no explicit error
                    console.warn("Payment verification unclear:", data);
                    // Still refresh to check if webhook already processed it
                    fetchEnrollments(userData.id);
                }
            } catch (error) {
                console.error("Verification error:", error);
                alert.dismissAlert(loadingId);
                alert.error("Verification Failed", "Please contact support if you've completed payment.");
            } finally {
                // Clean up URL parameters
                window.history.replaceState({}, '', window.location.pathname);
            }
        };

        verifyPayment();
    }, []);

    const enrolledCourses = courses.filter(c => c.progress < 100 || c.isPendingVerification);
    const completedCourses = courses.filter(c => c.progress >= 100 && !c.isPendingVerification);



    const displayedCourses = activeTab === 'enrolled' ? enrolledCourses : completedCourses;

    const isEnrolled = (slug: string) => {
        return courses.some(c => c.courseSlug === slug);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">My Courses</h1>
                    <p className="text-slate-500">Access your enrolled courses and track your progress</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
                <button
                    onClick={() => setActiveTab('enrolled')}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-colors ${activeTab === 'enrolled'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                >
                    In Progress ({enrolledCourses.length})
                </button>
                <button
                    onClick={() => setActiveTab('completed')}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-colors ${activeTab === 'completed'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                >
                    Completed ({completedCourses.length})
                </button>

            </div>

            {/* Browse View */}
            {/* Courses List (Enrolled / Completed) */}

            <div className="space-y-6">
                {displayedCourses.map((course, i) => (
                    <motion.div
                        key={course.courseSlug}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        <div className="flex flex-col lg:flex-row">
                            {/* Thumbnail */}
                            <div className={`lg:w-72 h-48 lg:h-auto bg-gradient-to-br ${getGradient(i)} relative flex-shrink-0 overflow-hidden`}>
                                {course.courseDetails?.thumbnail && (
                                    <div className="absolute inset-0 z-0">
                                        <img src={course.courseDetails.thumbnail} alt={course.courseDetails.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/10" />
                                    </div>
                                )}

                                {!course.courseDetails?.thumbnail && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                                            <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                                        </div>
                                    </div>
                                )}

                                <div className="absolute bottom-4 left-4 z-10">
                                    <span className="px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-white text-sm">
                                        {(course.courseDetails?.totalLessons || 0) - (course.completedLessons?.length || 0)} lessons left
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-6">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-1">
                                            {course.courseDetails?.title || course.courseName}
                                        </h3>
                                        <p className="text-slate-500 text-sm">
                                            {course.courseDetails?.description?.substring(0, 100)}...
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <div className="text-2xl font-bold text-indigo-600">{course.progress}%</div>
                                        <div className="text-xs text-slate-400">Complete</div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                                        style={{ width: `${course.progress}%` }}
                                    />
                                </div>

                                {/* Modules Preview */}
                                {course.courseDetails?.modules && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {course.courseDetails.modules.slice(0, 4).map((module: any, idx: number) => {
                                            const moduleCompleted = module.lessons?.every((l: any) =>
                                                course.completedLessons?.includes(l.id)
                                            );
                                            return (
                                                <span
                                                    key={idx}
                                                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium ${moduleCompleted
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-slate-100 text-slate-600'
                                                        }`}
                                                >
                                                    {moduleCompleted && <CheckCircle size={12} />}
                                                    {module.title}
                                                </span>
                                            );
                                        })}
                                        {(course.courseDetails.modules.length || 0) > 4 && (
                                            <span className="px-3 py-1.5 bg-slate-50 text-slate-400 rounded-lg text-xs">
                                                +{course.courseDetails.modules.length - 4} more
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-400 flex items-center gap-1">
                                        <Clock size={14} />
                                        Enrolled {new Date(course.enrolledAt).toLocaleDateString()}
                                    </span>
                                    {course.isPendingVerification ? (
                                        <button disabled className="px-5 py-2.5 bg-amber-100 text-amber-700 rounded-xl font-medium cursor-not-allowed flex items-center gap-2">
                                            <Clock size={16} />
                                            Verification Pending
                                        </button>
                                    ) : (
                                        <Link href={`/portal/student/classroom/${course.courseSlug}`}>
                                            <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                                                Continue <ArrowRight size={16} />
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                            {course.isPendingVerification && (
                                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-4 border-2 border-amber-200/50 rounded-2xl m-[1px] text-center">
                                    <div className="bg-white p-3 rounded-full shadow-lg mb-3">
                                        <Clock className="w-6 h-6 text-amber-500 animate-pulse" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">Verify Pending</h3>
                                    <p className="text-sm text-slate-600 max-w-xs mb-3 leading-snug">
                                        Access will be granted as soon as your payment is approved.
                                    </p>
                                    <div className="text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 w-full max-w-[240px]">
                                        <p className="font-semibold text-slate-800 mb-1">Contact Support:</p>
                                        <p className="select-all">hello@aiinst.lk</p>
                                        <p className="select-all font-medium">+94 71 744 2222</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}

                {/* Empty State for Enrolled/Completed tabs */}
                {displayedCourses.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-2xl border border-slate-200 p-12 text-center"
                    >
                        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                            {activeTab === 'enrolled' ? 'No courses in progress' : 'No completed courses yet'}
                        </h3>
                        <p className="text-slate-500 mb-6">
                            {activeTab === 'enrolled'
                                ? 'Start learning by enrolling in a course'
                                : 'Complete your enrolled courses to see them here'
                            }
                        </p>
                        <Link href="/portal/student/catalog">
                            <button
                                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                            >
                                Browse Catalog
                            </button>
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
