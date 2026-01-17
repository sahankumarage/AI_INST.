"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, ArrowRight, Star, Code, Zap, GraduationCap, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";

const courses = [
    {
        title: "AI-Driven Web Development",
        description: "Learn by doing — build and deploy real websites using AI-assisted development. No prior experience required.",
        level: "Beginner",
        duration: "8 Weeks",
        rating: 4.9,
        category: "Hands-On",
        featured: true,
        highlights: ["Live Projects", "AI Tools Mastery", "Portfolio Ready"],
        gradient: "from-indigo-600 via-violet-600 to-purple-600",
        accentColor: "indigo",
        icon: <Code className="w-6 h-6" />
    },
    {
        title: "AI Fundamentals for Everyone",
        description: "Master the basics of Artificial Intelligence, from neural networks to ethical considerations. No coding experience required.",
        level: "Beginner",
        duration: "4 Weeks",
        rating: 4.8,
        category: "Foundation",
        featured: false,
        highlights: ["Zero Prerequisites", "Interactive Labs", "Certificate"],
        gradient: "from-blue-500 via-cyan-500 to-teal-400",
        accentColor: "blue",
        icon: <BookOpen className="w-6 h-6" />
    },
    {
        title: "AI-Powered Content Creation",
        description: "Create stunning content with AI tools — from writing compelling copy to generating images and videos for social media, blogs, and marketing.",
        level: "Beginner",
        duration: "4 Weeks",
        rating: 4.8,
        category: "Creative",
        featured: false,
        highlights: ["AI Writing Tools", "Image Generation", "Video & Audio AI"],
        gradient: "from-rose-500 via-pink-500 to-orange-400",
        accentColor: "rose",
        icon: <Sparkles className="w-6 h-6" />
    },
];

const featuredCourse = courses.find(c => c.featured);
const otherCourses = courses.filter(c => !c.featured);

export default function CoursesPage() {
    return (
        <main className="min-h-screen bg-white pt-24 pb-20 overflow-hidden">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full blur-3xl opacity-60" />
                <div className="absolute bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 mb-6">
                        <GraduationCap className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-semibold text-indigo-700">AI Institute Academy</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
                        Transform Your Career with<br />
                        <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                            AI Expertise
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
                        Industry-designed curriculum taught by pioneers. From foundational concepts to production-grade deployments.
                    </p>
                </motion.div>

                {/* Featured Course - Hero Card */}
                {featuredCourse && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="mb-20"
                    >
                        <div className="relative group">
                            {/* Glow Effect */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${featuredCourse.gradient} rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />

                            <div className="relative bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
                                <div className="grid md:grid-cols-2 gap-0">
                                    {/* Left Content */}
                                    <div className="p-8 md:p-12 flex flex-col justify-center">
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
                                                <Zap className="w-3 h-3" /> Featured
                                            </span>
                                            <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wide">
                                                {featuredCourse.category}
                                            </span>
                                        </div>

                                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                                            {featuredCourse.title}
                                        </h2>
                                        <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                                            {featuredCourse.description}
                                        </p>

                                        {/* Course Highlights */}
                                        <div className="flex flex-wrap gap-3 mb-8">
                                            {featuredCourse.highlights.map((highlight, idx) => (
                                                <span key={idx} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-medium">
                                                    <ChevronRight className="w-4 h-4" />
                                                    {highlight}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Stats Row */}
                                        <div className="flex items-center gap-6 mb-8">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-5 h-5 text-slate-400" />
                                                <span className="text-slate-600 font-medium">{featuredCourse.duration}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                                                <span className="text-slate-600 font-medium">{featuredCourse.rating}</span>
                                            </div>
                                        </div>

                                        <Link href={`/courses/${featuredCourse.title.toLowerCase().replace(/ /g, "-")}`}>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r ${featuredCourse.gradient} text-white font-semibold text-lg shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300`}
                                            >
                                                Enroll Now <ArrowRight className="w-5 h-5" />
                                            </motion.button>
                                        </Link>
                                    </div>

                                    {/* Right Visual */}
                                    <div className={`relative bg-gradient-to-br ${featuredCourse.gradient} p-8 md:p-12 flex items-center justify-center min-h-[300px] md:min-h-[400px]`}>
                                        {/* Decorative Elements */}
                                        <div className="absolute inset-0 overflow-hidden">
                                            <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/20 rounded-2xl rotate-12" />
                                            <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-white/20 rounded-full" />
                                            <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white/10 rounded-xl rotate-45" />
                                            <div className="absolute bottom-1/3 left-1/4 w-8 h-8 bg-white/10 rounded-full" />
                                        </div>

                                        {/* Main Icon */}
                                        <div className="relative">
                                            <div className="w-32 h-32 md:w-40 md:h-40 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-2xl border border-white/30">
                                                <div className="text-white scale-[2.5]">
                                                    {featuredCourse.icon}
                                                </div>
                                            </div>
                                            {/* Floating badge */}
                                            <div className="absolute -top-4 -right-4 px-4 py-2 bg-white rounded-xl shadow-lg text-slate-900 font-bold text-sm">
                                                {featuredCourse.level}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Learning Pathway Section Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mb-12"
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Explore All Courses</h2>
                    <p className="text-slate-500">Choose your learning path and master AI skills step by step</p>
                </motion.div>

                {/* Other Courses - Modern List View */}
                <div className="space-y-6">
                    {otherCourses.map((course, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                        >
                            <Link href={`/courses/${course.title.toLowerCase().replace(/ /g, "-")}`}>
                                <div className="group relative bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Left Accent Bar */}
                                        <div className={`w-full md:w-2 h-2 md:h-auto bg-gradient-to-b ${course.gradient}`} />

                                        {/* Icon Section */}
                                        <div className="p-6 md:p-8 flex items-center justify-center md:border-r border-slate-100">
                                            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${course.gradient} flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                                {course.icon}
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="flex-1 p-6 md:p-8">
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
                                                            ${course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                                                                course.level === 'Intermediate' ? 'bg-amber-100 text-amber-700' :
                                                                    'bg-red-100 text-red-700'}`}>
                                                            {course.level}
                                                        </span>
                                                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wide">
                                                            {course.category}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                                        {course.title}
                                                    </h3>
                                                    <p className="text-slate-500 mb-4 max-w-2xl">
                                                        {course.description}
                                                    </p>

                                                    {/* Highlights Pills */}
                                                    <div className="flex flex-wrap gap-2">
                                                        {course.highlights.map((highlight, idx) => (
                                                            <span key={idx} className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-sm font-medium">
                                                                {highlight}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Right Stats & CTA */}
                                                <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 md:min-w-[140px]">
                                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock className="w-4 h-4" />
                                                            {course.duration}
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                            {course.rating}
                                                        </div>
                                                    </div>

                                                    <div className={`mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r ${course.gradient} text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2`}>
                                                        View Course <ArrowRight className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="mt-20 text-center"
                >
                    <div className="inline-block p-8 md:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full blur-3xl" />
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                                Not sure where to start?
                            </h3>
                            <p className="text-slate-400 mb-6 max-w-md mx-auto">
                                Book a free consultation with our learning advisors to find the perfect course for your goals.
                            </p>
                            <Link href="/contact">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 rounded-2xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors flex items-center gap-2 mx-auto"
                                >
                                    Get Personalized Advice <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
