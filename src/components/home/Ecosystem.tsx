"use client";

import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Package, Bot, ArrowRight } from "lucide-react";
import Link from "next/link";

const divisions = [
    {
        title: "AI Products",
        subtitle: "Software Solutions",
        description: "Cutting-edge tools and platforms built for the next generation.",
        icon: <Package className="w-8 h-8" />,
        href: "/products",
        color: "bg-emerald-500",
        gradient: "from-emerald-500/20 to-emerald-500/5",
    },
    {
        title: "AI Agents",
        subtitle: "Autonomous Systems",
        description: "Intelligent digital workers that automate complex tasks.",
        icon: <Bot className="w-8 h-8" />,
        href: "/agents",
        color: "bg-orange-500",
        gradient: "from-orange-500/20 to-orange-500/5",
    },
    {
        title: "Consulting",
        subtitle: "Strategic Implementation",
        description: "Expert guidance to integrate AI into your business workflow.",
        icon: <Briefcase className="w-8 h-8" />,
        href: "/consulting",
        color: "bg-purple-500",
        gradient: "from-purple-500/20 to-purple-500/5",
    },
    {
        title: "Education",
        subtitle: "Professional Training",
        description: "World-class curriculum designed to master the art of artificial intelligence.",
        icon: <GraduationCap className="w-8 h-8" />,
        href: "/courses",
        color: "bg-blue-500",
        gradient: "from-blue-500/20 to-blue-500/5",
    },
];

export function Ecosystem() {
    return (
        <section className="py-24 px-6 md:px-20 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-primary font-medium tracking-wider text-sm uppercase mb-3 block"
                    >
                        Our Ecosystem
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-bold text-slate-900 mb-6"
                    >
                        Integrated AI Ecosystem
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-600 max-w-2xl mx-auto"
                    >
                        We are a comprehensive AI powerhouse featuring products, autonomous agents, consulting, and education.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {divisions.map((item, index) => (
                        <Link key={index} href={item.href} className="block h-full">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className={`h-full p-8 rounded-3xl border border-slate-100 bg-gradient-to-b ${item.gradient} hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group flex flex-col`}
                            >
                                <div className={`w-14 h-14 rounded-2xl ${item.color} text-white flex items-center justify-center mb-6 shadow-lg shadow-current/30 group-hover:scale-110 transition-transform duration-300`}>
                                    {item.icon}
                                </div>

                                <div className="mb-4">
                                    <span className="text-xs font-bold tracking-wider text-slate-500 uppercase block mb-1">
                                        {item.subtitle}
                                    </span>
                                    <h3 className="text-2xl font-bold text-slate-900">{item.title}</h3>
                                </div>

                                <p className="text-slate-600 mb-8 flex-grow leading-relaxed">
                                    {item.description}
                                </p>

                                <div className="flex items-center text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">
                                    Explore <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
