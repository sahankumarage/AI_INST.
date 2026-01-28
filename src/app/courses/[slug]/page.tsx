"use client";

import { motion } from "framer-motion";
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    Calendar,
    Star,
    ArrowRight,
    Users,
    Award,
    BookOpen,
    Play,
    Download,
    MessageCircle,
    Globe,
    Zap,
    Target,
    GraduationCap,
    ChevronDown,
    Video
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { courseData } from "@/data/courses";

export default function CourseDetail() {
    const params = useParams();
    const slug = typeof params?.slug === 'string' ? params.slug : '';
    const course = courseData[slug];
    const [expandedWeek, setExpandedWeek] = useState<number | null>(0);

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-800">Course Not Found</h1>
                    <Link href="/courses" className="text-primary hover:underline mt-4 block">Back to Courses</Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white overflow-hidden">
            {/* Hero Section */}
            <section className={`relative pt-32 pb-20 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden`}>
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-r ${course.gradient} opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`} />
                    <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-r ${course.gradient} opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2`} />
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    {/* Breadcrumb */}
                    <Link href="/courses" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" /> Back to Courses
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left Content */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${course.gradient} text-white font-medium text-sm mb-6`}>
                                    <GraduationCap className="w-4 h-4" />
                                    {course.level} Course
                                </span>

                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                    {course.title}
                                </h1>

                                <p className="text-xl text-slate-300 mb-6">
                                    {course.subtitle}
                                </p>

                                <p className="text-slate-400 mb-8 leading-relaxed">
                                    {course.longDescription}
                                </p>

                                {/* Stats Row */}
                                <div className="flex flex-wrap gap-6">
                                    {course.isLiveCourse ? (
                                        <>
                                            <div className="flex items-center gap-2 text-white">
                                                <Video className="w-5 h-5 text-emerald-400" />
                                                <span className="font-bold">Live</span>
                                                <span className="text-slate-400">online sessions</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-white">
                                                <Clock className="w-5 h-5 text-slate-400" />
                                                <span className="font-bold">{course.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-white">
                                                <Calendar className="w-5 h-5 text-slate-400" />
                                                <span className="font-bold">{course.sessions}</span>
                                                <span className="text-slate-400">sessions</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-2 text-white">
                                                <Star className="w-5 h-5 text-amber-400 fill-current" />
                                                <span className="font-bold">{course.rating}</span>
                                                <span className="text-slate-400">rating</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-white">
                                                <Users className="w-5 h-5 text-slate-400" />
                                                <span className="font-bold">{course.students}</span>
                                                <span className="text-slate-400">students</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-white">
                                                <Clock className="w-5 h-5 text-slate-400" />
                                                <span className="font-bold">{course.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-white">
                                                <BookOpen className="w-5 h-5 text-slate-400" />
                                                <span className="font-bold">{course.lessons}</span>
                                                <span className="text-slate-400">lessons</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* Right - Enrollment Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative"
                        >
                            <div className="bg-white rounded-3xl p-8 shadow-2xl sticky top-24">
                                {/* Price */}
                                <div className="text-center mb-6">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Calendar className={`w-5 h-5 text-transparent bg-clip-text bg-gradient-to-r ${course.gradient}`} style={{ color: 'rgb(59 130 246)' }} />
                                        <span className="text-slate-600 font-medium">Open for Enrollment</span>
                                    </div>
                                </div>

                                <a href="https://learn.aiinst.io" target="_blank" rel="noopener noreferrer">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full py-4 bg-gradient-to-r ${course.gradient} text-white rounded-xl font-bold text-lg shadow-lg mb-4`}
                                    >
                                        Enroll Now
                                    </motion.button>
                                </a>



                                {/* Features */}
                                <div className="border-t border-slate-100 pt-6">
                                    <p className="text-sm font-semibold text-slate-900 mb-4">This course includes:</p>
                                    <ul className="space-y-3">
                                        {course.features.map((feature: any, i: number) => (
                                            <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                                <feature.icon className={`w-5 h-5`} style={{ color: 'rgb(59 130 246)' }} />
                                                {feature.text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 100V60C240 20 480 0 720 0C960 0 1200 20 1440 60V100H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* What You'll Learn */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${course.gradient} font-medium tracking-wider text-sm uppercase mb-3 block`}>
                            Learning Outcomes
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                            What You'll Learn
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {course.outcomes.map((outcome: string, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                            >
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${course.gradient} flex items-center justify-center flex-shrink-0`}>
                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-slate-700 font-medium leading-relaxed">{outcome}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Course Curriculum */}
            <section className="py-20 px-6 bg-slate-50">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${course.gradient} font-medium tracking-wider text-sm uppercase mb-3 block`}>
                            Curriculum
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                            Course Content
                        </h2>
                    </motion.div>

                    <div className="space-y-4">
                        {course.syllabus.map((module: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                            >
                                <button
                                    onClick={() => setExpandedWeek(expandedWeek === i ? null : i)}
                                    className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${course.gradient} flex items-center justify-center text-white font-bold`}>
                                            {String(i + 1).padStart(2, '0')}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-mono text-slate-400">{module.week}</span>
                                                <span className="text-xs text-slate-400">•</span>
                                                <span className="text-xs text-slate-400">{module.duration}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900">{module.title}</h3>
                                        </div>
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedWeek === i ? 'rotate-180' : ''}`} />
                                </button>

                                {expandedWeek === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        className="px-6 pb-6"
                                    >
                                        <div className="pl-16">
                                            <p className="text-slate-600 mb-4">{module.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {module.topics.map((topic: string, t: number) => (
                                                    <span key={t} className="text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                                                        {topic}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who Is This For */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${course.gradient} font-medium tracking-wider text-sm uppercase mb-3 block`}>
                            Target Audience
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                            Who Is This Course For?
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {course.whoIsThisFor.map((audience: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-shadow"
                            >
                                <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-r ${course.gradient} flex items-center justify-center mb-4`}>
                                    <Target className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">{audience.title}</h3>
                                <p className="text-sm text-slate-500">{audience.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={`py-20 px-6 bg-gradient-to-r ${course.gradient}`}>
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Ready to Start Learning?
                        </h2>
                        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                            Join {course.students} students who have already transformed their careers with this course.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="https://learn.aiinst.io" target="_blank" rel="noopener noreferrer">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 bg-white text-slate-900 rounded-full font-semibold shadow-xl hover:bg-slate-50 transition-colors flex items-center gap-2"
                                >
                                    Enroll Now <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </a>
                            <Link href="/contact">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 bg-white/10 text-white rounded-full font-semibold border border-white/30 hover:bg-white/20 transition-colors"
                                >
                                    Talk to Advisor
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
