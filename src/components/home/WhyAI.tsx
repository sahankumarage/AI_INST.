"use client";

import { motion } from "framer-motion";
import { Zap, Brain, Globe, Rocket, Shield, Cpu } from "lucide-react";

const features = [
    {
        icon: <Zap className="w-6 h-6 text-yellow-400" />,
        title: "Exponential Efficiency",
        desc: "Automating complex workflows to unlock unprecedented speed and productivity.",
        gradient: "from-yellow-400/20 to-orange-500/20",
        border: "group-hover:border-yellow-400/50"
    },
    {
        icon: <Brain className="w-6 h-6 text-purple-400" />,
        title: "Cognitive Intelligence",
        desc: "Advanced algorithms that learn, adapt, and make human-like decisions instantly.",
        gradient: "from-purple-400/20 to-indigo-500/20",
        border: "group-hover:border-purple-400/50"
    },
    {
        icon: <Globe className="w-6 h-6 text-cyan-400" />,
        title: "Global Connectivity",
        desc: "Breaking language barriers to connect the world through seamless communication.",
        gradient: "from-cyan-400/20 to-blue-500/20",
        border: "group-hover:border-cyan-400/50"
    },

];

export function WhyAI() {
    return (
        <section className="relative py-24 px-6 md:px-20 bg-slate-50 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-3xl opacity-50" />
                <div className="absolute -bottom-1/2 -left-1/2 w-[1000px] h-[1000px] bg-secondary/5 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 mb-4 rounded-full bg-slate-200/50 border border-slate-300/50 backdrop-blur-sm"
                    >
                        <span className="text-sm font-semibold text-slate-600 tracking-wide uppercase">Why AI Now?</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-slate-900 mb-6"
                    >
                        Not Just a Trend, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">It's the Evolution.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-600 max-w-2xl mx-auto"
                    >
                        Artificial Intelligence is reshaping industries. Those who adapt now will lead the future. Here's why integrating AI is crucial today.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 + 0.3 }}
                            whileHover={{ y: -5 }}
                            className="group relative p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${feature.gradient}`} />

                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                    {feature.icon}
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                                    {feature.title}
                                </h3>

                                <p className="text-slate-500 leading-relaxed text-sm">
                                    {feature.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
