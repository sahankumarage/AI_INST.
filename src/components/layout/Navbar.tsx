"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import clsx from "clsx";

const navItems = [
    { name: "HOME", href: "/" },

    {
        name: "SERVICES",
        href: "#",
        children: [
            { name: "Products", href: "/products" },
            { name: "Agents", href: "/agents" },
            { name: "Consulting", href: "/consulting" },
            { name: "Education", href: "/courses" },
        ]
    },
    { name: "WORK", href: "/work" },
    { name: "ABOUT", href: "/about" },
    { name: "CONTACT", href: "/contact" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/90 backdrop-blur-md border border-white/50 shadow-sm rounded-full px-6 py-3">
                <Link href="/" className="text-xl font-bold tracking-tight text-black font-mono flex items-center gap-2">
                    AI_INST.
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-8 items-center">
                    {navItems.map((item, index) => (
                        <div
                            key={item.name}
                            className="relative"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {item.children ? (
                                <button
                                    className="text-sm font-medium hover:text-primary transition-colors tracking-widest flex items-center gap-1 group"
                                >
                                    <span className="relative z-10">{item.name}</span>
                                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                                </button>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="text-sm font-medium hover:text-primary transition-colors tracking-widest relative group"
                                >
                                    <span className="relative z-10">{item.name}</span>
                                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full" />
                                </Link>
                            )}

                            {/* Dropdown */}
                            <AnimatePresence>
                                {item.children && hoveredIndex === index && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 min-w-[200px] bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden py-2"
                                    >
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.name}
                                                href={child.href}
                                                className="block px-6 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                                            >
                                                {child.name}
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 hover:text-primary transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute top-24 left-6 right-6 bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl rounded-3xl p-6 flex flex-col gap-4 md:hidden"
                >
                    {navItems.map((item) => (
                        <div key={item.name} className="flex flex-col gap-2">
                            {item.children ? (
                                <>
                                    <span className="text-sm font-bold text-slate-400 tracking-wider uppercase mb-1">
                                        {item.name}
                                    </span>
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.name}
                                            href={child.href}
                                            className="text-xl font-bold hover:text-primary transition-colors tracking-tight pl-4 border-l-2 border-slate-100"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {child.name}
                                        </Link>
                                    ))}
                                </>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="text-2xl font-bold hover:text-primary transition-colors tracking-tighter"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            )}
                        </div>
                    ))}
                </motion.div>
            )}
        </nav>
    );
}
