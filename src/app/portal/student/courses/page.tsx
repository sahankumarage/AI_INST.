"use client";

import { motion } from "framer-motion";
import { Play, Clock, BookOpen, ArrowRight, CheckCircle, Loader2, Search, Star, DollarSign } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

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
    const [courses, setCourses] = useState<EnrolledCourse[]>([]);
    const [browseCourses, setBrowseCourses] = useState<BrowseCourse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isBrowseLoading, setIsBrowseLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'enrolled' | 'completed' | 'browse'>('enrolled');
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

    // Fetch browse courses when tab changes to 'browse'
    useEffect(() => {
        if (activeTab === 'browse' && browseCourses.length === 0) {
            fetchBrowseCourses();
        }
    }, [activeTab]);

    const fetchEnrollments = async (userId: string) => {
        try {
            const res = await fetch(`/api/student/enrollments?userId=${userId}`);
            const data = await res.json();
            setCourses(data.enrolledCourses || []);
        } catch (error) {
            console.error('Error fetching enrollments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBrowseCourses = async () => {
        setIsBrowseLoading(true);
        try {
            const res = await fetch('/api/courses');
            const data = await res.json();
            setBrowseCourses(data.courses || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setIsBrowseLoading(false);
        }
    };

    const enrolledCourses = courses.filter(c => c.progress < 100);
    const completedCourses = courses.filter(c => c.progress >= 100);

    // Filter browse courses by search query
    const filteredBrowseCourses = browseCourses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                {activeTab === 'browse' && (
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                        />
                    </div>
                )}
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
                <button
                    onClick={() => setActiveTab('browse')}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 ${activeTab === 'browse'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                >
                    <Search size={16} />
                    Browse All Courses
                </button>
            </div>

            {/* Browse View */}
            {activeTab === 'browse' ? (
                isBrowseLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                ) : filteredBrowseCourses.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No Courses Available</h3>
                        <p className="text-slate-500">
                            {searchQuery ? 'No courses match your search.' : 'Check back soon for new courses!'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBrowseCourses.map((course: BrowseCourse, i: number) => (
                            <motion.div
                                key={course.slug}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all group flex flex-col h-full"
                            >
                                <div className={`h-48 bg-gradient-to-br ${getGradient(i, course.gradient)} relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/20">
                                            {course.level}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                        <div className="text-white">
                                            <div className="flex items-center gap-1 text-xs font-medium bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg w-fit mb-2">
                                                <Clock size={12} /> {course.duration}
                                            </div>
                                            <div className="font-bold text-xl">${course.price}</div>
                                        </div>
                                        {isEnrolled(course.slug) && (
                                            <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-lg flex items-center gap-1">
                                                <CheckCircle size={12} /> Enrolled
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                        {course.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">
                                        {course.description}
                                    </p>

                                    <div className="flex items-center gap-4 mb-6 text-sm text-slate-500">
                                        {course.rating && (
                                            <div className="flex items-center gap-1">
                                                <Star size={14} className="text-amber-400 fill-amber-400" />
                                                <span className="font-medium text-slate-700">{course.rating}</span>
                                            </div>
                                        )}
                                        {course.lessons && (
                                            <div className="flex items-center gap-1">
                                                <BookOpen size={14} />
                                                <span>{course.lessons} Lessons</span>
                                            </div>
                                        )}
                                    </div>

                                    {isEnrolled(course.slug) ? (
                                        <Link href={`/portal/student/classroom/${course.slug}`} className="w-full">
                                            <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
                                                <Play size={16} fill="currentColor" />
                                                Continue Learning
                                            </button>
                                        </Link>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3">
                                            <Link href={`/courses/${course.slug}`} className="w-full">
                                                <button className="w-full py-3 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors">
                                                    Details
                                                </button>
                                            </Link>
                                            <Link href={`/portal/student/enroll/${course.slug}`} className="w-full">
                                                <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                                                    Enroll Now
                                                </button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )
            ) : (
                /* Courses List (Enrolled / Completed) */
                <div className="space-y-6">
                    {displayedCourses.map((course, i) => (
                        <motion.div
                            key={course.courseSlug}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="flex flex-col lg:flex-row">
                                {/* Thumbnail */}
                                <div className={`lg:w-72 h-48 lg:h-auto bg-gradient-to-br ${getGradient(i)} relative flex-shrink-0`}>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                                            <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-4">
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
                                        <Link href={`/portal/student/classroom/${course.courseSlug}`}>
                                            <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                                                Continue <ArrowRight size={16} />
                                            </button>
                                        </Link>
                                    </div>
                                </div>
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
                            <button
                                onClick={() => setActiveTab('browse')}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                            >
                                Browse Courses
                            </button>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
}
