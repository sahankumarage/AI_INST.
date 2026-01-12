"use client";

import { motion } from "framer-motion";
import { Bot, MessageSquare, Search, Zap } from "lucide-react";

const agents = [
    {
        title: "Support Agent",
        description: "24/7 customer service automation with human-like understanding.",
        icon: <MessageSquare className="w-6 h-6 text-white" />,
        color: "bg-emerald-500",
    },
    {
        title: "Research Agent",
        description: "Autonomous data gathering and synthesis for market intelligence.",
        icon: <Search className="w-6 h-6 text-white" />,
        color: "bg-blue-500",
    },
    {
        title: "Operations Agent",
        description: "Streamline internal workflows and task management automatically.",
        icon: <Zap className="w-6 h-6 text-white" />,
        color: "bg-amber-500",
    },
    {
        title: "Custom Agents",
        description: "Tailored autonomous workers designed for your specific needs.",
        icon: <Bot className="w-6 h-6 text-white" />,
        color: "bg-violet-600",
    },
];

export default function AgentsPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-6 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <span className="text-secondary font-medium tracking-wider text-sm uppercase mb-3 block">
                        AI Workforce
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                        Autonomous Agents
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Deploy intelligent digital workers that can reason, plan, and execute tasks to scale your capabilities.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {agents.map((agent, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-primary/10 transition-all group"
                        >
                            <div
                                className={`w-14 h-14 rounded-2xl ${agent.color} flex items-center justify-center mb-6 shadow-lg shadow-current/30`}
                            >
                                {agent.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                                {agent.title}
                            </h3>
                            <p className="text-slate-500 leading-relaxed">
                                {agent.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}
