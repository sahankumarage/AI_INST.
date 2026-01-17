"use client";

import { motion } from "framer-motion";
import { Play, Clock, Award, BookOpen, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const myCourses = [
    {
        id: 1,
        title: "AI-Driven Web Development",
        progress: 35,
        totalLessons: 24,
        completedLessons: 8,
        nextLesson: "Building Components with AI",
        thumbnail: "from-indigo-500 to-violet-500",
        lastAccessed: "2 hours ago"
    },
    {
        id: 2,
        title: "AI Fundamentals for Everyone",
        progress: 10,
        totalLessons: 12,
        completedLessons: 1,
        nextLesson: "Understanding Neural Networks",
        thumbnail: "from-blue-500 to-cyan-500",
        lastAccessed: "1 day ago"
    }
];

export default function StudentDashboard() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">My Dashboard</h1>
                <p className="text-slate-500">Resume your learning journey right where you left off.</p>
            </div>

            {/* Continue Learning - Hero Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 mb-10 overflow-hidden relative"
            >
                <div className="absolute top-0 right-0 p-12 opacity-5">
                    <Play className="w-64 h-64" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-full md:w-64 h-40 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 shadow-lg">
                        <Play className="w-16 h-16 text-white opacity-80" fill="currentColor" />
                    </div>

                    <div className="flex-1 w-full">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wide">In Progress</span>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock size={12} /> Last accessed 2h ago
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">AI-Driven Web Development</h2>
                        <p className="text-slate-500 mb-6">Next Lesson: <span className="text-slate-900 font-medium">Building Components with AI</span></p>

                        <div className="flex items-center gap-4">
                            <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 w-[35%] rounded-full relative">
                                    <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/20"></div>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-slate-700">35%</span>
                        </div>
                    </div>

                    <button className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shrink-0 whitespace-nowrap flex items-center gap-2">
                        Continue Learning <ArrowRight size={18} />
                    </button>
                </div>
            </motion.div>

            {/* My Courses Grid */}
            <h2 className="text-xl font-bold text-slate-900 mb-6">My Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCourses.map((course, i) => (
                    <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-lg transition-all group cursor-pointer"
                    >
                        <div className={`h-40 rounded-xl bg-gradient-to-br ${course.thumbnail} mb-5 relative overflow-hidden group-hover:scale-[1.02] transition-transform`}>
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                            <div className="absolute bottom-4 left-4 right-4">
                                <span className="text-xs font-medium text-white/90 bg-black/20 backdrop-blur-md px-2 py-1 rounded">{course.totalLessons - course.completedLessons} lessons remaining</span>
                            </div>
                        </div>

                        <h3 className="font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                        <p className="text-xs text-slate-500 mb-4">Last activity: {course.lastAccessed}</p>

                        <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                            <span>Progress</span>
                            <span className="font-bold text-slate-900">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                            <div className={`h-full bg-indigo-500 rounded-full`} style={{ width: `${course.progress}%` }}></div>
                        </div>

                        <button className="w-full py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm">
                            View Course Details
                        </button>
                    </motion.div>
                ))}

                {/* Explore More Card */}
                <Link href="/courses">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="h-full bg-slate-50 p-5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[300px]"
                    >
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm text-indigo-500">
                            <BookOpen size={24} />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Explore New Courses</h3>
                        <p className="text-sm text-slate-500 px-4">Browse our catalog to find your next AI challenge</p>
                    </motion.div>
                </Link>
            </div>
        </div>
    );
}
