"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Lightbulb, Target, Users, Rocket, Award, Globe } from "lucide-react";

const stats = [
    { value: "500+", label: "Students Trained", icon: Users },
    { value: "50+", label: "AI Projects Delivered", icon: Rocket },
    { value: "15+", label: "Enterprise Clients", icon: Award },
    { value: "3+", label: "Countries Served", icon: Globe },
];

export function Introduction() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);

    return (
        <section
            ref={sectionRef}
            className="relative py-32 px-6 md:px-20 overflow-hidden"
        >
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

            <motion.div
                style={{ opacity, y }}
                className="max-w-6xl mx-auto relative z-10"
            >
                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
                    {/* Left Side - Text Content */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm mb-6">
                                <Lightbulb className="w-4 h-4" />
                                About AI_INST.
                            </span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight"
                        >
                            Where Innovation Meets{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                                Intelligence
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-slate-600 mb-6 leading-relaxed"
                        >
                            AI_INST. is a pioneering technology company dedicated to democratizing artificial intelligence. We believe that AI should be accessible, practical, and transformative for everyone—from ambitious learners to enterprise organizations.
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="text-lg text-slate-600 mb-8 leading-relaxed"
                        >
                            Through our comprehensive ecosystem of education, consulting, products, and AI agents, we empower individuals and businesses to harness the full potential of artificial intelligence and stay ahead in the rapidly evolving digital landscape.
                        </motion.p>

                        {/* Mission & Vision Pills */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-wrap gap-4"
                        >
                            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white shadow-lg shadow-slate-200/50 border border-slate-100">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                    <Target className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mission</p>
                                    <p className="text-sm font-semibold text-slate-900">Democratize AI Education</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white shadow-lg shadow-slate-200/50 border border-slate-100">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                                    <Lightbulb className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vision</p>
                                    <p className="text-sm font-semibold text-slate-900">AI-Powered Future for All</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side - Visual Element */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="relative"
                    >
                        {/* Decorative Card Stack */}
                        <div className="relative">
                            {/* Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 blur-3xl rounded-3xl" />

                            {/* Main Card */}
                            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl">
                                {/* Pattern Overlay */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute top-4 right-4 w-32 h-32 border border-white rounded-full" />
                                    <div className="absolute bottom-4 left-4 w-24 h-24 border border-white rounded-full" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white rounded-full" />
                                </div>

                                {/* Content */}
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
                                            <span className="text-2xl font-bold text-white font-mono">AI</span>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">AI_INST.</h3>
                                            <p className="text-slate-400 text-sm">Future of Intelligence</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        {["Education & Training", "AI Consulting", "Software Products", "Intelligent Agents"].map((item, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.3 + i * 0.1 }}
                                                className="flex items-center gap-3"
                                            >
                                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary" />
                                                <span className="text-white font-medium">{item}</span>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="pt-6 border-t border-slate-700">
                                        <p className="text-slate-400 text-sm italic">
                                            "Bridging today's reality with tomorrow's possibilities through AI innovation."
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center"
                            >
                                <Rocket className="w-10 h-10 text-white" />
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-xl shadow-xl shadow-secondary/30 flex items-center justify-center"
                            >
                                <Award className="w-8 h-8 text-white" />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-shadow text-center">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-secondary transition-colors">
                                    <stat.icon className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                                </div>
                                <p className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">{stat.value}</p>
                                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}
