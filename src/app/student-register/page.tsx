"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const courseSlug = searchParams?.get("course");
    const courseName = searchParams?.get("name");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    courseSlug,
                    courseName
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Registration failed");
            }

            // Save user data to localStorage
            localStorage.setItem("lms_user", JSON.stringify({
                ...data.user,
                isAuth: true
            }));

            // Redirect to portal
            router.push("/portal/student");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white flex items-center">
            <div className="max-w-md mx-auto w-full">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Create Your Account</h1>
                <p className="text-slate-500 mb-8">
                    Already have an account?{" "}
                    <Link href="/student-login" className="text-indigo-600 font-medium hover:underline">
                        Log in
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

                {courseSlug && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl text-sm flex items-center gap-2"
                    >
                        <GraduationCap className="w-5 h-5" />
                        <span>You'll be enrolled in <strong>{courseName || courseSlug}</strong> after registration</span>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                            <input
                                type="text"
                                required
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                placeholder="John"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                            <input
                                type="text"
                                required
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                placeholder="Doe"
                            />
                        </div>
                    </div>

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
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                minLength={6}
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
                        <p className="text-xs text-slate-400 mt-2">Must be at least 6 characters</p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Creating Account...
                            </>
                        ) : (
                            <>
                                Get Started <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-xs text-slate-400">
                    By registering, you agree to our{" "}
                    <a href="#" className="underline hover:text-slate-600">Terms of Service</a> and{" "}
                    <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
}

export default function StudentRegisterPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[650px]"
            >
                {/* Left Side - Branding */}
                <div className="w-full md:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />
                        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-cyan-500 rounded-full blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2" />
                    </div>

                    <div className="relative z-10">
                        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight mb-12">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            AI Academy
                        </Link>

                        <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                            Start Your AI<br />Learning Journey
                        </h2>
                        <p className="text-slate-400 leading-relaxed text-lg">
                            Join thousands of students mastering AI skills through our industry-leading courses.
                        </p>
                    </div>

                    <div className="relative z-10 mt-8">
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0  relative">
                                    <Image
                                        src="/images/founder.jpg"
                                        alt="Sahan Kumarage"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="text-slate-200 italic leading-relaxed">
                                        "AI Academy is more than a platform; it's a movement. We are empowering the next generation of innovators to build the autonomous, intelligent systems that will define our future."
                                    </p>
                                    <p className="mt-3 font-semibold">Sahan Kumarage</p>
                                    <p className="text-sm text-slate-400">Founder, AI INST</p>
                                    <div className="mt-3 pt-3 border-t border-white/10">
                                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Powered by AI INST</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <Suspense fallback={
                    <div className="w-full md:w-1/2 p-12 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                }>
                    <RegisterForm />
                </Suspense>
            </motion.div>
        </main>
    );
}
