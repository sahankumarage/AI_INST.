"use client";

import { motion } from "framer-motion";
import {
    Lightbulb,
    Target,
    Eye,
    Heart,
    Rocket,
    Users,
    Award,
    Globe,
    GraduationCap,
    Briefcase,
    Bot,
    Code2,
    ArrowRight,
    Linkedin,
    Twitter,
    Mail,
    CheckCircle2,
    Sparkles,
    Zap
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const stats = [
    { value: "10+", label: "AI Projects", icon: Code2 },
    { value: "5+", label: "Happy Clients", icon: Briefcase },
    { value: "3+", label: "Countries", icon: Globe },
    { value: "50+", label: "Students Trained", icon: GraduationCap },
];

const values = [
    {
        icon: Lightbulb,
        title: "Innovation First",
        description: "We constantly push boundaries, exploring cutting-edge AI technologies to deliver solutions that define tomorrow.",
        gradient: "from-amber-500 to-orange-500"
    },
    {
        icon: Users,
        title: "Accessibility",
        description: "AI should be for everyone. We make complex technology understandable and accessible to all skill levels.",
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        icon: Heart,
        title: "Ethical AI",
        description: "We develop responsible AI solutions with transparency, fairness, and societal benefit at their core.",
        gradient: "from-pink-500 to-rose-500"
    },
    {
        icon: Award,
        title: "Excellence",
        description: "From education to implementation, we maintain the highest standards of quality and professionalism.",
        gradient: "from-violet-500 to-purple-500"
    },
];

const services = [
    { icon: Bot, title: "AI Agents", description: "Intelligent automation solutions that work around the clock" },
    { icon: Code2, title: "Software Products", description: "Ready-to-deploy AI-powered applications for various industries" },
    { icon: Briefcase, title: "Consulting", description: "Strategic AI integration and digital transformation guidance" },
    { icon: GraduationCap, title: "AI Education", description: "Comprehensive courses from fundamentals to advanced specializations" },
];

const whyChooseUs = [
    {
        icon: Rocket,
        title: "Cutting-Edge Technology",
        description: "We use the latest AI models including GPT-4, Gemini, and custom-trained solutions to deliver state-of-the-art results.",
        gradient: "from-violet-500 to-purple-600"
    },
    {
        icon: Zap,
        title: "Fast Delivery",
        description: "From concept to deployment in weeks, not months. Our agile approach ensures rapid development without compromising quality.",
        gradient: "from-amber-500 to-orange-500"
    },
    {
        icon: Heart,
        title: "Full Support",
        description: "We don't just build and leave. Our team provides ongoing support, training, and optimization for your AI solutions.",
        gradient: "from-pink-500 to-rose-500"
    },
    {
        icon: CheckCircle2,
        title: "Affordable Pricing",
        description: "Enterprise-grade AI solutions at startup-friendly prices. We believe powerful AI should be accessible to all businesses.",
        gradient: "from-emerald-500 to-teal-500"
    },
];

const timeline = [
    { year: "Q1 2025", title: "Founded", description: "AI_INST. was born with a vision to make AI accessible to everyone" },
    { year: "Q2 2025", title: "First Products", description: "Launched our first AI-powered software products and agents" },
    { year: "Q3 2025", title: "Growing Community", description: "Building partnerships and training our first batch of students" },
    { year: "Now", title: "Looking Ahead", description: "Expanding our offerings and reaching more businesses worldwide" },
];

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-32 pb-40 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                            backgroundSize: '50px 50px'
                        }} />
                    </div>
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 font-medium text-sm mb-6">
                            <Sparkles className="w-4 h-4" />
                            About AI_INST.
                        </span>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            Architects of the{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                                Intelligent Future
                            </span>
                        </h1>

                        <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                            We believe AI is not just a tool—it's a fundamental shift in how humanity creates, solves, and evolves.
                            Our mission is to make this transformative technology accessible to everyone.
                        </p>

                        {/* Stats Row */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto relative z-20"
                        >
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                                >
                                    <stat.icon className="w-8 h-8 text-primary mb-3" />
                                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-sm text-slate-300">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Bottom Wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 100V60C240 20 480 0 720 0C960 0 1200 20 1440 60V100H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Mission */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-10 rounded-3xl blur-xl group-hover:opacity-20 transition-opacity" />
                            <div className="relative bg-white border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-shadow">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6">
                                    <Target className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    To democratize artificial intelligence education and empower individuals and organizations
                                    to harness the transformative power of AI, creating a more innovative and efficient future for all.
                                </p>
                            </div>
                        </motion.div>

                        {/* Vision */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-secondary to-accent opacity-10 rounded-3xl blur-xl group-hover:opacity-20 transition-opacity" />
                            <div className="relative bg-white border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-shadow">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-6">
                                    <Eye className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h3>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    A world where AI technology is understood, accessible, and ethically deployed by everyone—
                                    from curious learners to global enterprises—driving positive change across all sectors of society.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Our Story Timeline */}
            <section className="py-20 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-primary font-medium tracking-wider text-sm uppercase mb-3 block">
                            Our Journey
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
                            The AI_INST. Story
                        </h2>
                    </motion.div>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-accent hidden md:block" />

                        <div className="space-y-12">
                            {timeline.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                                >
                                    <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                        <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 inline-block">
                                            <span className="text-primary font-bold text-lg">{item.year}</span>
                                            <h3 className="text-xl font-bold text-slate-900 mt-2 mb-2">{item.title}</h3>
                                            <p className="text-slate-600">{item.description}</p>
                                        </div>
                                    </div>

                                    {/* Center Dot */}
                                    <div className="relative z-10">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30" />
                                    </div>

                                    <div className="flex-1 hidden md:block" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-secondary font-medium tracking-wider text-sm uppercase mb-3 block">
                            What We Stand For
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
                            Our Core Values
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group"
                            >
                                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all h-full">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${value.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <value.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{value.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What We Do */}
            <section className="py-20 px-6 bg-slate-900 text-white relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl" />
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-primary font-medium tracking-wider text-sm uppercase mb-3 block">
                            Our Ecosystem
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold">
                            What We Do
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <service.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                                <p className="text-slate-300 text-sm">{service.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story Section - Simple Description with Art */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Art/Illustration Side */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            {/* Abstract Art Container */}
                            <div className="relative aspect-square max-w-md mx-auto">
                                {/* Background Gradient Circles */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-72 h-72 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl" />
                                </div>

                                {/* Floating Elements */}
                                <motion.div
                                    animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                    className="absolute top-1/4 left-1/4 w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-xl shadow-primary/30 flex items-center justify-center"
                                >
                                    <Sparkles className="w-10 h-10 text-white" />
                                </motion.div>

                                <motion.div
                                    animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
                                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                                    className="absolute top-1/3 right-1/4 w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary to-accent shadow-xl shadow-secondary/30 flex items-center justify-center"
                                >
                                    <Bot className="w-8 h-8 text-white" />
                                </motion.div>

                                <motion.div
                                    animate={{ y: [-8, 12, -8], rotate: [0, 3, 0] }}
                                    transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}
                                    className="absolute bottom-1/4 left-1/3 w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-primary shadow-xl shadow-accent/30 flex items-center justify-center"
                                >
                                    <Code2 className="w-7 h-7 text-white" />
                                </motion.div>

                                {/* Central Element */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-32 h-32 rounded-3xl bg-white shadow-2xl flex items-center justify-center border border-slate-100">
                                        <div className="text-4xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                                            AI
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Description Side */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="text-primary font-medium tracking-wider text-sm uppercase mb-3 block">
                                Our Promise
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                                Building the Future, Together
                            </h2>
                            <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
                                <p>
                                    We're a young startup with big dreams. Founded in 2025, AI_INST. was born from a simple belief:
                                    <span className="text-slate-900 font-medium"> AI should be accessible to everyone</span>,
                                    not just tech giants.
                                </p>
                                <p>
                                    Our team combines cutting-edge AI expertise with a genuine passion for helping businesses
                                    transform. From intelligent automation to custom AI solutions, we're here to turn your
                                    ideas into reality.
                                </p>
                                <p>
                                    We may be new, but we're driven by innovation, committed to excellence, and excited to
                                    grow alongside our clients. <span className="text-primary font-medium">Your success is our success.</span>
                                </p>
                            </div>

                            {/* Simple Stats */}
                            <div className="flex gap-8 mt-8 pt-8 border-t border-slate-200">
                                <div>
                                    <div className="text-3xl font-bold text-primary">2025</div>
                                    <div className="text-sm text-slate-500">Founded</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-secondary">100%</div>
                                    <div className="text-sm text-slate-500">Passion</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-accent">∞</div>
                                    <div className="text-sm text-slate-500">Possibilities</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-gradient-to-r from-primary via-secondary to-accent">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Ready to Transform with AI?
                        </h2>
                        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                            Join hundreds of learners and businesses who have chosen AI_INST. as their partner in the AI revolution.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/courses">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 bg-white text-slate-900 rounded-full font-semibold shadow-xl hover:bg-slate-50 transition-colors flex items-center gap-2"
                                >
                                    Explore Courses <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </Link>
                            <Link href="/contact">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 bg-white/10 text-white rounded-full font-semibold border border-white/30 hover:bg-white/20 transition-colors"
                                >
                                    Contact Us
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
