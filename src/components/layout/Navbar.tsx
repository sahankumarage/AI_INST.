"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

const navItems = [
    { name: "INSTITUTE", href: "/" },
    { name: "COURSES", href: "/courses" },
    { name: "SERVICES", href: "#services" },
    { name: "CONTACT", href: "#contact" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/90 backdrop-blur-md border border-white/50 shadow-sm rounded-full px-6 py-3">
                <Link href="/" className="text-xl font-bold tracking-tight text-black font-mono flex items-center gap-2">
                    AI_INST.
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-medium hover:text-neon-green transition-colors tracking-widest relative group"
                        >
                            <span className="relative z-10">{item.name}</span>
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-neon-green transition-all group-hover:w-full" />
                        </Link>
                    ))}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 hover:text-neon-green transition-colors"
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
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-2xl font-bold hover:text-neon-green transition-colors tracking-tighter"
                            onClick={() => setIsOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                </motion.div>
            )}
        </nav>
    );
}
