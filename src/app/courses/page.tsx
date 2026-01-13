"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, ArrowRight, Star, Youtube, Code, Terminal } from "lucide-react";
import Link from "next/link";

const courses = [
    {
        title: "AI-Driven Web Development",
        description: "Learn by doing — build and deploy real websites using AI-assisted development. No prior experience required.",
        level: "Beginner",
        duration: "8 Weeks",
        rating: 4.9,
        category: "Hands-On",
        imageGradient: "from-indigo-500 to-violet-500",
        icon: <Code className="w-6 h-6 text-white" />
    },
    {
        title: "AI Fundamentals for Everyone",
        description: "Master the basics of Artificial Intelligence, from neural networks to ethical considerations. No coding experience required.",
        level: "Beginner",
        duration: "4 Weeks",
        rating: 4.8,
        category: "Foundation",
        imageGradient: "from-blue-500 to-cyan-400",
        icon: <BookOpen className="w-6 h-6 text-white" />
    },
    {
        title: "Deep Learning Specialization",
        description: "Dive deep into the mathematics and architecture of modern neural networks. Build your own models from scratch.",
        level: "Advanced",
        duration: "12 Weeks",
        rating: 4.9,
        category: "Engineering",
        imageGradient: "from-purple-500 to-pink-500",
        icon: <Code className="w-6 h-6 text-white" />
    },
    {
        title: "Generative AI & LLMs",
        description: "Learn to fine-tune Large Language Models and build custom RAG pipelines for enterprise applications.",
        level: "Intermediate",
        duration: "8 Weeks",
        rating: 4.9,
        category: "Applied AI",
        imageGradient: "from-emerald-500 to-teal-400",
        icon: <Terminal className="w-6 h-6 text-white" />
    },
    {
        title: "AI Strategy for Leaders",
        description: "For executives and managers: how to implement AI strategies that drive business value and ROI.",
        level: "Beginner",
        duration: "3 Weeks",
        rating: 4.7,
        category: "Business",
        imageGradient: "from-amber-500 to-orange-400",
        icon: <Youtube className="w-6 h-6 text-white" />
    }
];

export default function CoursesPage() {
    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6 md:px-20">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-secondary font-medium tracking-wider text-sm uppercase mb-3 block">Academy</span>
                        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-4">
                            Master the Future <br /> of <span className="text-primary">Intelligence</span>.
                        </h1>
                        <p className="text-slate-500 max-w-xl text-lg relative z-10">
                            Industry-leading curriculum designed by pioneers in the field. <br />
                            From theory to production-grade deployment.
                        </p>
                    </motion.div>


                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {courses.map((course, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 + 0.3 }}
                            className="group relative bg-white rounded-3xl p-1 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 border border-slate-100"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <div className={`w-32 h-32 rounded-full blur-3xl bg-gradient-to-br ${course.imageGradient}`} />
                            </div>

                            <div className="p-8 h-full flex flex-col">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${course.imageGradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                                        {course.icon}
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                        {course.category}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                                    {course.title}
                                </h3>
                                <p className="text-slate-500 leading-relaxed mb-8 flex-grow">
                                    {course.description}
                                </p>

                                <div className="flex items-center gap-6 text-sm text-slate-400 font-medium border-t border-slate-100 pt-6">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        {course.duration}
                                    </div>

                                    <div className="flex items-center gap-1.5 ml-auto text-amber-500">
                                        <Star className="w-4 h-4 fill-current" />
                                        {course.rating}
                                    </div>
                                </div>

                                <div className="mt-6 pt-2">
                                    <Link href={`/courses/${course.title.toLowerCase().replace(/ /g, "-")}`} className="w-full">
                                        <button className="w-full py-3 rounded-xl bg-slate-50 text-slate-900 font-semibold group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                                            View Syllabus <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}
