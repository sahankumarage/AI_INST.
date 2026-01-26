"use client";

import React, { createContext, useContext, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    Info,
    X,
    Loader2,
} from "lucide-react";

// Alert Types
type AlertType = "success" | "error" | "warning" | "info" | "loading";

interface Alert {
    id: string;
    type: AlertType;
    title: string;
    message?: string;
    duration?: number;
}

interface AlertContextType {
    showAlert: (alert: Omit<Alert, "id">) => string;
    dismissAlert: (id: string) => void;
    success: (title: string, message?: string) => string;
    error: (title: string, message?: string) => string;
    warning: (title: string, message?: string) => string;
    info: (title: string, message?: string) => string;
    loading: (title: string, message?: string) => string;
    apiSuccess: (action: string) => string;
    apiError: (action: string, errorMessage?: string) => string;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Custom hook to use the alert service
export function useAlert() {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within an AlertProvider");
    }
    return context;
}

// Alert icon based on type
const AlertIcon = ({ type }: { type: AlertType }) => {
    const iconProps = { size: 22, strokeWidth: 2.5 };

    switch (type) {
        case "success":
            return <CheckCircle {...iconProps} className="text-emerald-500" />;
        case "error":
            return <XCircle {...iconProps} className="text-red-500" />;
        case "warning":
            return <AlertTriangle {...iconProps} className="text-amber-500" />;
        case "info":
            return <Info {...iconProps} className="text-blue-500" />;
        case "loading":
            return <Loader2 {...iconProps} className="text-indigo-500 animate-spin" />;
        default:
            return <Info {...iconProps} className="text-blue-500" />;
    }
};

// Background gradient based on type
const getAlertStyles = (type: AlertType) => {
    switch (type) {
        case "success":
            return "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 shadow-emerald-100/50";
        case "error":
            return "bg-gradient-to-r from-red-50 to-rose-50 border-red-200 shadow-red-100/50";
        case "warning":
            return "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 shadow-amber-100/50";
        case "info":
            return "bg-gradient-to-r from-blue-50 to-sky-50 border-blue-200 shadow-blue-100/50";
        case "loading":
            return "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-indigo-100/50";
        default:
            return "bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200 shadow-slate-100/50";
    }
};

// Individual Alert Component
const AlertItem = ({
    alert,
    onDismiss,
}: {
    alert: Alert;
    onDismiss: () => void;
}) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`
                relative flex items-start gap-3 p-4 pr-10 rounded-xl border
                shadow-lg backdrop-blur-sm min-w-[320px] max-w-[420px]
                ${getAlertStyles(alert.type)}
            `}
        >
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
                <AlertIcon type={alert.type} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-800 text-sm leading-tight">
                    {alert.title}
                </h4>
                {alert.message && (
                    <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                        {alert.message}
                    </p>
                )}
            </div>

            {/* Close Button */}
            {alert.type !== "loading" && (
                <button
                    onClick={onDismiss}
                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/5 transition-colors"
                >
                    <X size={14} className="text-slate-400" />
                </button>
            )}

            {/* Progress bar for auto-dismiss */}
            {alert.type !== "loading" && (
                <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: (alert.duration || 4000) / 1000, ease: "linear" }}
                    className={`
                        absolute bottom-0 left-0 h-1 rounded-b-xl
                        ${alert.type === "success" ? "bg-emerald-400" : ""}
                        ${alert.type === "error" ? "bg-red-400" : ""}
                        ${alert.type === "warning" ? "bg-amber-400" : ""}
                        ${alert.type === "info" ? "bg-blue-400" : ""}
                    `}
                />
            )}
        </motion.div>
    );
};

// Alert Provider Component
export function AlertProvider({ children }: { children: React.ReactNode }) {
    const [alerts, setAlerts] = useState<Alert[]>([]);

    const generateId = () => `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const showAlert = useCallback((alert: Omit<Alert, "id">) => {
        const id = generateId();
        const newAlert: Alert = {
            id,
            duration: alert.duration || 4000,
            ...alert,
        };

        setAlerts((prev) => [...prev, newAlert]);

        // Auto dismiss (except for loading alerts)
        if (alert.type !== "loading") {
            setTimeout(() => {
                setAlerts((prev) => prev.filter((a) => a.id !== id));
            }, newAlert.duration);
        }

        return id;
    }, []);

    const dismissAlert = useCallback((id: string) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, []);

    const success = useCallback((title: string, message?: string) => {
        return showAlert({ type: "success", title, message });
    }, [showAlert]);

    const error = useCallback((title: string, message?: string) => {
        return showAlert({ type: "error", title, message, duration: 5000 });
    }, [showAlert]);

    const warning = useCallback((title: string, message?: string) => {
        return showAlert({ type: "warning", title, message });
    }, [showAlert]);

    const info = useCallback((title: string, message?: string) => {
        return showAlert({ type: "info", title, message });
    }, [showAlert]);

    const loading = useCallback((title: string, message?: string) => {
        return showAlert({ type: "loading", title, message });
    }, [showAlert]);

    // Convenience methods for API calls
    const apiSuccess = useCallback((action: string) => {
        return success(`${action} successful!`, "Your changes have been saved.");
    }, [success]);

    const apiError = useCallback((action: string, errorMessage?: string) => {
        return error(`${action} failed`, errorMessage || "Please try again later.");
    }, [error]);

    return (
        <AlertContext.Provider
            value={{
                showAlert,
                dismissAlert,
                success,
                error,
                warning,
                info,
                loading,
                apiSuccess,
                apiError,
            }}
        >
            {children}

            {/* Alert Container */}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3">
                <AnimatePresence mode="popLayout">
                    {alerts.map((alert) => (
                        <AlertItem
                            key={alert.id}
                            alert={alert}
                            onDismiss={() => dismissAlert(alert.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </AlertContext.Provider>
    );
}

// Export a wrapper for the api fetch that automatically shows alerts
export function useApiWithAlerts() {
    const alert = useAlert();

    const apiFetch = useCallback(
        async <T = unknown>(
            url: string,
            options?: RequestInit & {
                successMessage?: string;
                errorMessage?: string;
                showSuccess?: boolean;
                showError?: boolean;
                showLoading?: boolean;
                loadingMessage?: string;
            }
        ): Promise<{ data: T | null; error: string | null; response: Response | null }> => {
            const {
                successMessage = "Operation completed",
                errorMessage = "Operation failed",
                showSuccess = true,
                showError = true,
                showLoading = true,
                loadingMessage = "Processing...",
                ...fetchOptions
            } = options || {};

            let loadingId: string | null = null;

            try {
                // Show loading alert
                if (showLoading) {
                    loadingId = alert.loading(loadingMessage, "Please wait...");
                }

                const response = await fetch(url, fetchOptions);
                const data = await response.json();

                // Dismiss loading
                if (loadingId) {
                    alert.dismissAlert(loadingId);
                }

                if (!response.ok) {
                    const errMsg = data.error || data.message || errorMessage;
                    if (showError) {
                        alert.error(errorMessage, errMsg);
                    }
                    return { data: null, error: errMsg, response };
                }

                if (showSuccess) {
                    alert.success(successMessage, data.message || "Changes saved successfully.");
                }

                return { data, error: null, response };
            } catch (err) {
                // Dismiss loading
                if (loadingId) {
                    alert.dismissAlert(loadingId);
                }

                const errMsg = err instanceof Error ? err.message : "An unexpected error occurred";
                if (showError) {
                    alert.error(errorMessage, errMsg);
                }
                return { data: null, error: errMsg, response: null };
            }
        },
        [alert]
    );

    return { apiFetch, ...alert };
}
