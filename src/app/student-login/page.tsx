"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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

            // Auto Login - Save user data
            localStorage.setItem("user", JSON.stringify({
                ...data.user,
                isAuth: true
            }));

            // Redirect based on role
            if (data.user.role === 'admin') {
                router.push("/portal/admin");
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

                        <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
                        <p className="text-slate-400 leading-relaxed mb-8">
                            Log in to continue your learning journey and access your enrolled courses.
                        </p>
                    </div>

                    <div className="relative z-10">
                        {/* Optional: Add testimonial or quote here */}
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-12 bg-white flex items-center">
                    <div className="max-w-md mx-auto w-full">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Student Login</h1>
                        <p className="text-slate-500 mb-8">Don't have an account? <Link href="/student-register" className="text-indigo-600 font-medium hover:underline">Register</Link></p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
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
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
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
                                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
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
            </div>
        </main>
    );
}
