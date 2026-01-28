"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, Rocket, X, ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";

interface ConfettiPiece {
    id: number;
    x: number;
    delay: number;
    duration: number;
    color: string;
    size: number;
    rotation: number;
}

// Confetti Component - Lighter version
function Confetti() {
    const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

    useEffect(() => {
        const colors = [
            "#0284c7", "#38bdf8", "#0ea5e9", "#7dd3fc",
            "#f0abfc", "#c084fc", "#fbbf24", "#34d399",
        ];

        const newPieces: ConfettiPiece[] = [];
        const pieceCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 40 : 60;
        for (let i = 0; i < pieceCount; i++) {
            newPieces.push({
                id: i,
                x: Math.random() * 100,
                delay: Math.random() * 0.3,
                duration: 2 + Math.random() * 1.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 5 + Math.random() * 5,
                rotation: Math.random() * 360,
            });
        }
        setPieces(newPieces);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[60]">
            {pieces.map((piece) => (
                <motion.div
                    key={piece.id}
                    initial={{ x: `${piece.x}vw`, y: -20, rotate: 0, opacity: 1 }}
                    animate={{ y: "110vh", rotate: piece.rotation + 720, opacity: [1, 1, 0] }}
                    transition={{ duration: piece.duration, delay: piece.delay, ease: "easeOut" }}
                    style={{
                        position: "absolute",
                        width: piece.size,
                        height: piece.size,
                        backgroundColor: piece.color,
                        borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                    }}
                />
            ))}
        </div>
    );
}

interface WelcomeModalProps {
    userName: string;
    onClose: () => void;
}

export default function WelcomeModal({ userName, onClose }: WelcomeModalProps) {
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = useCallback(() => {
        localStorage.setItem("lms_welcome_shown", "true");
        onClose();
    }, [onClose]);

    return (
        <>
            {showConfetti && <Confetti />}

            {/* Modal Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={handleClose}
            >
                {/* Compact Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={16} />
                    </button>

                    {/* Gradient Header - Compact */}
                    <div className="relative bg-gradient-to-br from-sky-500 to-blue-600 px-6 py-5 text-center overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute -top-10 -left-10 w-24 h-24 bg-white/10 rounded-full" />
                        <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-white/10 rounded-full" />

                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                            className="relative z-10 w-14 h-14 bg-white rounded-xl shadow-lg mx-auto mb-3 flex items-center justify-center"
                        >
                            <GraduationCap className="w-7 h-7 text-sky-600" />
                        </motion.div>

                        {/* Welcome Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative z-10"
                        >
                            <h2 className="text-lg font-bold text-white">
                                Welcome, {userName}! 🎉
                            </h2>
                            <p className="text-sky-100 text-xs mt-1">
                                You're now part of AI_INST. Academy
                            </p>
                        </motion.div>
                    </div>

                    {/* Body - Compact */}
                    <div className="p-5">
                        {/* Message */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-center text-slate-600 text-sm mb-4"
                        >
                            Start your AI journey with Sri Lanka's largest AI education platform! 🚀
                        </motion.p>

                        {/* Quick Features - Inline */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.35 }}
                            className="flex justify-center gap-4 mb-5 text-xs text-slate-500"
                        >
                            <span className="flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Expert Courses
                            </span>
                            <span className="flex items-center gap-1">
                                <Rocket className="w-3.5 h-3.5 text-sky-500" /> Hands-On Projects
                            </span>
                        </motion.div>

                        {/* CTA Buttons - Stacked */}
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-2"
                        >
                            <Link
                                href="/portal/student/catalog"
                                onClick={handleClose}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold text-sm shadow-md shadow-sky-500/25 hover:shadow-lg hover:shadow-sky-500/30 transition-all"
                            >
                                Explore Courses
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <button
                                onClick={handleClose}
                                className="w-full px-4 py-2.5 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
                            >
                                Continue to Dashboard
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
}
