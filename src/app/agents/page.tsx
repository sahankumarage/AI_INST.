"use client";

import { motion } from "framer-motion";
import {
    Bot,
    Sparkles,
    Cpu,
    Brain,
    Zap,
    MessageSquare,
    ArrowRight,
    Play,
    CircleDot
} from "lucide-react";
import Link from "next/link";

const agentTypes = [
    { name: "Customer Support", color: "from-emerald-400 to-teal-500" },
    { name: "Data Research", color: "from-blue-400 to-indigo-500" },
    { name: "Content Creation", color: "from-violet-400 to-purple-500" },
    { name: "Sales Outreach", color: "from-orange-400 to-rose-500" },
    { name: "Process Automation", color: "from-cyan-400 to-blue-500" },
    { name: "Custom Solutions", color: "from-pink-400 to-violet-500" },
];

const capabilities = [
    "Understands context and intent",
    "Learns from every interaction",
    "Works 24/7 without breaks",
    "Scales instantly on demand",
    "Integrates with your tools",
    "Handles complex workflows"
];

export default function AgentsPage() {
    return (
        <main className="min-h-screen bg-black text-white overflow-hidden">

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
                {/* Animated Background Grid */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-violet-950/50 via-black to-black" />
                    <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)',
                        backgroundSize: '60px 60px'
                    }} />
                </div>

                {/* Glowing Orbs */}
                <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-violet-600/30 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[120px]" />

                {/* Floating Agent Icon */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 6,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/4 right-[15%] hidden lg:block"
                >
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-violet-500/50">
                        <Bot className="w-12 h-12 text-white" />
                    </div>
                </motion.div>

                <motion.div
                    animate={{
                        y: [0, 15, 0],
                        rotate: [0, -3, 3, 0]
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 5,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute bottom-1/3 left-[10%] hidden lg:block"
                >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/50">
                        <Cpu className="w-8 h-8 text-white" />
                    </div>
                </motion.div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-500/20 backdrop-blur-sm text-violet-300 font-medium text-sm mb-8 border border-violet-500/30">
                            <Sparkles className="w-4 h-4" />
                            Autonomous AI Agents
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8">
                            Your Digital
                            <br />
                            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Workforce
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                            Intelligent agents that think, decide, and act. Deploy autonomous AI workers that handle complex tasks while you focus on what matters most.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/contact">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-300 flex items-center gap-2"
                                >
                                    Get Your Agent <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </Link>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-8 py-4 rounded-full bg-white/5 text-white font-semibold border border-white/20 hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                            >
                                <Play className="w-5 h-5" /> Watch Demo
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* What Are Agents Section */}
            <section className="py-24 md:py-32 px-6 relative">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-8">
                            What is an <span className="text-violet-400">AI Agent</span>?
                        </h2>
                        <p className="text-xl md:text-2xl text-slate-400 leading-relaxed mb-12">
                            Unlike simple chatbots or automation scripts, AI agents are <span className="text-white font-medium">autonomous systems</span> that can understand goals, break them into steps, make decisions, use tools, and learn from outcomes. They don't just respond — they <span className="text-violet-400 font-medium">take action</span>.
                        </p>

                        {/* Visual Comparison */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
                            <div className="bg-slate-900/50 rounded-3xl p-8 border border-slate-800 text-left">
                                <div className="text-red-400 font-semibold mb-4 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-red-400" />
                                    Traditional Automation
                                </div>
                                <ul className="space-y-3 text-slate-500">
                                    <li className="flex items-start gap-3">
                                        <span className="text-slate-600 mt-1">—</span>
                                        Follows rigid, pre-defined rules
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-slate-600 mt-1">—</span>
                                        Breaks when things change
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-slate-600 mt-1">—</span>
                                        Cannot handle edge cases
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-slate-600 mt-1">—</span>
                                        Requires constant maintenance
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 rounded-3xl p-8 border border-violet-500/30 text-left relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl" />
                                <div className="text-violet-400 font-semibold mb-4 flex items-center gap-2 relative z-10">
                                    <span className="w-3 h-3 rounded-full bg-violet-400" />
                                    AI Agents
                                </div>
                                <ul className="space-y-3 text-slate-300 relative z-10">
                                    <li className="flex items-start gap-3">
                                        <span className="text-violet-400 mt-1">✓</span>
                                        Understands intent and context
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-violet-400 mt-1">✓</span>
                                        Adapts to new situations
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-violet-400 mt-1">✓</span>
                                        Handles complex, multi-step tasks
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-violet-400 mt-1">✓</span>
                                        Learns and improves over time
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Agent Types - Horizontal Scroll */}
            <section className="py-24 md:py-32 px-6 bg-gradient-to-b from-black via-slate-950 to-black">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Agents for Every Need
                        </h2>
                        <p className="text-xl text-slate-400">
                            From customer-facing to back-office operations.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-wrap gap-4"
                    >
                        {agentTypes.map((agent, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className={`px-6 py-4 rounded-2xl bg-gradient-to-r ${agent.color} text-white font-semibold text-lg cursor-pointer shadow-lg transition-all duration-300`}
                            >
                                {agent.name}
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Capabilities List */}
            <section className="py-24 md:py-32 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            What They Can Do
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {capabilities.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="flex items-center gap-4 py-4 border-b border-slate-800"
                            >
                                <CircleDot className="w-5 h-5 text-violet-400 flex-shrink-0" />
                                <span className="text-xl text-slate-300">{item}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Big Statement */}
            <section className="py-32 md:py-40 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-900/20 via-purple-900/20 to-pink-900/20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px]" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-5xl mx-auto text-center relative z-10"
                >
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                        Imagine a team that <span className="text-violet-400">never sleeps</span>, <span className="text-purple-400">never complains</span>, and <span className="text-pink-400">scales infinitely</span>.
                    </h2>
                </motion.div>
            </section>

            {/* CTA Section */}
            <section className="py-24 md:py-32 px-6 bg-gradient-to-t from-violet-950/50 to-black">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-violet-500/30">
                            <Brain className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Ready to Deploy Your First Agent?
                        </h2>
                        <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto">
                            Tell us what you need automated, and we'll build an agent that handles it — from concept to deployment.
                        </p>
                        <Link href="/contact">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-10 py-5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold text-lg shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-300 flex items-center gap-3 mx-auto"
                            >
                                <MessageSquare className="w-5 h-5" />
                                Contact Us
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
