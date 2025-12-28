"use client";

import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";

const projects = [
    {
        title: "Sentient City",
        category: "Smart Infrastructure",
        description: "An AI-driven operating system for metropolitan areas, optimizing traffic, energy, and emergency response in real-time.",
        gradient: "from-blue-600 to-indigo-700",
        tags: ["Computer Vision", "IoT", "Big Data"]
    },
    {
        title: "Neural Finance",
        category: "Fintech",
        description: "Predictive modeling engine processing market data at nanosecond speeds to identify arbitrage opportunities.",
        gradient: "from-emerald-600 to-teal-700",
        tags: ["Deep Learning", "HFT", "Analytics"]
    },
    {
        title: "GeneSys",
        category: "Healthcare",
        description: "Accelerating drug discovery through generative protein folding models and accelerated clinical trials.",
        gradient: "from-rose-600 to-pink-700",
        tags: ["Generative AI", "Bioinformatics", "Cloud"]
    }
];

export function SelectedWorks() {
    return (
        <section className="py-32 px-6 md:px-20 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div>
                        <span className="text-secondary font-medium tracking-wider text-sm uppercase mb-3 block">Selected Works</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                            Transforming Ideas <br className="hidden md:block" />
                            <span className="text-slate-400">into Intelligence.</span>
                        </h2>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 text-slate-900 font-semibold border-b border-slate-900 pb-1 hover:text-primary hover:border-primary transition-all"
                    >
                        View all projects <ArrowRight className="w-4 h-4" />
                    </motion.button>
                </div>

                <div className="flex flex-col gap-12 md:gap-20">
                    {projects.map((project, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.7, delay: i * 0.1 }}
                            className="group grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center"
                        >
                            {/* Visual Side - Alternating Order on Desktop */}
                            <div className={`relative aspect-[4/3] rounded-3xl overflow-hidden ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out`} />

                                {/* Abstract Pattern Overlay */}
                                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                                <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="absolute bottom-8 left-8 right-8 text-white z-10">
                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                        <ExternalLink className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className={`${i % 2 === 1 ? 'md:order-1' : ''}`}>
                                <div className="flex gap-3 mb-6">
                                    {project.tags.map((tag, t) => (
                                        <span key={t} className="px-3 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-500 uppercase tracking-wide">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 group-hover:text-primary transition-colors duration-300">
                                    {project.title}
                                </h3>

                                <p className="text-lg text-slate-500 leading-relaxed mb-8">
                                    {project.description}
                                </p>

                                <div className="flex items-center gap-4 text-sm font-semibold text-slate-900 group-hover:translate-x-2 transition-transform duration-300 cursor-pointer">
                                    Explore Case Study <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
