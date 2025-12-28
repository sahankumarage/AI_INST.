"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Bot, Cpu, Database, Network, Code2, ArrowUpRight } from "lucide-react";

const capabilities = [
    {
        icon: <BrainCircuit className="w-6 h-6" />,
        title: "Neural Architecture",
        category: "Core Engineering",
        description: "Designing, training, and optimizing custom neural networks for high-dimensional data problems.",
    },
    {
        icon: <Bot className="w-6 h-6" />,
        title: "Autonomous Agents",
        category: "Automation",
        description: "Building intelligent agents that can reason, plan, and execute complex workflows without supervision.",
    },
    {
        icon: <Cpu className="w-6 h-6" />,
        title: "Edge Intelligence",
        category: "IoT & Hardware",
        description: "Deploying lightweight, high-performance models directly on devices for sub-millisecond latency.",
    },
    {
        icon: <Network className="w-6 h-6" />,
        title: "Computer Vision",
        category: "Perception",
        description: "Advanced object detection, facial recognition, and spatial analysis systems.",
    }
];

export function Expertise() {
    return (
        <section className="py-24 px-6 md:px-20 bg-slate-50">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <span className="text-secondary font-medium tracking-wider text-sm uppercase mb-2 block">Our Expertise</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900">Technical Capabilities</h2>
                    </div>
                    <p className="text-slate-500 max-w-sm md:text-right text-sm leading-relaxed">
                        We focus on the hard engineering problems in AI, delivering robust solutions that scale.
                    </p>
                </div>

                <div className="flex flex-col">
                    {capabilities.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group border-t border-slate-200 py-10 flex flex-col md:flex-row gap-6 md:items-center justify-between cursor-pointer hover:bg-white/50 transition-colors"
                        >
                            <div className="flex items-center gap-6 md:w-1/3">
                                <span className="text-slate-300 font-mono text-sm">0{i + 1}</span>
                                <div className="text-slate-400 group-hover:text-primary transition-colors duration-300">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-slate-900">{item.title}</h3>
                            </div>

                            <div className="md:w-1/6">
                                <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-500">
                                    {item.category}
                                </span>
                            </div>

                            <div className="md:w-1/3 pr-8">
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            </div>

                            <div className="md:w-auto flex justify-end">
                                <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:border-slate-900 group-hover:text-white transition-all duration-300">
                                    <ArrowUpRight className="w-5 h-5 transform group-hover:rotate-45 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    <div className="border-t border-slate-200" />
                </div>
            </div>
        </section>
    );
}
