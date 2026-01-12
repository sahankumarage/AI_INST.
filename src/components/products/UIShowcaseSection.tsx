"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ProductShowcase } from "@/data/products";
import { Monitor, Sparkles } from "lucide-react";

interface UIShowcaseSectionProps {
    showcase: ProductShowcase[];
    gradient: string;
    productTitle: string;
}

export function UIShowcaseSection({ showcase, gradient, productTitle }: UIShowcaseSectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Calculate which item should be active based on scroll progress
    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (latest) => {
            const itemCount = showcase.length;
            const sectionProgress = Math.min(Math.max(latest, 0), 1);
            const newIndex = Math.min(
                Math.floor(sectionProgress * itemCount),
                itemCount - 1
            );
            setActiveIndex(newIndex);
        });
        return () => unsubscribe();
    }, [scrollYProgress, showcase.length]);

    // Progress for current item (0-1 within each section)
    const itemProgress = useTransform(
        scrollYProgress,
        [0, 1],
        [0, showcase.length]
    );

    return (
        <section
            ref={containerRef}
            className="relative bg-slate-900"
            style={{ height: `${(showcase.length + 1) * 100}vh` }}
        >
            {/* Sticky Container */}
            <div className="sticky top-0 h-screen flex items-center overflow-hidden">
                <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Side - Text Content */}
                    <div className="relative z-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="mb-8"
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6">
                                <Monitor className="w-4 h-4" />
                                Product Tour
                            </span>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                                Experience the Interface
                            </h2>
                            <p className="text-lg text-slate-400">
                                Explore the key features that make {productTitle} powerful yet simple to use.
                            </p>
                        </motion.div>

                        {/* Progress Indicators */}
                        <div className="flex gap-2 mb-8">
                            {showcase.map((_, i) => (
                                <motion.div
                                    key={i}
                                    className={`h-1 rounded-full transition-all duration-300 ${i === activeIndex
                                        ? `w-12 bg-gradient-to-r ${gradient}`
                                        : i < activeIndex
                                            ? "w-6 bg-white/40"
                                            : "w-6 bg-white/20"
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Active Content */}
                        <div className="relative min-h-[200px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                >
                                    {/* Feature Number */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className={`text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>
                                            0{activeIndex + 1}
                                        </span>
                                        <div className={`h-px flex-1 bg-gradient-to-r ${gradient} opacity-30`} />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                        {showcase[activeIndex].title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                                        {showcase[activeIndex].description}
                                    </p>

                                    {/* Highlight Badge */}
                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${gradient} text-white font-semibold text-sm shadow-lg`}>
                                        <Sparkles className="w-4 h-4" />
                                        {showcase[activeIndex].highlight}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Side - Visual/Mockup */}
                    <div className="relative">
                        {/* Device Frame */}
                        <div className="relative">
                            {/* Glow Effect */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-20 blur-3xl scale-110`} />

                            {/* Monitor Frame */}
                            <motion.div
                                className="relative bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                            >
                                {/* Browser Header */}
                                <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                    </div>
                                    <div className="flex-1 mx-4">
                                        <div className="bg-slate-900 rounded-md px-4 py-1.5 text-xs text-slate-500 font-mono">
                                            app.{productTitle.toLowerCase().replace(/\s+/g, '')}.ai
                                        </div>
                                    </div>
                                </div>

                                {/* Screen Content */}
                                <div className="aspect-[4/3] bg-slate-900 relative overflow-hidden">
                                    <AnimatePresence mode="wait">
                                        {/* Background Gradient */}
                                        <motion.div
                                            key={`bg-${activeIndex}`}
                                            initial={{ opacity: 0, scale: 1.1 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.5 }}
                                            className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`}
                                        />
                                    </AnimatePresence>

                                    {/* Content: Custom Image OR Abstract UI */}
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeIndex}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.4 }}
                                            className="absolute inset-0"
                                        >
                                            {showcase[activeIndex].image ? (
                                                /* Custom Image */
                                                <img
                                                    src={showcase[activeIndex].image}
                                                    alt={showcase[activeIndex].title}
                                                    className="w-full h-full object-cover object-top"
                                                />
                                            ) : (
                                                /* Abstract UI Fallback */
                                                <div className="h-full p-6 flex flex-col">
                                                    {/* Mock Header */}
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div className={`h-4 w-32 rounded bg-gradient-to-r ${gradient} opacity-60`} />
                                                        <div className="flex gap-2">
                                                            <div className="h-8 w-8 rounded-lg bg-slate-700" />
                                                            <div className="h-8 w-8 rounded-lg bg-slate-700" />
                                                        </div>
                                                    </div>

                                                    {/* Mock Content Grid */}
                                                    <div className="flex-1 grid grid-cols-3 gap-4">
                                                        {/* Sidebar */}
                                                        <div className="col-span-1 space-y-3">
                                                            {[1, 2, 3, 4].map((i) => (
                                                                <motion.div
                                                                    key={i}
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: i * 0.1 }}
                                                                    className={`h-10 rounded-lg ${i === activeIndex + 1 ? `bg-gradient-to-r ${gradient} opacity-60` : 'bg-slate-800'}`}
                                                                />
                                                            ))}
                                                        </div>

                                                        {/* Main Content */}
                                                        <div className="col-span-2 space-y-4">
                                                            <motion.div
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="h-24 rounded-xl bg-slate-800 border border-slate-700 p-4"
                                                            >
                                                                <div className={`h-3 w-24 rounded bg-gradient-to-r ${gradient} opacity-50 mb-2`} />
                                                                <div className="h-2 w-full rounded bg-slate-700 mb-1" />
                                                                <div className="h-2 w-3/4 rounded bg-slate-700" />
                                                            </motion.div>

                                                            <div className="grid grid-cols-2 gap-3">
                                                                {[1, 2, 3, 4].map((i) => (
                                                                    <motion.div
                                                                        key={i}
                                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                        transition={{ delay: 0.2 + i * 0.1 }}
                                                                        className="h-20 rounded-lg bg-slate-800 border border-slate-700"
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* Feature Label Overlay */}
                                    <div className="absolute bottom-4 right-4">
                                        <motion.div
                                            key={activeIndex}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`px-4 py-2 rounded-full bg-gradient-to-r ${gradient} text-white text-sm font-semibold shadow-xl`}
                                        >
                                            {showcase[activeIndex].title}
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Monitor Stand */}
                            <div className="flex justify-center mt-2">
                                <div className="w-24 h-4 bg-slate-700 rounded-b-lg" />
                            </div>
                            <div className="flex justify-center">
                                <div className="w-40 h-2 bg-slate-700 rounded-b-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: activeIndex < showcase.length - 1 ? 1 : 0 }}
                    className="flex flex-col items-center text-white/50 text-sm"
                >
                    <span>Scroll to explore</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="mt-2"
                    >
                        ↓
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
