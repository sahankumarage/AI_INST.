"use client";

import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Handshake, Award, Users, Globe, Sparkles } from "lucide-react";

const partners = [
    {
        name: "TechVentures Global",
        category: "Technology Partner",
        description: "Collaborating on cutting-edge AI infrastructure and cloud solutions for enterprise deployments.",
        logo: "TV",
        gradient: "from-blue-600 to-indigo-700",
        stats: { projects: "24+", years: "5" },
        website: "#"
    },
    {
        name: "Innovation Labs",
        category: "Research Partner",
        description: "Joint research initiatives in machine learning, neural networks, and advanced AI algorithms.",
        logo: "IL",
        gradient: "from-emerald-600 to-teal-700",
        stats: { projects: "18+", years: "3" },
        website: "#"
    },
    {
        name: "DataStream Analytics",
        category: "Data Partner",
        description: "Providing high-quality datasets and analytics infrastructure for AI model training.",
        logo: "DA",
        gradient: "from-violet-600 to-purple-700",
        stats: { projects: "32+", years: "4" },
        website: "#"
    },
    {
        name: "CloudNine Systems",
        category: "Infrastructure Partner",
        description: "Powering our AI solutions with scalable cloud computing and edge deployment capabilities.",
        logo: "CN",
        gradient: "from-orange-500 to-rose-600",
        stats: { projects: "15+", years: "2" },
        website: "#"
    },
    {
        name: "NeuralPath Inc",
        category: "AI Research",
        description: "Pioneering breakthroughs in generative AI and natural language processing together.",
        logo: "NP",
        gradient: "from-cyan-500 to-blue-600",
        stats: { projects: "21+", years: "4" },
        website: "#"
    },
    {
        name: "FutureTech Academy",
        category: "Education Partner",
        description: "Co-developing curriculum and certification programs for the next generation of AI professionals.",
        logo: "FT",
        gradient: "from-pink-500 to-rose-600",
        stats: { projects: "12+", years: "3" },
        website: "#"
    }
];

const stats = [
    { icon: Handshake, value: "50+", label: "Global Partners" },
    { icon: Award, value: "200+", label: "Joint Projects" },
    { icon: Users, value: "10K+", label: "Trained Together" },
    { icon: Globe, value: "25+", label: "Countries" }
];

export function SelectedWorks() {
    return (
        <section className="py-24 md:py-32 px-6 md:px-20 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-100/40 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 md:mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-violet-100 text-blue-700 font-medium text-sm mb-6">
                        <Sparkles className="w-4 h-4" />
                        Trusted Partnerships
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                        Partners & <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Collaborations</span>
                    </h2>
                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
                        Building the future of AI together with industry leaders, research institutions, and innovative organizations worldwide.
                    </p>
                </motion.div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-20"
                >
                    {stats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <div
                                key={index}
                                className="relative group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-violet-50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
                                <div className="relative z-10">
                                    <IconComponent className="w-8 h-8 text-blue-600 mb-3" />
                                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-slate-500 font-medium mt-1">
                                        {stat.label}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </motion.div>

                {/* Partners Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {partners.map((partner, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:border-transparent transition-all duration-500 cursor-pointer overflow-hidden"
                        >
                            {/* Hover Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${partner.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                            {/* Top Row: Logo + Category */}
                            <div className="flex items-start justify-between mb-6 relative z-10">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${partner.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                    <span className="text-white font-bold text-xl">{partner.logo}</span>
                                </div>
                                <span className="px-3 py-1.5 rounded-full bg-slate-100 text-xs font-semibold text-slate-600 uppercase tracking-wide group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors duration-300">
                                    {partner.category}
                                </span>
                            </div>

                            {/* Partner Name */}
                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors duration-300 relative z-10">
                                {partner.name}
                            </h3>

                            {/* Description */}
                            <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-6 relative z-10">
                                {partner.description}
                            </p>

                            {/* Stats Pills */}
                            <div className="flex gap-3 mb-6 relative z-10">
                                <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors duration-300">
                                    <span className="text-slate-900 font-bold">{partner.stats.projects}</span>
                                    <span className="text-slate-500 text-sm ml-1">Projects</span>
                                </div>
                                <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-violet-50 group-hover:border-violet-100 transition-colors duration-300">
                                    <span className="text-slate-900 font-bold">{partner.stats.years}</span>
                                    <span className="text-slate-500 text-sm ml-1">Years</span>
                                </div>
                            </div>

                            {/* Link */}
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 group-hover:text-blue-600 transition-colors duration-300">
                                    View Partnership <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 group-hover:bg-blue-600">
                                    <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors duration-300" />
                                </div>
                            </div>

                            {/* Decorative Corner */}
                            <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${partner.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`} />
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-16 md:mt-20 text-center"
                >
                    <div className="inline-flex flex-col sm:flex-row items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center gap-2"
                        >
                            Become a Partner <ArrowRight className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-4 rounded-full bg-white text-slate-700 font-semibold border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-300"
                        >
                            View All Partners
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
