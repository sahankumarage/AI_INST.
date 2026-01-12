"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Send,
    MessageSquare,
    Mail,
    Phone,
    MapPin,
    Clock,
    ArrowRight,
    CheckCircle2,
    Sparkles,
    Building2,
    GraduationCap,
    Briefcase,
    Bot
} from "lucide-react";
import Link from "next/link";

const contactInfo = [
    {
        icon: Mail,
        title: "Email Us",
        value: "hello@ai-inst.com",
        description: "We'll respond within 24 hours",
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        icon: Phone,
        title: "Call Us",
        value: "+1 (555) 123-4567",
        description: "Mon-Fri, 9AM-6PM EST",
        gradient: "from-green-500 to-emerald-500"
    },
    {
        icon: MapPin,
        title: "Visit Us",
        value: "123 AI Boulevard",
        description: "San Francisco, CA 94105",
        gradient: "from-violet-500 to-purple-500"
    },
    {
        icon: Clock,
        title: "Business Hours",
        value: "9AM - 6PM",
        description: "Monday to Friday",
        gradient: "from-orange-500 to-amber-500"
    },
];

const inquiryTypes = [
    { id: "education", icon: GraduationCap, label: "Course Enrollment", description: "Learn about our AI courses" },
    { id: "consulting", icon: Briefcase, label: "Consulting", description: "Strategic AI integration" },
    { id: "product", icon: Building2, label: "Product Demo", description: "See our products in action" },
    { id: "agents", icon: Bot, label: "AI Agents", description: "Intelligent automation solutions" },
];

const faqs = [
    {
        question: "How quickly will I receive a response?",
        answer: "Our team typically responds within 24 hours during business days. For urgent matters, please call our support line."
    },
    {
        question: "Do you offer free consultations?",
        answer: "Yes! We offer a free 30-minute discovery call to understand your needs and explain how we can help."
    },
    {
        question: "What information should I include in my message?",
        answer: "Please share your goals, current challenges, timeline, and any specific requirements. This helps us provide the most relevant response."
    },
];

export default function ContactPage() {
    const [selectedInquiry, setSelectedInquiry] = useState("education");
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true);
        // Reset after 3 seconds
        setTimeout(() => setFormSubmitted(false), 3000);
    };

    return (
        <main className="min-h-screen bg-white overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
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
                            <MessageSquare className="w-4 h-4" />
                            Get In Touch
                        </span>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            Let's Build the{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                                Future Together
                            </span>
                        </h1>

                        <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                            Have a question or want to work with us? We'd love to hear from you.
                            Reach out and let's start a conversation.
                        </p>
                    </motion.div>
                </div>

                {/* Bottom Wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 100V60C240 20 480 0 720 0C960 0 1200 20 1440 60V100H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-12 px-6 -mt-8 relative z-20">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((info, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group"
                            >
                                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all h-full">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${info.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <info.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{info.title}</h3>
                                    <p className="text-lg font-semibold text-slate-900 mb-1">{info.value}</p>
                                    <p className="text-sm text-slate-500">{info.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Contact Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Left Side - Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="mb-8">
                                <span className="text-primary font-medium tracking-wider text-sm uppercase mb-3 block">
                                    Send a Message
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                                    How Can We Help?
                                </h2>
                                <p className="text-slate-600">
                                    Fill out the form below and we'll get back to you as soon as possible.
                                </p>
                            </div>

                            {/* Inquiry Type Selector */}
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                {inquiryTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setSelectedInquiry(type.id)}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${selectedInquiry === type.id
                                            ? "border-primary bg-primary/5"
                                            : "border-slate-100 hover:border-slate-200"
                                            }`}
                                    >
                                        <type.icon className={`w-5 h-5 mb-2 ${selectedInquiry === type.id ? 'text-primary' : 'text-slate-400'}`} />
                                        <p className={`font-semibold text-sm ${selectedInquiry === type.id ? 'text-primary' : 'text-slate-700'}`}>
                                            {type.label}
                                        </p>
                                        <p className="text-xs text-slate-500">{type.description}</p>
                                    </button>
                                ))}
                            </div>

                            {/* Contact Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">First Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-slate-900 placeholder:text-slate-400"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Last Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-slate-900 placeholder:text-slate-400"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-slate-900 placeholder:text-slate-400"
                                        placeholder="john@company.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Company (Optional)</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-slate-900 placeholder:text-slate-400"
                                        placeholder="Your Company"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Message</label>
                                    <textarea
                                        rows={5}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-slate-900 placeholder:text-slate-400 resize-none"
                                        placeholder="Tell us about your project, goals, or any questions you have..."
                                    ></textarea>
                                </div>

                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={formSubmitted}
                                    className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-3 shadow-lg transition-all group ${formSubmitted
                                        ? "bg-green-500 text-white"
                                        : "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-xl hover:shadow-primary/30"
                                        }`}
                                >
                                    {formSubmitted ? (
                                        <>
                                            <CheckCircle2 className="w-5 h-5" />
                                            Message Sent!
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </motion.div>

                        {/* Right Side - Info & FAQ */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            {/* Quick Response Promise */}
                            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                                <div className="relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6">
                                        <Sparkles className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">Fast Response Guaranteed</h3>
                                    <p className="text-slate-300 mb-6">
                                        Our team is committed to responding to all inquiries within 24 hours.
                                        For urgent matters, don't hesitate to call us directly.
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-slate-800" />
                                            ))}
                                        </div>
                                        <p className="text-sm text-slate-400">Expert team ready to help</p>
                                    </div>
                                </div>
                            </div>

                            {/* FAQ Section */}
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h3>
                                <div className="space-y-4">
                                    {faqs.map((faq, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="bg-slate-50 rounded-2xl p-6"
                                        >
                                            <h4 className="font-semibold text-slate-900 mb-2">{faq.question}</h4>
                                            <p className="text-slate-600 text-sm">{faq.answer}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Schedule a Call CTA */}
                            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
                                <h4 className="font-bold text-slate-900 mb-2">Prefer a Live Conversation?</h4>
                                <p className="text-slate-600 text-sm mb-4">
                                    Schedule a free 30-minute discovery call with our team.
                                </p>
                                <Link href="#schedule">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-6 py-3 bg-white text-primary font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                                    >
                                        Schedule a Call <ArrowRight className="w-4 h-4" />
                                    </motion.button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Map Section (Placeholder) */}
            <section className="py-20 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <span className="text-primary font-medium tracking-wider text-sm uppercase mb-3 block">
                            Our Location
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                            Visit Our Office
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] bg-slate-200"
                    >
                        {/* Map Placeholder - Replace with actual map embed */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 flex items-center justify-center">
                            <div className="text-center">
                                <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                                <p className="text-white text-xl font-semibold">123 AI Boulevard</p>
                                <p className="text-slate-400">San Francisco, CA 94105</p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    className="mt-6 px-6 py-3 bg-white text-slate-900 rounded-full font-semibold shadow-lg"
                                >
                                    Get Directions
                                </motion.button>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-10 left-10 w-20 h-20 border border-white/10 rounded-full" />
                        <div className="absolute bottom-10 right-10 w-32 h-32 border border-white/10 rounded-full" />
                    </motion.div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-20 px-6 bg-gradient-to-r from-primary via-secondary to-accent">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Ready to Start Your AI Journey?
                        </h2>
                        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                            Whether you're looking to learn, implement, or innovate with AI, we're here to help you every step of the way.
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
                            <Link href="/products">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 bg-white/10 text-white rounded-full font-semibold border border-white/30 hover:bg-white/20 transition-colors"
                                >
                                    View Products
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
