"use client";

import { motion } from "framer-motion";
import { Users, DollarSign, BookOpen, MoreVertical, Plus, Download, Search, Filter } from "lucide-react";

// Mock Data
const stats = [
    { label: "Total Students", value: "1,234", change: "+12%", icon: Users, color: "bg-blue-500" },
    { label: "Total Revenue", value: "$45,200", change: "+8%", icon: DollarSign, color: "bg-emerald-500" },
    { label: "Active Courses", value: "8", change: "+2", icon: BookOpen, color: "bg-purple-500" },
];

const recentStudents = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", course: "AI-Driven Web Dev", date: "Jan 12, 2024", status: "Paid", amount: "$299" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", course: "AI Fundamentals", date: "Jan 11, 2024", status: "Paid", amount: "$149" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", course: "Generative AI", date: "Jan 10, 2024", status: "Pending", amount: "$399" },
    { id: 4, name: "Diana Prince", email: "diana@example.com", course: "AI-Driven Web Dev", date: "Jan 09, 2024", status: "Paid", amount: "$299" },
];

export default function AdminDashboard() {
    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
                    <p className="text-slate-500">Overview of your institute's performance.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 flex items-center gap-2">
                        <Download size={18} /> Export
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2">
                        <Plus size={18} /> New Course
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-white shadow-lg shadow-purple-500/10`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">{stat.change}</span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                        <p className="text-sm text-slate-500">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Content Management Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900">Course Materials Management</h2>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4 text-indigo-600">
                        <Plus size={32} />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Upload Course Materials</h3>
                    <p className="text-slate-500 max-w-sm mb-6">Upload videos, PDFs, and resources for your students. Supports drag and drop.</p>
                    <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors">
                        Select Files
                    </button>
                </div>
            </div>

            {/* Recent Students Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-lg font-bold text-slate-900">Recent Enrollments</h2>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search students..."
                                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Course</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="text-right py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">{student.name}</div>
                                                <div className="text-xs text-slate-500">{student.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-slate-600">{student.course}</td>
                                    <td className="py-4 px-6 text-sm text-slate-600">{student.date}</td>
                                    <td className="py-4 px-6 font-medium text-slate-900">{student.amount}</td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status === 'Paid'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-amber-100 text-amber-800'
                                            }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button className="text-slate-400 hover:text-slate-600">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
