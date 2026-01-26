"use client";

import { motion } from "framer-motion";
import {
    Search,
    RefreshCw,
    Users,
    BookOpen,
    GraduationCap,
    Clock,
    BarChart3,
    Eye,
    UserPlus,
    CheckCircle,
    XCircle,
    Loader2,
    ChevronDown,
    ChevronUp,
    Mail,
    TrendingUp,
    Calendar,
    Play,
    Award,
    Edit2,
    Settings
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAlert } from "@/components/ui/AlertService";
import { useConfirmModal } from "@/components/ui/ConfirmModal";

interface StudentEnrollment {
    id: string;
    name: string;
    email: string;
    enrolledAt: string;
    progress: number;
    completedLessons: string[];
    totalLessons: number;
    paid: boolean;
    amount?: number;
    lastActive?: string;
}

interface CourseClassroom {
    courseSlug: string;
    courseName: string;
    totalStudents: number;
    activeStudents: number;
    averageProgress: number;
    students: StudentEnrollment[];
}

interface ClassroomStats {
    totalEnrollments: number;
    activeStudents: number;
    completedCourses: number;
    averageProgress: number;
}

interface CourseInfo {
    _id: string;
    slug: string;
    title: string;
    level: string;
    isPublished: boolean;
    enrolledCount: number;
}

