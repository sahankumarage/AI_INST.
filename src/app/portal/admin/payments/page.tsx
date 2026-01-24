"use client";

import { motion } from "framer-motion";
import {
    DollarSign,
    TrendingUp,
    CreditCard,
    Download,
    Search,
    Calendar,
    ArrowUpRight,
    CheckCircle,
    Clock,
    XCircle
} from "lucide-react";
import { useState } from "react";

interface Payment {
    id: string;
    studentName: string;
    studentEmail: string;
    courseName: string;
    amount: number;
    status: 'completed' | 'pending' | 'failed';
    paymentMethod: string;
    date: string;
    transactionId: string;
}

const mockPayments: Payment[] = [
    { id: "1", studentName: "Alice Johnson", studentEmail: "alice@example.com", courseName: "AI-Driven Web Development", amount: 299, status: "completed", paymentMethod: "Dodo Payments", date: "2024-01-15 14:32", transactionId: "dodo_tx_abc123" },
    { id: "2", studentName: "Bob Smith", studentEmail: "bob@example.com", courseName: "AI Fundamentals", amount: 149, status: "completed", paymentMethod: "Dodo Payments", date: "2024-01-14 09:15", transactionId: "dodo_tx_def456" },
    { id: "3", studentName: "Charlie Brown", studentEmail: "charlie@example.com", courseName: "Content Creation", amount: 199, status: "pending", paymentMethod: "Dodo Payments", date: "2024-01-14 16:45", transactionId: "dodo_tx_ghi789" },
    { id: "4", studentName: "Diana Prince", studentEmail: "diana@example.com", courseName: "AI-Driven Web Development", amount: 299, status: "completed", paymentMethod: "Dodo Payments", date: "2024-01-13 11:20", transactionId: "dodo_tx_jkl012" },
    { id: "5", studentName: "Edward Norton", studentEmail: "edward@example.com", courseName: "AI Fundamentals", amount: 149, status: "failed", paymentMethod: "Dodo Payments", date: "2024-01-12 08:55", transactionId: "dodo_tx_mno345" },
];

const statusConfig = {
    completed: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' }
};

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>(mockPayments);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

    // Calculate stats
    const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
    const completedCount = payments.filter(p => p.status === 'completed').length;

    const filteredPayments = payments.filter(p => {
        const matchesSearch = p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.transactionId.toLowerCase().includes(searchQuery.toLowerCase());

        if (filterStatus === 'all') return matchesSearch;
        return matchesSearch && p.status === filterStatus;
    });

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Payments</h1>
                    <p className="text-slate-500">Track revenue and manage transactions</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 flex items-center gap-2 transition-colors">
                        <Calendar size={18} />
                        <span className="hidden sm:inline">This Month</span>
                    </button>
                    <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 flex items-center gap-2 transition-colors">
                        <Download size={18} />
                        <span className="hidden sm:inline">Export</span>
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl text-white"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <DollarSign size={24} />
                        </div>
                        <span className="flex items-center gap-1 text-emerald-100 text-sm">
                            <ArrowUpRight size={16} />
                            +12%
                        </span>
                    </div>
                    <div className="text-3xl font-bold mb-1">${totalRevenue.toLocaleString()}</div>
                    <div className="text-emerald-100">Total Revenue</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-2xl border border-slate-200"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                            <Clock size={22} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">${pendingAmount.toLocaleString()}</div>
                            <div className="text-sm text-slate-500">Pending Payments</div>
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
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                            <CreditCard size={22} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{completedCount}</div>
                            <div className="text-sm text-slate-500">Successful Transactions</div>
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
                            placeholder="Search by name or transaction ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'completed', 'pending', 'failed'].map((status) => (
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

            {/* Payments Table */}
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
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Course</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredPayments.map((payment) => {
                                const StatusIcon = statusConfig[payment.status].icon;

                                return (
                                    <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-sm font-bold">
                                                    {payment.studentName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{payment.studentName}</div>
                                                    <div className="text-xs text-slate-500">{payment.studentEmail}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-600">{payment.courseName}</td>
                                        <td className="py-4 px-6 font-semibold text-slate-900">${payment.amount}</td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig[payment.status].bg} ${statusConfig[payment.status].color}`}>
                                                <StatusIcon size={12} />
                                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-600">{payment.date}</td>
                                        <td className="py-4 px-6 text-xs text-slate-400 font-mono">{payment.transactionId}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredPayments.length === 0 && (
                    <div className="py-12 text-center text-slate-500">
                        No payments found matching your criteria.
                    </div>
                )}
            </motion.div>
        </div>
    );
}
