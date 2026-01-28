"use client";

import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Sparkles, BookOpen, Award } from "lucide-react";

interface LMSIntroAnimationProps {
    onComplete: () => void;
}

export default function LMSIntroAnimation({ onComplete }: LMSIntroAnimationProps) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="fixed inset-0 z-[9999] bg-white flex items-center justify-center overflow-hidden"
                onAnimationComplete={() => {
                    setTimeout(onComplete, 5000); // Show animation for 5 seconds
                }}
            >
                {/* Background Gradient Orbs */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-3xl"
                    />
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.1 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl"
                    />
                </div>

                <div className="relative z-10 flex flex-col items-center">
                    {/* Main Logo Container */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                            duration: 0.8,
                            ease: [0.34, 1.56, 0.64, 1], // Bounce effect
                        }}
                        className="relative mb-8"
                    >
                        {/* Outer Ring */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="absolute inset-0 -m-6"
                        >
                            <div className="w-32 h-32 rounded-full border-4 border-indigo-100" />
                        </motion.div>

                        {/* Pulsing Ring */}
                        <motion.div
                            initial={{ scale: 1, opacity: 0.5 }}
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute inset-0 -m-4"
                        >
                            <div className="w-28 h-28 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400" />
                        </motion.div>

                        {/* Main Icon */}
                        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600 flex items-center justify-center shadow-2xl">
                            <GraduationCap className="w-10 h-10 text-white" />
                        </div>

                        {/* Sparkle Decorations */}
                        <motion.div
                            initial={{ scale: 0, rotate: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="absolute -top-2 -right-2"
                        >
                            <Sparkles className="w-6 h-6 text-amber-400 fill-amber-400" />
                        </motion.div>
                    </motion.div>

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent mb-2">
                            AI INST Academy
                        </h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.8, duration: 0.6 }}
                            className="text-slate-500 text-lg font-medium"
                        >
                            Learning Management System
                        </motion.p>
                    </motion.div>

                    {/* Floating Icons */}
                    <div className="absolute inset-0 pointer-events-none">
                        {/* Left Icon - Book */}
                        <motion.div
                            initial={{ opacity: 0, x: -50, y: 50 }}
                            animate={{ opacity: 0.2, x: 0, y: 0 }}
                            transition={{ delay: 1.4, duration: 1, ease: "easeOut" }}
                            className="absolute left-1/4 top-1/3"
                        >
                            <BookOpen className="w-12 h-12 text-indigo-400" />
                        </motion.div>

                        {/* Right Icon - Award */}
                        <motion.div
                            initial={{ opacity: 0, x: 50, y: -50 }}
                            animate={{ opacity: 0.2, x: 0, y: 0 }}
                            transition={{ delay: 1.8, duration: 1, ease: "easeOut" }}
                            className="absolute right-1/4 bottom-1/3"
                        >
                            <Award className="w-12 h-12 text-purple-400" />
                        </motion.div>
                    </div>

                    {/* Loading Bar */}
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "240px" }}
                        transition={{ delay: 2.4, duration: 0.8 }}
                        className="mt-12 h-1.5 bg-slate-100 rounded-full overflow-hidden"
                    >
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 2.8, duration: 1.8, ease: "easeInOut" }}
                            className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 rounded-full"
                        />
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
