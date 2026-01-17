"use client";

import { motion } from "framer-motion";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const courseSlug = searchParams?.get("course");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.type === "password" ? "password" : e.target.getAttribute("name") || ""]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                    courseSlug
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Registration failed");
            }

            // Auto Login - Save user data
            localStorage.setItem("user", JSON.stringify({
                ...data.user,
                isAuth: true
            }));

            // Redirect
            router.push("/portal/student");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full md:w-1/2 p-12 bg-white flex items-center">
            <div className="max-w-md mx-auto w-full">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Create Account</h1>
                <p className="text-slate-500 mb-8">Already have an account? <Link href="/student-login" className="text-indigo-600 font-medium hover:underline">Log in</Link></p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                            <input
                                type="text"
                                name="firstName"
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
                                name="lastName"
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
                            name="email"
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
                                name="password"
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
                        <p className="text-xs text-slate-400 mt-2">Must be at least 8 characters</p>
                    </div>

                    {courseSlug && (
                        <div className="p-3 bg-indigo-50 text-indigo-700 text-sm rounded-lg border border-indigo-100">
                            Enrolling in pending course after registration.
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
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

                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-400">
                        By clicking "Get Started", you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

                {/* Left Side - Visual */}
                <div className="w-full md:w-1/2 bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />
                    </div>

                    <div className="relative z-10">
                        <Link href="/" className="text-2xl font-bold tracking-tight mb-8 block">
                            AI Institute
                        </Link>

                        <h2 className="text-3xl font-bold mb-4">Join the Future of AI Learning</h2>
                        <p className="text-slate-400 leading-relaxed mb-8">
                            Create your student account to access premium courses, live sessions, and our exclusive community of AI pioneers.
                        </p>
                    </div>

                    <div className="relative z-10">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
                            <p className="text-sm font-medium italic text-slate-200">
                                "The courses here completely transformed my career. I went from zero to deploying my own AI apps in just 8 weeks."
                            </p>
                            <div className="mt-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
                                <div>
                                    <div className="font-bold text-sm">Sarah J.</div>
                                    <div className="text-xs text-slate-400">Full Stack Developer</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Suspense fallback={<div className="w-full md:w-1/2 p-12 flex justify-center items-center"><Loader2 className="animate-spin" /></div>}>
                    <RegisterForm />
                </Suspense>
            </div>
        </main>
    );
}
