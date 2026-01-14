"use client";

import { motion } from "framer-motion";
import {
    Sparkles,
    Brain,
    Target,
    Users,
    Zap,
    Shield,
    TrendingUp,
    MessageSquare,
    ArrowRight,
    CheckCircle2,
    Star
} from "lucide-react";
import Link from "next/link";

const capabilities = [
    {
        icon: Brain,
        title: "AI Strategy",
        description: "We translate your business vision into a concrete AI roadmap."
    },
    {
        icon: Target,
        title: "Custom Solutions",
        description: "Bespoke AI systems designed specifically for your challenges."
    },
    {
        icon: Shield,
        title: "Ethics & Compliance",
        description: "Ensuring your AI is safe, unbiased, and regulation-ready."
    },
    {
        icon: Users,
        title: "Team Enablement",
        description: "Training your people to thrive in an AI-powered workplace."
    }
];

const differentiators = [
    "We don't just advise — we build alongside you",
    "Transparent pricing, no hidden surprises",
    "Industry-agnostic expertise from fintech to healthcare",
    "Long-term partnership, not one-off projects",
    "Cutting-edge research translated into practical solutions"
];

export default function ConsultingPage() {
    return (
        <main className="min-h-screen bg-white overflow-hidden">

            {/* Hero Section - Full Height */}
            <section className="relative min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }} />
                </div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/20 rounded-full blur-[100px]" />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="max-w-4xl mx-auto text-center relative z-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-blue-300 font-medium text-sm mb-8 border border-white/10">
                        <Sparkles className="w-4 h-4" />
                        Strategic AI Consulting
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-8">
                        We Turn <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">Complexity</span> Into <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Clarity</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Navigating the AI landscape can feel overwhelming. We're here to cut through the noise and deliver real, measurable impact for your business.
                    </p>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
                >
                    <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-1.5 h-1.5 rounded-full bg-white/50"
                        />
                    </div>
                </motion.div>
            </section>

            {/* The Story Section */}
            <section className="py-24 md:py-32 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase mb-4 block">
                            Our Story
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                            We've been where you are.
                        </h2>
                        <div className="prose prose-lg prose-slate max-w-none">
                            <p className="text-xl text-slate-600 leading-relaxed mb-6">
                                We started as builders — engineers and researchers frustrated by the gap between AI's potential and its practical application in real businesses. We saw companies drowning in buzzwords and vendors, with no clear path forward.
                            </p>
                            <p className="text-xl text-slate-600 leading-relaxed mb-6">
                                So we built what we wished existed: a consulting partner that doesn't just hand you a 200-page strategy deck and disappear. We roll up our sleeves. We write code. We sit in your meetings. We care about your outcomes as if they were our own.
                            </p>
                            <p className="text-xl text-slate-600 leading-relaxed">
                                Today, we work with startups finding their AI edge and enterprises transforming legacy systems. Different scales, same philosophy: <strong className="text-slate-900">understand deeply, build thoughtfully, deliver measurably.</strong>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* What We Do Section */}
            <section className="py-24 md:py-32 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase mb-4 block">
                            What We Do
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                            End-to-End Consulting
                        </h2>
                        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                            From strategic planning to hands-on implementation, we cover the entire AI journey.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {capabilities.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                                >
                                    <div className="flex items-start gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            <IconComponent className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-slate-500 text-lg leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Why Different Section */}
            <section className="py-24 md:py-32 px-6 bg-gradient-to-br from-blue-600 to-violet-600 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
                        backgroundSize: '32px 32px'
                    }} />
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-2xl" />

                <div className="max-w-4xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <span className="text-blue-200 font-semibold tracking-wider text-sm uppercase mb-4 block">
                            Why Us
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            What Makes Us Different
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-4"
                    >
                        {differentiators.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-5 border border-white/10"
                            >
                                <div className="w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-white text-lg font-medium">{item}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Stats/Impact Section */}
            <section className="py-24 md:py-32 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center"
                    >
                        <div>
                            <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2">
                                50+
                            </div>
                            <p className="text-slate-500 font-medium">Projects Delivered</p>
                        </div>
                        <div>
                            <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2">
                                95%
                            </div>
                            <p className="text-slate-500 font-medium">Client Retention</p>
                        </div>
                        <div>
                            <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2">
                                3x
                            </div>
                            <p className="text-slate-500 font-medium">Average ROI</p>
                        </div>
                        <div>
                            <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2">
                                12+
                            </div>
                            <p className="text-slate-500 font-medium">Industries Served</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24 md:py-32 px-6 bg-slate-900">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex justify-center gap-1 mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                            ))}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Let's Build Something Extraordinary
                        </h2>
                        <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto">
                            The first step is a conversation. No pressure, no pitch — just an honest discussion about what's possible.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/contact">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-10 py-5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold text-lg shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-3"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                    Contact Us
                                </motion.button>
                            </Link>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-10 py-5 rounded-full bg-white/5 text-white font-semibold text-lg border border-white/20 hover:bg-white/10 transition-all duration-300 flex items-center gap-3"
                            >
                                View Our Work <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
