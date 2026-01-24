"use client";

import { motion } from "framer-motion";
import {
    Users,
    DollarSign,
    BookOpen,
    TrendingUp,
    MoreVertical,
    Plus,
    Download,
    Search,
    ArrowUpRight,
    Loader2,
    RefreshCw,
    Database
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Student {
    id: string;
    name: string;
    email: string;
    enrolledCourses: any[];
    createdAt: string;
}

interface Stats {
    totalStudents: number;
    paidStudents: number;
    totalRevenue: number;
    totalEnrollments: number;
}

interface CourseStats {
    totalCourses: number;
    publishedCourses: number;
    totalEnrolled: number;
}

export default function AdminDashboard() {
    const [students, setStudents] = useState<Student[]>([]);
    const [stats, setStats] = useState<Stats>({ totalStudents: 0, paidStudents: 0, totalRevenue: 0, totalEnrollments: 0 });
    const [courseStats, setCourseStats] = useState<CourseStats>({ totalCourses: 0, publishedCourses: 0, totalEnrolled: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch students
            const studentsRes = await fetch('/api/admin/students');
            const studentsData = await studentsRes.json();
            setStudents(studentsData.students || []);
            setStats(studentsData.stats || { totalStudents: 0, paidStudents: 0, totalRevenue: 0, totalEnrollments: 0 });

            // Fetch courses
            const coursesRes = await fetch('/api/admin/courses');
            const coursesData = await coursesRes.json();
            setCourseStats(coursesData.stats || { totalCourses: 0, publishedCourses: 0, totalEnrolled: 0 });
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5); // Show only last 5

    const dashboardStats = [
        {
            label: "Total Students",
            value: stats.totalStudents.toString(),
            change: "+12%",
            trend: "up",
            icon: Users,
            color: "bg-blue-500",
        },
        {
            label: "Total Revenue",
            value: `$${stats.totalRevenue.toLocaleString()}`,
            change: "+8%",
            trend: "up",
            icon: DollarSign,
            color: "bg-emerald-500",
        },
        {
            label: "Active Courses",
            value: courseStats.publishedCourses.toString(),
            change: `${courseStats.totalCourses} total`,
            trend: "up",
            icon: BookOpen,
            color: "bg-purple-500",
        },
        {
            label: "Enrollments",
            value: stats.totalEnrollments.toString(),
            change: "+5%",
            trend: "up",
            icon: TrendingUp,
            color: "bg-amber-500",
        },
    ];

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
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
                    <p className="text-slate-500">Overview of your institute's performance</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchData}
                        className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 flex items-center gap-2 transition-colors"
                    >
                        <RefreshCw size={18} />
                    </button>
                    <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 flex items-center gap-2 transition-colors">
                        <Download size={18} />
                        <span className="hidden sm:inline">Export</span>
                    </button>
                    <Link href="/portal/admin/courses">
                        <button className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/25">
                            <Plus size={18} />
                            <span className="hidden sm:inline">New Course</span>
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {dashboardStats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                                <stat.icon size={22} />
                            </div>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700`}>
                                <ArrowUpRight size={12} />
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                        <p className="text-sm text-slate-500">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Link href="/portal/admin/courses">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white cursor-pointer"
                    >
                        <BookOpen className="w-8 h-8 mb-4" />
                        <h3 className="font-bold text-lg mb-1">Manage Courses</h3>
                        <p className="text-white/80 text-sm">Create, edit, and organize course content</p>
                    </motion.div>
                </Link>

                <Link href="/portal/admin/students">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl text-white cursor-pointer"
                    >
                        <Users className="w-8 h-8 mb-4" />
                        <h3 className="font-bold text-lg mb-1">View Students</h3>
                        <p className="text-white/80 text-sm">Monitor enrollments and progress</p>
                    </motion.div>
                </Link>

                <Link href="/portal/admin/payments">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-2xl text-white cursor-pointer"
                    >
                        <DollarSign className="w-8 h-8 mb-4" />
                        <h3 className="font-bold text-lg mb-1">Payments</h3>
                        <p className="text-white/80 text-sm">Track revenue and transactions</p>
                    </motion.div>
                </Link>
            </div>

            {/* Recent Students Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
                <div className="p-6 border-b border-slate-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-lg font-bold text-slate-900">Recent Students</h2>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search students..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 w-full md:w-64"
                                />
                            </div>
                            <Link href="/portal/admin/students">
                                <button className="px-4 py-2 text-indigo-600 font-medium text-sm hover:bg-indigo-50 rounded-lg transition-colors whitespace-nowrap">
                                    View All
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {students.length === 0 ? (
                    <div className="p-12 text-center">
                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No Students Yet</h3>
                        <p className="text-slate-500">Students will appear here after they register.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Courses</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="text-right py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStudents.map((student) => {
                                    const hasPaid = student.enrolledCourses?.some(c => c.paid);
                                    return (
                                        <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-sm font-bold">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-900">{student.name}</div>
                                                        <div className="text-xs text-slate-500">{student.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-slate-600">
                                                {student.enrolledCourses?.length || 0} enrolled
                                            </td>
                                            <td className="py-4 px-6 text-sm text-slate-600">
                                                {new Date(student.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${hasPaid
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    {hasPaid ? 'Paid' : 'Free'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
