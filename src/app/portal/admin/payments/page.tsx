"use client";

import { motion, AnimatePresence } from "framer-motion";
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
    XCircle,
    Eye,
    X,
    Check,
    Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useAlert } from "@/components/ui/AlertService";

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
    receiptImage?: string;
}

const statusConfig = {
    completed: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' }
};

export default function AdminPaymentsPage() {
    const alertService = useAlert();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'failed' | 'bank' | 'card'>('all');

    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await fetch('/api/admin/payments');
            const data = await res.json();
            if (data.payments) {
                setPayments(data.payments);
            }
        } catch (error) {
            console.error("Failed to fetch payments", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (action: 'approve' | 'reject') => {
        if (!selectedPayment) return;

        setIsActionLoading(true);
        try {
            const res = await fetch('/api/admin/payments', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentId: selectedPayment.id,
                    action
                })
            });

            if (!res.ok) throw new Error("Action failed");

            alertService.success(
                action === 'approve' ? "Payment Approved" : "Payment Rejected",
                `The payment has been marked as ${action === 'approve' ? 'completed' : 'failed'}.`
            );

            // Update local state
            setPayments(prev => prev.map(p =>
                p.id === selectedPayment.id
                    ? { ...p, status: action === 'approve' ? 'completed' : 'failed' }
                    : p
            ));

            setSelectedPayment(null);

        } catch (error) {
            alertService.error("Error", "Failed to update payment status");
        } finally {
            setIsActionLoading(false);
        }
    };

    // Calculate stats
    const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
    const completedCount = payments.filter(p => p.status === 'completed').length;

    const filteredPayments = payments.filter(p => {
        const matchesSearch = p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.transactionId.toLowerCase().includes(searchQuery.toLowerCase());

        if (filterStatus === 'all') return matchesSearch;

        if (filterStatus === 'bank') {
            return matchesSearch && p.paymentMethod === 'Bank Transfer';
        }

        if (filterStatus === 'card') {
            return matchesSearch && p.paymentMethod !== 'Bank Transfer';
        }

        return matchesSearch && p.status === filterStatus;
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Payments</h1>
                    <p className="text-slate-500">Track revenue and manage transactions</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchPayments} className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 flex items-center gap-2 transition-colors">
                        <TrendingUp size={18} />
                        <span className="hidden sm:inline">Refresh</span>
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
                    <div className="text-3xl font-bold mb-1">LKR {totalRevenue.toLocaleString()}</div>
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
                            <div className="text-2xl font-bold text-slate-900">LKR {pendingAmount.toLocaleString()}</div>
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
                        {['all', 'completed', 'pending', 'failed', 'bank', 'card'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status as any)}
                                className={`px-4 py-2.5 rounded-xl font-medium text-sm capitalize transition-colors ${filterStatus === status
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {status === 'bank' ? 'Bank Transfer' : status === 'card' ? 'Card' : status}
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
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Method</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Receipt</th>
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
                                        <td className="py-4 px-6 text-sm text-slate-600 max-w-[200px] truncate" title={payment.courseName}>{payment.courseName}</td>
                                        <td className="py-4 px-6 font-semibold text-slate-900">LKR {payment.amount.toLocaleString()}</td>
                                        <td className="py-4 px-6 text-sm text-slate-600 capitalize">
                                            {payment.paymentMethod === 'Bank Transfer' ? (
                                                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                                                    Bank Transfer
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200">
                                                    Card
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig[payment.status].bg} ${statusConfig[payment.status].color}`}>
                                                <StatusIcon size={12} />
                                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-600">{payment.date}</td>
                                        <td className="py-4 px-6">
                                            {payment.receiptImage && (
                                                <button
                                                    onClick={() => setSelectedPayment(payment)}
                                                    className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-lg transition-colors"
                                                >
                                                    <Eye size={14} /> View
                                                </button>
                                            )}
                                            {!payment.receiptImage && payment.paymentMethod !== 'Bank Transfer' && (
                                                <span className="text-xs text-slate-400">Automated</span>
                                            )}
                                        </td>
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

            {/* Receipt Modal */}
            <AnimatePresence>
                {selectedPayment && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        onClick={() => setSelectedPayment(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                <h3 className="font-bold text-slate-900">Payment Receipt</h3>
                                <button onClick={() => setSelectedPayment(null)} className="p-1 rounded-full hover:bg-slate-200">
                                    <X size={20} className="text-slate-500" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto">
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-slate-500">Amount</span>
                                        <span className="text-lg font-bold text-slate-900">LKR {selectedPayment.amount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-slate-500">Transaction ID</span>
                                        <span className="text-sm font-mono text-slate-700">{selectedPayment.transactionId}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm text-slate-500">Status</span>
                                        <span className={`text-sm font-semibold capitalize ${statusConfig[selectedPayment.status].color}`}>
                                            {selectedPayment.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 min-h-[200px] flex items-center justify-center relative">
                                    {selectedPayment.receiptImage ? (
                                        <img src={selectedPayment.receiptImage} alt="Receipt" className="max-w-full h-auto object-contain" />
                                    ) : (
                                        <span className="text-slate-400 text-sm">No image available</span>
                                    )}
                                </div>
                            </div>

                            {selectedPayment.status === 'pending' && (
                                <div className="p-4 border-t border-slate-100 flex gap-3">
                                    <button
                                        onClick={() => handleAction('reject')}
                                        disabled={isActionLoading}
                                        className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleAction('approve')}
                                        disabled={isActionLoading}
                                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isActionLoading && <Loader2 size={16} className="animate-spin" />}
                                        Approve Payment
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
