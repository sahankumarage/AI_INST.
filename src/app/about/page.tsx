"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-6 bg-slate-50">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100"
                >
                    <div className="inline-block px-4 py-1.5 mb-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        About The Institute
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                        We are architects of the <span className="text-gradient">Intelligent Future</span>.
                    </h1>

                    <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                        <p>
                            The AI-Institute was founded on a simple premise: Artificial Intelligence is not just a tool, but a fundamental shift in how humanity creates, solves, and evolves.
                        </p>
                        <p>
                            Our team consists of researchers, engineers, and creatives who are dedicated to demystifying AI and making it accessible, ethical, and powerfully effective for businesses worldwide.
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-100 pt-12">
                        {[
                            { label: "Projects", value: "150+" },
                            { label: "Clients", value: "80+" },
                            { label: "Awards", value: "12" },
                            { label: "Years", value: "5+" },
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                                <div className="text-sm text-slate-400 font-medium uppercase tracking-wide">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
