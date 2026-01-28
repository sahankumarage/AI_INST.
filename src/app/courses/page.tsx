"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Clock, ArrowRight, Star, Code, Zap, Search, Filter, X, ChevronDown, SlidersHorizontal, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

// Mock Data
const courses = [
    {
        id: "web-dev",
        title: "AI-Driven Web Development",
        description: "Learn by doing — build and deploy real websites using AI-assisted development. No prior experience required.",
        level: "Beginner",
        duration: "8 Weeks",
        rating: 4.9,
        category: "Hands-On",
        price: "$299",
        gradient: "from-indigo-600 via-violet-600 to-purple-600",
        icon: <Code className="w-6 h-6" />
    },
    {
        id: "ai-fundamentals",
        title: "AI Fundamentals for Everyone",
        description: "Master the basics of Artificial Intelligence, from neural networks to ethical considerations. No coding experience required.",
        level: "Beginner",
        duration: "4 Weeks",
        rating: 4.8,
        category: "Foundation",
        price: "$199",
        gradient: "from-blue-500 via-cyan-500 to-teal-400",
        icon: <BookOpen className="w-6 h-6" />
    },
    {
        id: "content-creation",
        title: "AI-Powered Content Creation",
        description: "Create stunning content with AI tools — from writing compelling copy to generating images and videos for social media, blogs, and marketing.",
        level: "Beginner",
        duration: "4 Weeks",
        rating: 4.8,
        category: "Creative",
        price: "$249",
        gradient: "from-rose-500 via-pink-500 to-orange-400",
        icon: <Sparkles className="w-6 h-6" />
    },
    {
        id: "advanced-ml",
        title: "Advanced Machine Learning",
        description: "Deep dive into ML algorithms, tensor flow, and building your own models from scratch.",
        level: "Advanced",
        duration: "12 Weeks",
        rating: 5.0,
        category: "Technical",
        price: "$499",
        gradient: "from-emerald-500 to-teal-600",
        icon: <Zap className="w-6 h-6" />
    },
];

const categories = ["All", "Foundation", "Hands-On", "Creative", "Technical"];
const levels = ["All", "Beginner", "Intermediate", "Advanced"];

export default function CoursesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedLevel, setSelectedLevel] = useState("All");
    const [showFilters, setShowFilters] = useState(false);

    // Filter Logic
    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
            const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;

            return matchesSearch && matchesCategory && matchesLevel;
        });
    }, [searchQuery, selectedCategory, selectedLevel]);

    return (
        <main className="min-h-screen bg-slate-50 pt-24 pb-20 overflow-hidden">
            {/* Header / Hero Section */}
            <div className="bg-white border-b border-slate-200 pb-12 pt-8 mb-12">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-display">
                            Explore Our <span className="text-indigo-600">Curriculum</span>
                        </h1>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Discover world-class courses designed to take you from beginner to expert.
                            Whether you're looking to start a new career or upskill, we have the perfect path for you.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Filters Sidebar (Desktop) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hidden lg:block w-64 flex-shrink-0 space-y-8"
                    >
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Filter className="w-4 h-4" /> Filters
                            </h3>

                            <div className="space-y-6">
                                {/* Categories */}
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">Category</label>
                                    <div className="space-y-2">
                                        {categories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedCategory(cat)}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat
                                                        ? "bg-indigo-50 text-indigo-700 font-medium"
                                                        : "text-slate-600 hover:bg-slate-100"
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px bg-slate-200" />

                                {/* Levels */}
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">Level</label>
                                    <div className="space-y-2">
                                        {levels.map(level => (
                                            <button
                                                key={level}
                                                onClick={() => setSelectedLevel(level)}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedLevel === level
                                                        ? "bg-indigo-50 text-indigo-700 font-medium"
                                                        : "text-slate-600 hover:bg-slate-100"
                                                    }`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Search & Mobile Filter Toggle */}
                        <div className="flex flex-col md:flex-row gap-4 mb-8">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search for courses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white shadow-sm transition-all"
                                />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="lg:hidden px-4 py-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-slate-600 font-medium shadow-sm active:bg-slate-50"
                            >
                                <SlidersHorizontal className="w-5 h-5" /> Filters
                            </button>
                        </div>

                        {/* Mobile Filters Panel */}
                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="lg:hidden overflow-hidden mb-8"
                                >
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Category</label>
                                            <div className="flex flex-wrap gap-2">
                                                {categories.map(cat => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => setSelectedCategory(cat)}
                                                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedCategory === cat
                                                                ? "bg-indigo-600 text-white"
                                                                : "bg-slate-100 text-slate-600"
                                                            }`}
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Level</label>
                                            <div className="flex flex-wrap gap-2">
                                                {levels.map(level => (
                                                    <button
                                                        key={level}
                                                        onClick={() => setSelectedLevel(level)}
                                                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedLevel === level
                                                                ? "bg-indigo-600 text-white"
                                                                : "bg-slate-100 text-slate-600"
                                                            }`}
                                                    >
                                                        {level}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Results Count */}
                        <div className="mb-6 flex justify-between items-center px-1">
                            <p className="text-slate-500 text-sm font-medium">
                                Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
                            </p>
                            {(selectedCategory !== "All" || selectedLevel !== "All" || searchQuery) && (
                                <button
                                    onClick={() => { setSelectedCategory("All"); setSelectedLevel("All"); setSearchQuery(""); }}
                                    className="text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center gap-1"
                                >
                                    Clear all filters <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>

                        {/* Course Grid */}
                        {filteredCourses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredCourses.map((course, index) => (
                                    <motion.div
                                        key={course.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <Link href={`/courses/${course.title.toLowerCase().replace(/ /g, "-")}`} className="group h-full block">
                                            <div className="h-full bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-300 flex flex-col">
                                                {/* Card Header with Gradient */}
                                                <div className={`h-2 bg-gradient-to-r ${course.gradient}`} />

                                                <div className="p-6 md:p-8 flex-1 flex flex-col">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.gradient} flex items-center justify-center text-white shadow-lg`}>
                                                            {course.icon}
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                                            ${course.level === 'Beginner' ? 'bg-emerald-100 text-emerald-700' :
                                                                course.level === 'Advanced' ? 'bg-rose-100 text-rose-700' :
                                                                    'bg-amber-100 text-amber-700'}`}>
                                                            {course.level}
                                                        </span>
                                                    </div>

                                                    <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                                        {course.title}
                                                    </h2>

                                                    <p className="text-slate-500 text-sm mb-6 line-clamp-3">
                                                        {course.description}
                                                    </p>

                                                    <div className="mt-auto">
                                                        <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6">
                                                            <div className="flex items-center gap-1.5">
                                                                <Clock className="w-4 h-4" />
                                                                {course.duration}
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                                {course.rating}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                                            <div className="text-lg font-bold text-slate-900">
                                                                {course.price}
                                                            </div>
                                                            <span className="text-sm font-semibold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                                View Details <ArrowRight className="w-4 h-4" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed"
                            >
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-6 h-6 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">No courses found</h3>
                                <p className="text-slate-500 max-w-sm mx-auto mb-6">
                                    We couldn't find any courses matching your filters. Try adjusting your search keywords or categories.
                                </p>
                                <button
                                    onClick={() => { setSelectedCategory("All"); setSelectedLevel("All"); setSearchQuery(""); }}
                                    className="text-indigo-600 font-medium hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

