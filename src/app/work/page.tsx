"use client";

import { motion } from "framer-motion";
import {
    MessageSquare,
    Search,
    Lightbulb,
    Code2,
    TestTube,
    Rocket,
    HeartHandshake,
    CheckCircle2,
    Sparkles,
    ArrowRight
} from "lucide-react";

const workflowSteps = [
    {
        step: "01",
        title: "Discovery Call",
        subtitle: "Understanding Your Vision",
        description: "We begin with an in-depth consultation to understand your business goals, challenges, and how AI can transform your operations.",
        icon: MessageSquare,
        gradient: "from-blue-500 to-cyan-500",
        bgGradient: "from-blue-500/10 to-cyan-500/10",
        deliverables: ["Requirement Analysis", "Goal Definition", "Project Scope"],
        duration: "1-2 Days"
    },
    {
        step: "02",
        title: "Research & Analysis",
        subtitle: "Deep Dive Investigation",
        description: "Our team conducts thorough research into your industry, competitors, and potential AI solutions tailored to your needs.",
        icon: Search,
        gradient: "from-violet-500 to-purple-500",
        bgGradient: "from-violet-500/10 to-purple-500/10",
        deliverables: ["Market Research", "Technical Feasibility", "Solution Blueprint"],
        duration: "3-5 Days"
    },
    {
        step: "03",
        title: "Strategy & Planning",
        subtitle: "Crafting the Roadmap",
        description: "We develop a comprehensive strategy and project plan with clear milestones, timelines, and success metrics.",
        icon: Lightbulb,
        gradient: "from-amber-500 to-orange-500",
        bgGradient: "from-amber-500/10 to-orange-500/10",
        deliverables: ["Project Roadmap", "Technical Architecture", "Resource Plan"],
        duration: "2-3 Days"
    },
    {
        step: "04",
        title: "Development",
        subtitle: "Building Your Solution",
        description: "Our expert developers bring your AI solution to life using cutting-edge technologies and best practices.",
        icon: Code2,
        gradient: "from-emerald-500 to-teal-500",
        bgGradient: "from-emerald-500/10 to-teal-500/10",
        deliverables: ["Core Development", "AI Integration", "Progress Updates"],
        duration: "2-8 Weeks"
    },
    {
        step: "05",
        title: "Testing & Refinement",
        subtitle: "Ensuring Excellence",
        description: "Rigorous testing and quality assurance to ensure your solution performs flawlessly under all conditions.",
        icon: TestTube,
        gradient: "from-rose-500 to-pink-500",
        bgGradient: "from-rose-500/10 to-pink-500/10",
        deliverables: ["Quality Assurance", "Performance Testing", "User Feedback"],
        duration: "1-2 Weeks"
    },
    {
        step: "06",
        title: "Launch & Deployment",
        subtitle: "Going Live",
        description: "Seamless deployment of your AI solution with comprehensive documentation and training for your team.",
        icon: Rocket,
        gradient: "from-indigo-500 to-blue-600",
        bgGradient: "from-indigo-500/10 to-blue-600/10",
        deliverables: ["Production Deployment", "Documentation", "Team Training"],
        duration: "1-3 Days"
    },
    {
        step: "07",
        title: "Ongoing Support",
        subtitle: "Your Success Partner",
        description: "We continue to support, maintain, and evolve your AI solution to ensure long-term success and ROI.",
        icon: HeartHandshake,
        gradient: "from-fuchsia-500 to-purple-600",
        bgGradient: "from-fuchsia-500/10 to-purple-600/10",
        deliverables: ["24/7 Support", "Regular Updates", "Performance Monitoring"],
        duration: "Ongoing"
    }
];

export default function WorkPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-40 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl" />
            <div className="absolute bottom-40 right-0 w-96 h-96 bg-violet-100/30 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-50 to-violet-50 rounded-full blur-3xl opacity-50" />

            <div className="max-w-6xl mx-auto pt-32 pb-20 px-6 md:px-20 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 md:mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-violet-100 text-blue-700 font-medium text-sm mb-6">
                        <Sparkles className="w-4 h-4" />
                        Our Process
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                        How We <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Work Together</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
                        A transparent, collaborative approach that transforms your ideas into powerful AI solutions. Here's our proven workflow.
                    </p>
                </motion.div>

                {/* Workflow Timeline */}
                <div className="relative">
                    {/* Vertical Line - Hidden on mobile */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-violet-200 to-purple-200" />

                    {/* Steps */}
                    <div className="space-y-8 md:space-y-0">
                        {workflowSteps.map((step, index) => {
                            const IconComponent = step.icon;
                            const isLeft = index % 2 === 0;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className={`relative md:flex items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                                >
                                    {/* Content Card */}
                                    <div className={`md:w-[calc(50%-40px)] ${isLeft ? 'md:pr-0 md:text-right' : 'md:pl-0 md:text-left'}`}>
                                        <div className={`group bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:border-transparent transition-all duration-500 relative overflow-hidden`}>
                                            {/* Gradient Background on Hover */}
                                            <div className={`absolute inset-0 bg-gradient-to-br ${step.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                            <div className="relative z-10">
                                                {/* Step Number & Icon Row */}
                                                <div className={`flex items-center gap-4 mb-4 ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
                                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                                        <IconComponent className="w-7 h-7 text-white" />
                                                    </div>
                                                    <div className={`${isLeft ? 'md:order-first' : ''}`}>
                                                        <span className={`text-4xl font-black bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}>
                                                            {step.step}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Title & Subtitle */}
                                                <div className={`mb-4 ${isLeft ? 'md:text-right' : 'md:text-left'} text-left`}>
                                                    <span className="text-xs font-bold tracking-wider text-slate-400 uppercase block mb-1">
                                                        {step.subtitle}
                                                    </span>
                                                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors duration-300">
                                                        {step.title}
                                                    </h3>
                                                </div>

                                                {/* Description */}
                                                <p className={`text-slate-500 leading-relaxed mb-6 ${isLeft ? 'md:text-right' : 'md:text-left'} text-left`}>
                                                    {step.description}
                                                </p>

                                                {/* Deliverables */}
                                                <div className={`flex flex-wrap gap-2 mb-4 ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
                                                    {step.deliverables.map((item, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600 group-hover:bg-white/80 transition-colors duration-300"
                                                        >
                                                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                            {item}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Duration Badge */}
                                                <div className={`flex ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
                                                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${step.gradient} text-white text-sm font-semibold shadow-lg`}>
                                                        ⏱️ {step.duration}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Center Circle - Timeline Node */}
                                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                                            className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-xl border-4 border-white z-10`}
                                        >
                                            <span className="text-white font-bold text-sm">{step.step}</span>
                                        </motion.div>
                                    </div>

                                    {/* Empty Space for opposite side */}
                                    <div className="hidden md:block md:w-[calc(50%-40px)]" />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-16 md:mt-24 text-center"
                >
                    <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />

                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">
                                Ready to Start Your AI Journey?
                            </h3>
                            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                                Let's discuss how we can transform your business with intelligent AI solutions.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 rounded-full bg-white text-blue-600 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                >
                                    Schedule a Discovery Call
                                    <MessageSquare className="w-5 h-5" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 rounded-full bg-white/10 text-white font-semibold border border-white/30 hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                                >
                                    Contact Us
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
