"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Mail, ArrowRight } from "lucide-react";

const footerLinks = {
    company: [
        { name: "About Institute", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Research", href: "/research" },
        { name: "Press Kit", href: "/press" },
    ],
    services: [
        { name: "Neural Architecture", href: "/services/neural-architecture" },
        { name: "Generative Agents", href: "/services/autonomous-agents" },
        { name: "Edge Intelligence", href: "/services/edge-intelligence" },
        { name: "Consulting", href: "/services/consulting" },
    ],
    legal: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
    ],
};

const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, href: "#", label: "Twitter" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
    { icon: <Github className="w-5 h-5" />, href: "#", label: "GitHub" },
    { icon: <Mail className="w-5 h-5" />, href: "mailto:hello@ai-institute.com", label: "Email" },
];

export function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
            <div className="max-w-7xl mx-auto px-6 md:px-20 pt-20 pb-12">

                {/* CTA Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight text-center md:text-left">
                        Ready to shape <br className="hidden md:block" /> the future?
                    </h2>
                    <Link href="/contact">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-white text-slate-950 rounded-full font-bold text-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
                        >
                            Start a Project <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </Link>
                </div>

                <div className="h-px bg-slate-900 mb-16" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-4">

                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="inline-block mb-6">
                            <span className="text-xl font-bold text-white tracking-wider">AI_INST.</span>
                        </Link>
                        <p className="text-sm leading-relaxed mb-6 max-w-xs">
                            Pioneering the next generation of artificial intelligence. Bridging the gap between theoretical research and real-world application.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-white hover:text-slate-950 transition-all duration-300"
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Company</h3>
                        <ul className="space-y-4">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-6">Services</h3>
                        <ul className="space-y-4">
                            {footerLinks.services.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-6">Legal</h3>
                        <ul className="space-y-4">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="h-px bg-slate-900 mt-16 mb-8" />

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
                    <p>© {new Date().getFullYear()} AI Institute. All rights reserved.</p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>All Systems Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
