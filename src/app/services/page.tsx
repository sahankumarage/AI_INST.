"use client";

import { motion } from "framer-motion";
import { Code, Video, Terminal, Brain, Image, Lightbulb } from "lucide-react";

const services = [
    {
        title: "AI Web Development",
        description: "Intelligent websites that adapt to user behavior.",
        icon: <Code className="w-6 h-6 text-white" />,
        color: "bg-blue-500",
    },
    {
        title: "AI Video Generation",
        description: "Cinematic quality video content produced by algorithms.",
        icon: <Video className="w-6 h-6 text-white" />,
        color: "bg-sky-500",
    },
    {
        title: "AI Prompting",
        description: "Expert engineering for LLM interaction and control.",
        icon: <Terminal className="w-6 h-6 text-white" />,
        color: "bg-indigo-500",
    },
    {
        title: "AI Image Generation",
        description: "Visual assets created instantly for your brand.",
        icon: <Image className="w-6 h-6 text-white" />,
        color: "bg-cyan-500",
    },
    {
        title: "AI Consulting",
        description: "Strategic guidance on integrating AI into your workflow.",
        icon: <Brain className="w-6 h-6 text-white" />,
        color: "bg-blue-600",
    },
    {
        title: "Innovation Labs",
        description: "Experimental R&D for custom AI models.",
        icon: <Lightbulb className="w-6 h-6 text-white" />,
        color: "bg-sky-600",
    },
];

export default function ServicesPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-6 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">Our Services</h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Comprehensive AI solutions designed to elevate your business in the digital age.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-primary/10 transition-all group"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-6 shadow-lg shadow-current/30`}>
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
            </div>
        </main>
    );
}