export default function AdminClassroomPage() {
    const alert = useAlert();
    const { showConfirm, ConfirmModal } = useConfirmModal();
    const [classrooms, setClassrooms] = useState<CourseClassroom[]>([]);
    const [allCourses, setAllCourses] = useState<CourseInfo[]>([]);
    const [stats, setStats] = useState<ClassroomStats>({
        totalEnrollments: 0,
        activeStudents: 0,
        completedCourses: 0,
        averageProgress: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<string>("all");
    const [progressFilter, setProgressFilter] = useState<string>("all");
    const [viewMode, setViewMode] = useState<'enrollments' | 'courses'>('courses');

    const fetchClassrooms = async (showNotification = false) => {
        setIsLoading(true);
        try {
            // Fetch enrollments/classrooms
            const classroomRes = await fetch('/api/admin/classroom');
            const classroomData = await classroomRes.json();
            setClassrooms(classroomData.classrooms || []);
            setStats(classroomData.stats || {
                totalEnrollments: 0,
                activeStudents: 0,
                completedCourses: 0,
                averageProgress: 0
            });

            // Fetch all courses
            const coursesRes = await fetch('/api/courses?includeDrafts=true');
            const coursesData = await coursesRes.json();
            setAllCourses(coursesData.courses || []);

            if (showNotification) {
                alert.success("Data Refreshed", `Loaded ${classroomData.classrooms?.length || 0} classrooms`);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert.error("Failed to load data", "Please try again");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClassrooms();
    }, []);

    const handleUpdateProgress = async (studentId: string, courseSlug: string, newProgress: number) => {
        try {
            const res = await fetch('/api/admin/classroom', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId,
                    courseSlug,
                    progress: newProgress
                })
            });
            if (res.ok) {
                alert.success("Progress Updated", newProgress >= 100 ? "Student marked as completed!" : `Progress updated to ${newProgress}%`);
                fetchClassrooms();
            } else {
                alert.error("Update Failed", "Could not update progress");
            }
        } catch (error) {
            console.error('Error updating progress:', error);
            alert.error("Update Failed", "An error occurred");
        }
    };

    const handleRemoveEnrollment = (studentId: string, courseSlug: string, studentName: string) => {
        showConfirm({
            title: "Remove Student from Course",
            message: `Are you sure you want to remove "${studentName}" from this course? Their progress data will be preserved for record keeping.`,
            type: "delete",
            confirmLabel: "Remove Student",
            onConfirm: async () => {
                const loadingId = alert.loading("Removing Student", "Removing enrollment...");
                try {
                    const res = await fetch('/api/admin/classroom', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ studentId, courseSlug })
                    });
                    alert.dismissAlert(loadingId);
                    if (res.ok) {
                        alert.success("Student Removed", "Enrollment has been removed");
                        fetchClassrooms();
                    } else {
                        alert.error("Remove Failed", "Could not remove student");
                    }
                } catch (error) {
                    console.error('Error removing enrollment:', error);
                    alert.dismissAlert(loadingId);
                    alert.error("Remove Failed", "An error occurred");
                }
            }
        });
    };

    const toggleCourseExpand = (slug: string) => {
        setExpandedCourse(expandedCourse === slug ? null : slug);
    };

    // Filter classrooms
    const filteredClassrooms = classrooms.filter(classroom => {
        if (selectedCourse !== "all" && classroom.courseSlug !== selectedCourse) {
            return false;
        }
        if (searchQuery) {
            const matchesCourse = classroom.courseName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStudent = classroom.students.some(
                s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
            return matchesCourse || matchesStudent;
        }
        return true;
    });

    // Filter students by progress
    const getFilteredStudents = (students: StudentEnrollment[]) => {
        let filtered = students;

        if (searchQuery) {
            filtered = filtered.filter(s =>
                s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        switch (progressFilter) {
            case "notstarted":
                return filtered.filter(s => s.progress === 0);
            case "inprogress":
                return filtered.filter(s => s.progress > 0 && s.progress < 100);
            case "completed":
                return filtered.filter(s => s.progress >= 100);
            default:
                return filtered;
        }
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 100) return "bg-emerald-500";
        if (progress >= 50) return "bg-blue-500";
        if (progress >= 25) return "bg-amber-500";
        return "bg-slate-300";
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Classroom Management</h1>
                    <p className="text-slate-500">Monitor student progress and manage course enrollments</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => fetchClassrooms(true)}
                        className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 flex items-center gap-2 transition-colors"
                    >
                        <RefreshCw size={18} />
                    </button>
                    <Link
                        href="/portal/admin/students"
                        className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 flex items-center gap-2 transition-colors"
                    >
                        <Users size={18} />
                        View All Students
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-2xl border border-slate-200"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
                            <GraduationCap size={22} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{stats.totalEnrollments}</div>
                            <div className="text-sm text-slate-500">Total Enrollments</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-2xl border border-slate-200"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                            <Play size={22} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{stats.activeStudents}</div>
                            <div className="text-sm text-slate-500">Active Learners</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-6 rounded-2xl border border-slate-200"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white">
                            <Award size={22} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{stats.completedCourses}</div>
                            <div className="text-sm text-slate-500">Course Completions</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white p-6 rounded-2xl border border-slate-200"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                            <TrendingUp size={22} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{stats.averageProgress}%</div>
                            <div className="text-sm text-slate-500">Avg. Progress</div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setViewMode('courses')}
                    className={`px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors ${viewMode === 'courses'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                >
                    <BookOpen size={18} />
                    All Courses
                </button>
                <button
                    onClick={() => setViewMode('enrollments')}
                    className={`px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors ${viewMode === 'enrollments'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                >
                    <Users size={18} />
                    Student Enrollments
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder={viewMode === 'courses' ? "Search courses..." : "Search by course or student name..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        />
                    </div>
                    {viewMode === 'enrollments' && (
                        <>
                            <select
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-white"
                            >
                                <option value="all">All Courses</option>
                                {classrooms.map(c => (
                                    <option key={c.courseSlug} value={c.courseSlug}>{c.courseName}</option>
                                ))}
                            </select>
                            <div className="flex gap-2">
                                {[
                                    { value: 'all', label: 'All' },
                                    { value: 'notstarted', label: 'Not Started' },
                                    { value: 'inprogress', label: 'In Progress' },
                                    { value: 'completed', label: 'Completed' }
                                ].map((filter) => (
                                    <button
                                        key={filter.value}
                                        onClick={() => setProgressFilter(filter.value)}
                                        className={`px-3 py-2 rounded-xl font-medium text-sm transition-colors ${progressFilter === filter.value
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* All Courses Grid View */}
            {viewMode === 'courses' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allCourses.filter(c =>
                        c.title.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length === 0 ? (
                        <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center">
                            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 mb-2">No Courses Found</h3>
                            <p className="text-slate-500 mb-4">
                                {allCourses.length === 0
                                    ? "No courses have been created yet."
                                    : "No courses match your search."}
                            </p>
                            <Link
                                href="/portal/admin/courses"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
                            >
                                Create Course
                            </Link>
                        </div>
                    ) : (
                        allCourses.filter(c =>
                            c.title.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((course, idx) => {
                            const classroom = classrooms.find(cl => cl.courseSlug === course.slug);
                            return (
                                <motion.div
                                    key={course._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                            <BookOpen size={22} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-900 text-lg truncate">{course.title}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${course.isPublished
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {course.isPublished ? 'Published' : 'Draft'}
                                                </span>
                                                <span className="text-xs text-slate-500">{course.level}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Users size={14} />
                                            {classroom?.totalStudents || 0} students
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <TrendingUp size={14} />
                                            {classroom?.averageProgress || 0}% avg
                                        </span>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                                        <Link
                                            href={`/portal/admin/classroom/${course.slug}`}
                                            className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Settings size={16} />
                                            Manage Content
                                        </Link>
                                        <Link
                                            href={`/courses/${course.slug}`}
                                            target="_blank"
                                            className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Eye size={16} />
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            )}

            {/* Student Enrollments View */}
            {viewMode === 'enrollments' && (
                <div className="space-y-4">
                    {filteredClassrooms.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 mb-2">No Classrooms Found</h3>
                            <p className="text-slate-500">
                                {classrooms.length === 0
                                    ? "No students have enrolled in courses yet."
                                    : "No classrooms match your search criteria."}
                            </p>
                        </div>
                    ) : (
                        filteredClassrooms.map((classroom, idx) => {
                            const filteredStudents = getFilteredStudents(classroom.students);
                            const isExpanded = expandedCourse === classroom.courseSlug;

                            return (
                                <motion.div
                                    key={classroom.courseSlug}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                                >
                                    {/* Course Header */}
                                    <div
                                        className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
                                        onClick={() => toggleCourseExpand(classroom.courseSlug)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                                                    <BookOpen size={22} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-lg">{classroom.courseName}</h3>
                                                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                                                        <span className="flex items-center gap-1">
                                                            <Users size={14} /> {classroom.totalStudents} students
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <TrendingUp size={14} /> {classroom.averageProgress}% avg progress
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Play size={14} /> {classroom.activeStudents} active
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {/* Progress Bar */}
                                                <div className="hidden md:block w-48">
                                                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                                                        <span>Class Progress</span>
                                                        <span>{classroom.averageProgress}%</span>
                                                    </div>
                                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${getProgressColor(classroom.averageProgress)} rounded-full transition-all`}
                                                            style={{ width: `${classroom.averageProgress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <Link
                                                    href={`/portal/admin/classroom/${classroom.courseSlug}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 flex items-center gap-2 transition-colors"
                                                >
                                                    <Settings size={14} />
                                                    Manage Content
                                                </Link>
                                                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Student List */}
                                    {isExpanded && (
                                        <div className="border-t border-slate-100">
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead className="bg-slate-50">
                                                        <tr>
                                                            <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Student</th>
                                                            <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Enrolled</th>
                                                            <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Progress</th>
                                                            <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Lessons</th>
                                                            <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                                            <th className="text-right py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {filteredStudents.length === 0 ? (
                                                            <tr>
                                                                <td colSpan={6} className="py-8 text-center text-slate-500">
                                                                    No students match your filters.
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            filteredStudents.map((student) => (
                                                                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                                                    <td className="py-4 px-6">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                                                                                {student.name.charAt(0)}
                                                                            </div>
                                                                            <div>
                                                                                <div className="font-medium text-slate-900 text-sm">{student.name}</div>
                                                                                <div className="text-xs text-slate-500">{student.email}</div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-4 px-6 text-sm text-slate-600">
                                                                        {new Date(student.enrolledAt).toLocaleDateString('en-US', {
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            year: 'numeric'
                                                                        })}
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                                                <div
                                                                                    className={`h-full ${getProgressColor(student.progress)} rounded-full`}
                                                                                    style={{ width: `${student.progress}%` }}
                                                                                />
                                                                            </div>
                                                                            <span className="text-sm font-medium text-slate-700">{student.progress}%</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-4 px-6 text-sm text-slate-600">
                                                                        {student.completedLessons?.length || 0} / {student.totalLessons || '?'}
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        {student.progress >= 100 ? (
                                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                                                                                <CheckCircle size={12} /> Completed
                                                                            </span>
                                                                        ) : student.progress > 0 ? (
                                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                                                                <Play size={12} /> In Progress
                                                                            </span>
                                                                        ) : (
                                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
                                                                                <Clock size={12} /> Not Started
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <div className="flex items-center justify-end gap-1">
                                                                            <a
                                                                                href={`mailto:${student.email}`}
                                                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                                title="Send Email"
                                                                            >
                                                                                <Mail size={16} />
                                                                            </a>
                                                                            {student.progress < 100 && (
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handleUpdateProgress(student.id, classroom.courseSlug, 100);
                                                                                    }}
                                                                                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                                                    title="Mark as Complete"
                                                                                >
                                                                                    <CheckCircle size={16} />
                                                                                </button>
                                                                            )}
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleRemoveEnrollment(student.id, classroom.courseSlug, student.name);
                                                                                }}
                                                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                                title="Remove from Course"
                                                                            >
                                                                                <XCircle size={16} />
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })
                    )}
                </div>
            )}

            {/* Confirm Modal */}
            <ConfirmModal />
        </div>
    );
}
