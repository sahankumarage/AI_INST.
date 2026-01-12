"use client";

import { motion } from "framer-motion";
import { Brain, LineChart, ShieldCheck, Users } from "lucide-react";

const services = [
    {
        title: "Strategy & Roadmap",
        description: "Defining a clear path for AI adoption aligned with your business goals.",
        icon: <LineChart className="w-6 h-6 text-white" />,
        color: "bg-blue-500",
    },
    {
        title: "Custom Model Development",
        description: "Building proprietary models trained on your specific data.",
        icon: <Brain className="w-6 h-6 text-white" />,
        color: "bg-purple-500",
    },
    {
        title: "AI Audits & Ethics",
        description: "Ensuring your AI systems are safe, unbiased, and compliant.",
        icon: <ShieldCheck className="w-6 h-6 text-white" />,
        color: "bg-emerald-500",
    },
    {
        title: "Team Training",
        description: "Upskilling your workforce to effectively collaborate with AI tools.",
        icon: <Users className="w-6 h-6 text-white" />,
        color: "bg-orange-500",
    },
];

const testimonials = [
    {
        name: "Sarah Chen",
        role: "CTO, FinTech Global",
        content: "The strategic roadmap provided by AI_INST completely transformed our approach to automated trading. We achieved ROI within 3 months.",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        name: "James Wilson",
        role: "Director of Product, HealthPlus",
        content: "Their custom computer vision models helped us detect anomalies with 99.8% accuracy. Truly world-class engineering.",
        gradient: "from-purple-500 to-pink-500",
    },
    {
        name: "Elena Rodriguez",
        role: "VP Operations, LogisticsCorp",
        content: "Implementing their autonomous agents reduced our manual processing time by 70%. The system just works.",
        gradient: "from-orange-500 to-amber-500",
    },
    {
        name: "David Kim",
        role: "Founder, NextGen media",
        content: "We needed a scalable content engine and they delivered. The quality of generation is indistinguishable from human output.",
        gradient: "from-emerald-500 to-teal-500",
    },
];

export default function ConsultingPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-6 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <span className="text-secondary font-medium tracking-wider text-sm uppercase mb-3 block">
                        Consulting Services
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                        Strategic AI Implementation
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        We guide organizations through the complexities of artificial intelligence to unlock new value and efficiency.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-primary/10 transition-all group"
                        >
                            <div
                                className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-6 shadow-lg shadow-current/30`}
                            >
                                {service.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-slate-500 leading-relaxed">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Testimonials Marquee */}
                <div className="mb-20">
                    <div className="text-center mb-16">
                        <span className="text-secondary font-medium tracking-wider text-sm uppercase mb-3 block">
                            Client Stories
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                            Trusted by Industry Leaders
                        </h2>
                    </div>

                    <div className="relative w-full overflow-hidden mask-linear-gradient">
                        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10" />
                        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10" />

                        <div className="flex overflow-hidden">
                            <motion.div
                                className="flex gap-8 py-4 pl-4"
                                animate={{ x: ["0%", "-50%"] }}
                                transition={{
                                    repeat: Infinity,
                                    ease: "linear",
                                    duration: 30
                                }}
                            >
                                {[...testimonials, ...testimonials].map((post, i) => (
                                    <div
                                        key={i}
                                        className="w-[350px] md:w-[450px] flex-shrink-0 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm"
                                    >
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden relative">
                                                {/* Placeholder for actual image */}
                                                <div className={`w-full h-full bg-gradient-to-br ${post.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                                                    {post.name.charAt(0)}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{post.name}</h4>
                                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{post.role}</p>
                                            </div>
                                        </div>
                                        <p className="text-slate-600 leading-relaxed italic">
                                            "{post.content}"
                                        </p>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
