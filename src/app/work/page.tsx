"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

const projects = [
    {
        title: "NeuroFinance Trading Bot",
        category: "Fintech AI",
        description: "An autonomous trading agent achieving 24% APY using reinforcement learning.",
        image: "/images/work/finance.jpg", // Placeholder
        color: "bg-emerald-500",
    },
    {
        title: "MediScan Diagnostic",
        category: "Computer Vision",
        description: "AI-powered radiology assistant for early detection of anomalies in X-rays.",
        image: "/images/work/medical.jpg", // Placeholder
        color: "bg-blue-500",
    },
    {
        title: "LegalMind NLPCore",
        category: "Natural Language Processing",
        description: "Automated contract analysis and risk assessment platform for law firms.",
        image: "/images/work/legal.jpg", // Placeholder
        color: "bg-indigo-500",
    },
    {
        title: "SmartCity Traffic Grid",
        category: "Smart Infrastructure",
        description: "Real-time traffic optimization system reducing congestion by 30%.",
        image: "/images/work/city.jpg", // Placeholder
        color: "bg-amber-500",
    },
];

export default function WorkPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-6 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <span className="text-secondary font-medium tracking-wider text-sm uppercase mb-3 block">
                        Case Studies
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                        Selected Work
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Real-world challenges solved with advanced artificial intelligence.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="group bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100"
                        >
                            <div className={`h-64 ${project.color} relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                                {/* Fallback for missing image - colored div */}
                                <div className="absolute inset-0 flex items-center justify-center text-white/20 text-4xl font-bold">
                                    {project.category}
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                        {project.category}
                                    </span>
                                    <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-slate-500 leading-relaxed">
                                    {project.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}
