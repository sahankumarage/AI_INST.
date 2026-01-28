"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Clock, ArrowRight, Star, Code, Zap, Search, Filter, X, SlidersHorizontal, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";

const categories = ["All", "Foundation", "Hands-On", "Creative", "Technical"];
const levels = ["All", "Beginner", "Intermediate", "Advanced"];

export default function StudentCatalogPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedLevel, setSelectedLevel] = useState("All");
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch('/api/courses');
                const data = await res.json();
                setCourses(data.courses || []);
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Filter Logic
    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
            const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;

            return matchesSearch && matchesCategory && matchesLevel;
        });
    }, [courses, searchQuery, selectedCategory, selectedLevel]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Course Catalog</h1>
                <p className="text-slate-500">Browse and enroll in new courses to expand your skills.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">

                {/* Filters Sidebar (Desktop) */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="hidden lg:block w-64 flex-shrink-0 space-y-8 p-6 bg-white rounded-2xl border border-slate-200 h-fit"
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
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {filteredCourses.map((course, index) => (
                                <motion.div
                                    key={course.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <div className="group h-full block">
                                        <div className="h-full bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-300 flex flex-col">
                                            {/* Card Header / Thumbnail */}
                                            <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                                                {course.thumbnail ? (
                                                    <img
                                                        src={course.thumbnail}
                                                        alt={course.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className={`w-full h-full bg-gradient-to-br ${course.gradient || 'from-indigo-500 to-purple-500'} flex items-center justify-center`}>
                                                        {course.icon || <BookOpen className="w-16 h-16 text-white/30" />}
                                                    </div>
                                                )}

                                                {/* Overlay Gradient */}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

                                                {/* Level Badge */}
                                                <div className="absolute top-4 right-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md shadow-sm border border-white/20
                                                        ${course.level === 'Beginner' ? 'bg-white/90 text-emerald-700' :
                                                            course.level === 'Advanced' ? 'bg-white/90 text-rose-700' :
                                                                'bg-white/90 text-amber-700'}`}>
                                                        {course.level}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-6 flex-1 flex flex-col">
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
                                                            {course.duration || 'N/A'}
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                            {course.rating || '4.8'}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 mb-4">
                                                        <div className="text-lg font-bold text-slate-900">
                                                            LKR {course.price?.toLocaleString() || '15,000'}
                                                        </div>
                                                    </div>

                                                    <Link
                                                        href={`/portal/student/enroll/${course.slug || course.title.toLowerCase().replace(/ /g, "-")}`}
                                                        className={`w-full py-3 rounded-xl bg-gradient-to-r ${course.gradient || 'from-indigo-600 to-violet-600'} text-white font-bold text-center shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2`}
                                                    >
                                                        Enroll Now <ArrowRight className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
    );
}
