"use client";

import { motion } from "framer-motion";
import {
    Search,
    Download,
    Mail,
    Trash2,
    Eye,
    Users,
    DollarSign,
    UserCheck,
    Loader2,
    RefreshCw
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAlert } from "@/components/ui/AlertService";

interface EnrolledCourse {
    courseSlug: string;
    courseName: string;
    paid: boolean;
    amount?: number;
    enrolledAt: string;
    progress: number;
}

interface Student {
    id: string;
    name: string;
    email: string;
    phone?: string;
    enrolledCourses: EnrolledCourse[];
    createdAt: string;
}

interface Stats {
    totalStudents: number;
    paidStudents: number;
    totalRevenue: number;
    totalEnrollments: number;
}

export default function AdminStudentsPage() {
    const alert = useAlert();
    const [students, setStudents] = useState<Student[]>([]);
    const [stats, setStats] = useState<Stats>({ totalStudents: 0, paidStudents: 0, totalRevenue: 0, totalEnrollments: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending'>('all');

    const fetchStudents = async (showNotification = false) => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/students');
            const data = await res.json();
            setStudents(data.students || []);
            setStats(data.stats || { totalStudents: 0, paidStudents: 0, totalRevenue: 0, totalEnrollments: 0 });
            if (showNotification) {
                alert.success("Students Loaded", `Found ${data.students?.length || 0} students`);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            alert.error("Failed to load students", "Please try again");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this student?")) return;

        const loadingId = alert.loading("Deleting Student", "Removing student record...");
        try {
            const res = await fetch(`/api/admin/students?id=${id}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Failed to delete');
            alert.dismissAlert(loadingId);
            alert.success("Student Deleted", "The student has been removed successfully");
            fetchStudents();
        } catch (error) {
            console.error('Delete error:', error);
            alert.dismissAlert(loadingId);
            alert.error("Delete Failed", "Could not delete the student");
        }
    };

    const filteredStudents = students.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email.toLowerCase().includes(searchQuery.toLowerCase());

        if (filterStatus === 'paid') {
            return matchesSearch && s.enrolledCourses.some(c => c.paid);
        } else if (filterStatus === 'pending') {
            return matchesSearch && s.enrolledCourses.some(c => !c.paid);
        }
        return matchesSearch;
    });

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
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Students</h1>
                    <p className="text-slate-500">Manage student enrollments and track progress</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => fetchStudents(true)}
                        className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 flex items-center gap-2 transition-colors"
                    >
                        <RefreshCw size={18} />
                    </button>
                    <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 flex items-center gap-2 transition-colors">
                        <Download size={18} />
                        Export CSV
                    </button>
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
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                            <Users size={22} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{stats.totalStudents}</div>
                            <div className="text-sm text-slate-500">Total Students</div>
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
                            <UserCheck size={22} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{stats.paidStudents}</div>
                            <div className="text-sm text-slate-500">Paid Students</div>
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
                            <DollarSign size={22} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">${stats.totalRevenue.toLocaleString()}</div>
                            <div className="text-sm text-slate-500">Total Revenue</div>
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
                        <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white">
                            <Users size={22} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{stats.totalEnrollments}</div>
                            <div className="text-sm text-slate-500">Enrollments</div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'paid', 'pending'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status as any)}
                                className={`px-4 py-2.5 rounded-xl font-medium text-sm capitalize transition-colors ${filterStatus === status
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Students Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Enrolled Courses</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Paid</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                                <th className="text-right py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredStudents.map((student) => {
                                const totalPaid = student.enrolledCourses.reduce((sum, c) => sum + (c.paid && c.amount ? c.amount : 0), 0);
                                const hasPending = student.enrolledCourses.some(c => !c.paid);

                                return (
                                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{student.name}</div>
                                                    <div className="text-xs text-slate-500">{student.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-1">
                                                {student.enrolledCourses.length === 0 ? (
                                                    <span className="text-sm text-slate-400">No enrollments</span>
                                                ) : (
                                                    <>
                                                        {student.enrolledCourses.slice(0, 2).map((course, i) => (
                                                            <div key={i} className="text-sm">
                                                                <span className="text-slate-600">{course.courseName || course.courseSlug}</span>
                                                                {!course.paid && (
                                                                    <span className="ml-2 text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Unpaid</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {student.enrolledCourses.length > 2 && (
                                                            <div className="text-xs text-slate-400">+{student.enrolledCourses.length - 2} more</div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 font-medium text-slate-900">${totalPaid}</td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${student.enrolledCourses.length === 0
                                                ? 'bg-slate-100 text-slate-600'
                                                : hasPending
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                {student.enrolledCourses.length === 0 ? 'No Courses' : hasPending ? 'Has Pending' : 'All Paid'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-600">
                                            {new Date(student.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <a
                                                    href={`mailto:${student.email}`}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Send Email"
                                                >
                                                    <Mail size={16} />
                                                </a>
                                                <button
                                                    onClick={() => handleDelete(student.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredStudents.length === 0 && (
                    <div className="py-12 text-center text-slate-500">
                        {students.length === 0
                            ? "No students registered yet."
                            : "No students found matching your criteria."
                        }
                    </div>
                )}
            </motion.div>
        </div>
    );
}
