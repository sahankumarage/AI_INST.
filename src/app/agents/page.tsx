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
    CircleDot,
    Headphones,
    Search,
    Mail
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const popularAgents = [
    {
        name: "Nova",
        techName: "NLP-CustomerCare-v3",
        role: "Customer Support Agent",
        greeting: "Hi there! 👋 I'll handle all your customer inquiries 24/7. No question is too complex for me!",
        image: "/images/agents/nova.png",
        gradient: "from-violet-500 to-purple-600",
        bgGradient: "from-violet-500/10 to-purple-600/10",
        icon: Headphones,
        stats: { responses: "5K+", satisfaction: "98%" }
    },
    {
        name: "Aria",
        techName: "RAG-Research-v2",
        role: "Research & Analysis Agent",
        greeting: "Hello! 👋 I'll research anything you need. Market trends, competitors, data insights — I've got you covered!",
        image: "/images/agents/aria.png",
        gradient: "from-emerald-500 to-teal-600",
        bgGradient: "from-emerald-500/10 to-teal-600/10",
        icon: Search,
        stats: { reports: "1K+", accuracy: "99.2%" }
    },
    {
        name: "Max",
        techName: "GPT-Outreach-v4",
        role: "Sales & Outreach Agent",
        greeting: "Hey! 👋 I'll manage your email campaigns and follow-ups. Let me turn prospects into customers!",
        image: "/images/agents/max.png",
        gradient: "from-orange-500 to-rose-500",
        bgGradient: "from-orange-500/10 to-rose-600/10",
        icon: Mail,
        stats: { emails: "10K+", conversion: "3.2x" }
    }
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

            {/* Meet Our Popular Agents Section */}
            <section className="py-24 md:py-32 px-6 bg-gradient-to-b from-black via-slate-950 to-black">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Meet Our <span className="text-violet-400">Popular Agents</span>
                        </h2>
                        <p className="text-xl text-slate-400">
                            Ready to work for you, 24/7.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {popularAgents.map((agent, index) => {
                            const IconComponent = agent.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.15 }}
                                    className="group"
                                >
                                    <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${agent.bgGradient} border border-slate-700/50 hover:border-slate-600 transition-all duration-500`}>
                                        {/* Agent Image */}
                                        <div className="relative h-56 overflow-hidden">
                                            <motion.div
                                                animate={{ scale: [1, 1.02, 1] }}
                                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: index * 0.3 }}
                                                className="relative w-full h-full"
                                            >
                                                <Image
                                                    src={agent.image}
                                                    alt={agent.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </motion.div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            {/* Tech Name Badge */}
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${agent.gradient} flex items-center justify-center`}>
                                                    <IconComponent className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="text-xs font-mono text-slate-500 bg-slate-800/80 px-2 py-1 rounded">
                                                    {agent.techName}
                                                </span>
                                            </div>

                                            {/* Name & Role */}
                                            <h3 className="text-2xl font-bold text-white mb-1">
                                                {agent.name}
                                            </h3>
                                            <p className={`text-sm font-medium bg-gradient-to-r ${agent.gradient} bg-clip-text text-transparent mb-4`}>
                                                {agent.role}
                                            </p>

                                            {/* Speech Bubble */}
                                            <div className="relative bg-slate-800/80 rounded-2xl p-4 border border-slate-700/50">
                                                <div className="absolute -top-2 left-6 w-4 h-4 bg-slate-800/80 border-l border-t border-slate-700/50 rotate-45" />
                                                <p className="text-slate-300 text-sm leading-relaxed relative z-10">
                                                    "{agent.greeting}"
                                                </p>
                                            </div>

                                            {/* Stats */}
                                            <div className="flex gap-4 mt-4 pt-4 border-t border-slate-700/50">
                                                {Object.entries(agent.stats).map(([key, value], i) => (
                                                    <div key={i} className="text-center flex-1">
                                                        <div className={`text-lg font-bold bg-gradient-to-r ${agent.gradient} bg-clip-text text-transparent`}>
                                                            {value}
                                                        </div>
                                                        <div className="text-xs text-slate-500 capitalize">
                                                            {key}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
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

            {/* Big Statement - Animated */}
            <section className="py-32 md:py-40 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-900/20 via-purple-900/20 to-pink-900/20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px]" />

                {/* Animated floating particles */}
                <motion.div
                    animate={{ y: [-20, 20, -20], x: [-10, 10, -10], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-violet-400"
                />
                <motion.div
                    animate={{ y: [20, -20, 20], x: [10, -10, 10], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
                    className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-purple-400"
                />
                <motion.div
                    animate={{ y: [-15, 25, -15], x: [-15, 5, -15], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-pink-400"
                />

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                            {/* "Imagine a team that" */}
                            <motion.span
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0 }}
                                className="inline-block"
                            >
                                Imagine a team that{" "}
                            </motion.span>

                            {/* "never sleeps" with glow animation */}
                            <motion.span
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="relative inline-block"
                            >
                                <motion.span
                                    animate={{
                                        textShadow: [
                                            "0 0 20px rgba(139, 92, 246, 0)",
                                            "0 0 40px rgba(139, 92, 246, 0.8)",
                                            "0 0 20px rgba(139, 92, 246, 0)"
                                        ]
                                    }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                    className="text-violet-400"
                                >
                                    never sleeps
                                </motion.span>
                            </motion.span>

                            <motion.span
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: 0.8 }}
                            >
                                ,{" "}
                            </motion.span>

                            {/* "never complains" with glow animation */}
                            <motion.span
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 1.0 }}
                                className="relative inline-block"
                            >
                                <motion.span
                                    animate={{
                                        textShadow: [
                                            "0 0 20px rgba(168, 85, 247, 0)",
                                            "0 0 40px rgba(168, 85, 247, 0.8)",
                                            "0 0 20px rgba(168, 85, 247, 0)"
                                        ]
                                    }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.7 }}
                                    className="text-purple-400"
                                >
                                    never complains
                                </motion.span>
                            </motion.span>

                            <motion.span
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: 1.4 }}
                            >
                                , and{" "}
                            </motion.span>

                            {/* "scales infinitely" with glow animation */}
                            <motion.span
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 1.6 }}
                                className="relative inline-block"
                            >
                                <motion.span
                                    animate={{
                                        textShadow: [
                                            "0 0 20px rgba(236, 72, 153, 0)",
                                            "0 0 40px rgba(236, 72, 153, 0.8)",
                                            "0 0 20px rgba(236, 72, 153, 0)"
                                        ]
                                    }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 1.4 }}
                                    className="text-pink-400"
                                >
                                    scales infinitely
                                </motion.span>
                            </motion.span>

                            <motion.span
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: 2.0 }}
                            >
                                .
                            </motion.span>
                        </h2>
                    </motion.div>

                    {/* Animated underline */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 2.2, ease: "easeOut" }}
                        className="mt-12 h-1 w-48 mx-auto bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-full origin-center"
                    />
                </div>
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
        </main >
    );
}
