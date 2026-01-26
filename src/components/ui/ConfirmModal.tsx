"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, HelpCircle, X, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
    title: string;
    message: string;
    type?: 'delete' | 'warning' | 'confirm';
    confirmLabel?: string;
    cancelLabel?: string;
}

const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring" as const, damping: 25, stiffness: 300 }
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        y: 20,
        transition: { duration: 0.2 }
    }
};

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
};

const typeConfig = {
    delete: {
        icon: Trash2,
        iconBg: "bg-gradient-to-br from-red-500 to-rose-600",
        confirmBg: "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700",
        confirmShadow: "shadow-red-200"
    },
    warning: {
        icon: AlertTriangle,
        iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
        confirmBg: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
        confirmShadow: "shadow-amber-200"
    },
    confirm: {
        icon: HelpCircle,
        iconBg: "bg-gradient-to-br from-indigo-500 to-purple-600",
        confirmBg: "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700",
        confirmShadow: "shadow-indigo-200"
    }
};

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = 'confirm',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel'
}: ConfirmModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const config = typeConfig[type];
    const Icon = config.icon;

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            console.error("Confirm action failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen && !isLoading) {
            onClose();
        }
    }, [isOpen, isLoading, onClose]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={!isLoading ? onClose : undefined}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <X size={20} />
                        </button>

                        {/* Content */}
                        <div className="p-6 pt-8">
                            {/* Icon */}
                            <div className="flex justify-center mb-6">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", delay: 0.1, damping: 15 }}
                                    className={`w-16 h-16 ${config.iconBg} rounded-2xl flex items-center justify-center shadow-lg`}
                                >
                                    <Icon className="w-8 h-8 text-white" />
                                </motion.div>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
                                {title}
                            </h3>

                            {/* Message */}
                            <p className="text-slate-500 text-center mb-8 leading-relaxed">
                                {message}
                            </p>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50"
                                >
                                    {cancelLabel}
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={isLoading}
                                    className={`flex-1 px-6 py-3 ${config.confirmBg} text-white rounded-xl font-semibold shadow-lg ${config.confirmShadow} transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        confirmLabel
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Decorative gradient line */}
                        <div className={`h-1 ${config.confirmBg}`} />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// Hook for easier usage
export function useConfirmModal() {
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'delete' | 'warning' | 'confirm';
        confirmLabel: string;
        cancelLabel: string;
        onConfirm: () => Promise<void> | void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'confirm',
        confirmLabel: 'Confirm',
        cancelLabel: 'Cancel',
        onConfirm: () => { }
    });

    const showConfirm = (options: {
        title: string;
        message: string;
        type?: 'delete' | 'warning' | 'confirm';
        confirmLabel?: string;
        cancelLabel?: string;
        onConfirm: () => Promise<void> | void;
    }) => {
        setModalState({
            isOpen: true,
            title: options.title,
            message: options.message,
            type: options.type || 'confirm',
            confirmLabel: options.confirmLabel || 'Confirm',
            cancelLabel: options.cancelLabel || 'Cancel',
            onConfirm: options.onConfirm
        });
    };

    const closeModal = () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
    };

    const ConfirmModalComponent = () => (
        <ConfirmModal
            isOpen={modalState.isOpen}
            onClose={closeModal}
            onConfirm={modalState.onConfirm}
            title={modalState.title}
            message={modalState.message}
            type={modalState.type}
            confirmLabel={modalState.confirmLabel}
            cancelLabel={modalState.cancelLabel}
        />
    );

    return {
        showConfirm,
        closeModal,
        ConfirmModal: ConfirmModalComponent
    };
}
