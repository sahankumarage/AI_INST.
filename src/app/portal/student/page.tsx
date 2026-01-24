"use client";

import { motion } from "framer-motion";
import { Play, Clock, BookOpen, ArrowRight, Trophy, Target, Zap, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface EnrolledCourse {
    courseSlug: string;
    courseName: string;
    enrolledAt: string;
    progress: number;
    completedLessons: string[];
    paid: boolean;
    courseDetails?: {
        title: string;
        description: string;
        duration: string;
        level: string;
        totalLessons: number;
    };
}

interface Stats {
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
}

// Gradient based on index
const getGradient = (index: number) => {
    const gradients = [
        "from-indigo-500 to-violet-500",
        "from-blue-500 to-cyan-500",
        "from-rose-500 to-orange-400",
        "from-emerald-500 to-teal-500",
        "from-purple-500 to-pink-500"
    ];
    return gradients[index % gradients.length];
};

export default function StudentDashboard() {
    const [user, setUser] = useState<any>(null);
    const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
    const [stats, setStats] = useState<Stats>({ totalCourses: 0, completedCourses: 0, inProgressCourses: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const userStr = localStorage.getItem("lms_user");
        if (userStr) {
            const userData = JSON.parse(userStr);
            setUser(userData);
            fetchEnrollments(userData.id);
        } else {
            setIsLoading(false);
        }
    }, []);

    const fetchEnrollments = async (userId: string) => {
        try {
            const res = await fetch(`/api/student/enrollments?userId=${userId}`);
            const data = await res.json();
            setEnrolledCourses(data.enrolledCourses || []);
            setStats(data.stats || { totalCourses: 0, completedCourses: 0, inProgressCourses: 0 });
        } catch (error) {
            console.error('Error fetching enrollments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const continueCourse = enrolledCourses.find(c => c.progress > 0 && c.progress < 100) || enrolledCourses[0];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                    Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
                </h1>
                <p className="text-slate-500">Continue your learning journey right where you left off.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Enrolled Courses", value: stats.totalCourses, icon: BookOpen, color: "bg-indigo-500" },
                    { label: "Completed", value: stats.completedCourses, icon: Trophy, color: "bg-emerald-500" },
                    { label: "In Progress", value: stats.inProgressCourses, icon: Target, color: "bg-amber-500" },
                    { label: "Certificates", value: stats.completedCourses, icon: Zap, color: "bg-purple-500" },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"
                    >
                        <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-white mb-3`}>
                            <stat.icon size={20} />
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                        <div className="text-sm text-slate-500">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Continue Learning Card */}
            {continueCourse && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden mb-8"
                >
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            {/* Course Thumbnail */}
                            <div className={`w-full md:w-64 h-40 rounded-2xl bg-gradient-to-br ${getGradient(0)} flex items-center justify-center flex-shrink-0 relative overflow-hidden group cursor-pointer`}>
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                                </div>
                            </div>

                            {/* Course Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold uppercase">
                                        {continueCourse.progress > 0 ? 'In Progress' : 'Not Started'}
                                    </span>
                                    <span className="text-sm text-slate-400 flex items-center gap-1">
                                        <Clock size={14} />
                                        {continueCourse.courseDetails?.duration || 'Self-paced'}
                                    </span>
                                </div>

                                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
                                    {continueCourse.courseDetails?.title || continueCourse.courseName}
                                </h2>

                                <p className="text-slate-500 mb-4">
                                    {continueCourse.courseDetails?.description?.substring(0, 100)}...
                                </p>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-500">
                                            {continueCourse.completedLessons?.length || 0} of {continueCourse.courseDetails?.totalLessons || 0} lessons completed
                                        </span>
                                        <span className="font-bold text-slate-900">{continueCourse.progress}%</span>
                                    </div>
                                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${continueCourse.progress}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                        />
                                    </div>
                                </div>

                                <Link href={`/portal/student/classroom/${continueCourse.courseSlug}`} className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors">
                                    Continue Learning <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* My Courses Grid */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">My Courses</h2>
                    <Link href="/portal/student/courses" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1">
                        View All <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledCourses.slice(0, 2).map((course, i) => (
                        <motion.div
                            key={course.courseSlug}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
                        >
                            <div className={`h-32 bg-gradient-to-br ${getGradient(i)} relative`}>
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/30 backdrop-blur-sm rounded text-white text-xs">
                                    {(course.courseDetails?.totalLessons || 0) - (course.completedLessons?.length || 0)} lessons left
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                    {course.courseDetails?.title || course.courseName}
                                </h3>
                                <p className="text-sm text-slate-500 mb-4">
                                    Enrolled {new Date(course.enrolledAt).toLocaleDateString()}
                                </p>

                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-slate-500">Progress</span>
                                    <span className="font-bold text-slate-900">{course.progress}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 rounded-full transition-all"
                                        style={{ width: `${course.progress}%` }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Explore More Card */}
                    <Link href="/portal/student/courses">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="h-full min-h-[280px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-6 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all cursor-pointer"
                        >
                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-indigo-500">
                                <BookOpen size={24} />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Explore Courses</h3>
                            <p className="text-sm text-slate-500">Browse our catalog to find your next AI challenge</p>
                        </motion.div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
