"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function StudentLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            // Save user data to localStorage
            localStorage.setItem("lms_user", JSON.stringify({
                ...data.user,
                isAuth: true
            }));

            // Redirect based on role
            if (data.user.role === 'admin') {
                router.push("/portal/admin");
            } else if (redirectUrl) {
                router.push(redirectUrl);
            } else {
                router.push("/portal/student");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]"
            >
                {/* Left Side - Branding */}
                <div className="w-full md:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />
                    </div>

                    <div className="relative z-10">
                        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight mb-12">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            AI INST Academy
                        </Link>

                        <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                            Welcome Back!
                        </h2>
                        <p className="text-slate-400 leading-relaxed text-lg">
                            Continue your learning journey and pick up right where you left off.
                        </p>
                    </div>

                    <div className="relative z-10 mt-8">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 text-center border border-white/10">
                                <div className="text-2xl font-bold text-white">50+</div>
                                <div className="text-xs text-slate-400">Courses</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 text-center border border-white/10">
                                <div className="text-2xl font-bold text-white">10K+</div>
                                <div className="text-xs text-slate-400">Students</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 text-center border border-white/10">
                                <div className="text-2xl font-bold text-white">4.9</div>
                                <div className="text-xs text-slate-400">Rating</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 bg-white flex items-center">
                    <div className="max-w-md mx-auto w-full">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Student Login</h1>
                        <p className="text-slate-500 mb-8">
                            Don't have an account?{" "}
                            <Link href="/student-register" className="text-indigo-600 font-medium hover:underline">
                                Register
                            </Link>
                        </p>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-sm font-medium text-slate-700">Password</label>
                                    <a href="#" className="text-sm text-indigo-600 hover:underline">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all pr-12"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Logging In...
                                    </>
                                ) : (
                                    <>
                                        Log In <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
