"use client";

import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Building2, TrendingUp, Activity, Zap, Shield, LineChart, Dna, Brain, Microscope, Network, Database, Cpu } from "lucide-react";

const projects = [
    {
        title: "Sentient City",
        category: "Smart Infrastructure",
        description: "An AI-driven operating system for metropolitan areas, optimizing traffic, energy, and emergency response in real-time.",
        gradient: "from-blue-600 to-indigo-700",
        tags: ["Computer Vision", "IoT", "Big Data"],
        icon: Building2,
        stats: [
            { label: "Cities", value: "12+" },
            { label: "Data Points", value: "2.4B" },
            { label: "Response Time", value: "<50ms" }
        ],
        features: [
            { icon: Network, label: "Smart Grid" },
            { icon: Activity, label: "Real-time" },
            { icon: Shield, label: "Secure" }
        ]
    },
    {
        title: "Neural Finance",
        category: "Fintech",
        description: "Predictive modeling engine processing market data at nanosecond speeds to identify arbitrage opportunities.",
        gradient: "from-emerald-600 to-teal-700",
        tags: ["Deep Learning", "HFT", "Analytics"],
        icon: TrendingUp,
        stats: [
            { label: "Accuracy", value: "99.7%" },
            { label: "Trades/sec", value: "50K" },
            { label: "ROI", value: "+340%" }
        ],
        features: [
            { icon: LineChart, label: "Analytics" },
            { icon: Zap, label: "Fast" },
            { icon: Database, label: "Big Data" }
        ]
    },
    {
        title: "GeneSys",
        category: "Healthcare",
        description: "Accelerating drug discovery through generative protein folding models and accelerated clinical trials.",
        gradient: "from-rose-600 to-pink-700",
        tags: ["Generative AI", "Bioinformatics", "Cloud"],
        icon: Dna,
        stats: [
            { label: "Proteins", value: "1.2M" },
            { label: "Time Saved", value: "85%" },
            { label: "Success Rate", value: "94%" }
        ],
        features: [
            { icon: Brain, label: "AI-Powered" },
            { icon: Microscope, label: "Research" },
            { icon: Cpu, label: "Processing" }
        ]
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
                    {projects.map((project, i) => {
                        const IconComponent = project.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 0.7, delay: i * 0.1 }}
                                className="group grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center"
                            >
                                {/* Visual Side - Alternating Order on Desktop */}
                                <div className={`relative aspect-[4/3] rounded-3xl overflow-hidden cursor-pointer ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out`} />

                                    {/* Abstract Pattern Overlay */}
                                    <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Floating Decorative Elements */}
                                    <div className="absolute top-6 right-6 w-20 h-20 rounded-full bg-white/10 blur-xl animate-pulse" />
                                    <div className="absolute bottom-20 left-10 w-16 h-16 rounded-full bg-white/15 blur-lg" style={{ animation: 'pulse 3s ease-in-out infinite' }} />

                                    {/* Grid Pattern */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="w-full h-full" style={{
                                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                                            backgroundSize: '40px 40px'
                                        }} />
                                    </div>

                                    {/* Main Icon */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0.8 }}
                                            whileInView={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                            className="relative"
                                        >
                                            <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                                <IconComponent className="w-14 h-14 md:w-20 md:h-20 text-white" strokeWidth={1.5} />
                                            </div>
                                            {/* Orbiting dots */}
                                            <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0s' }} />
                                            <div className="absolute -bottom-1 -left-3 w-3 h-3 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '0.5s' }} />
                                            <div className="absolute top-1/2 -right-4 w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '1s' }} />
                                        </motion.div>
                                    </div>

                                    {/* Stats Row */}
                                    <div className="absolute top-6 left-6 right-6 flex justify-between">
                                        {project.stats.map((stat, idx) => (
                                            <div key={idx} className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20">
                                                <div className="text-white font-bold text-lg md:text-xl">{stat.value}</div>
                                                <div className="text-white/70 text-xs uppercase tracking-wide">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Feature Icons Row */}
                                    <div className="absolute bottom-6 left-6 flex gap-3">
                                        {project.features.map((feature, idx) => {
                                            const FeatureIcon = feature.icon;
                                            return (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20 group-hover:bg-white/25 transition-colors duration-300"
                                                >
                                                    <FeatureIcon className="w-4 h-4 text-white" />
                                                    <span className="text-white text-xs font-medium">{feature.label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Hover Action Button */}
                                    <div className="absolute bottom-6 right-6 text-white z-10">
                                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-white/30">
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
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
