"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Settings,
    LogOut,
    GraduationCap,
    Menu,
    X,
    Bell,
    CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>("");

    useEffect(() => {
        // AUTH CHECK (Simulated)
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            router.push("/register"); // Redirect to Auth if not logged in
        } else {
            const user = JSON.parse(userStr);
            setUserRole(user.role || "student");
            setUserName(user.name || "Student");
        }

        // Responsive sidebar
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        router.push("/");
    };

    // Navigation Items based on Role
    const navItems = userRole === "admin" ? [
        { name: "Dashboard", href: "/portal/admin", icon: LayoutDashboard },
        { name: "Courses Manager", href: "/portal/admin/courses", icon: BookOpen },
        { name: "Students", href: "/portal/admin/students", icon: Users },
        { name: "Settings", href: "/portal/admin/settings", icon: Settings },
    ] : [
        { name: "My Dashboard", href: "/portal/student", icon: LayoutDashboard },
        { name: "My Courses", href: "/portal/student/courses", icon: BookOpen },
        { name: "Certificates", href: "/portal/student/certificates", icon: GraduationCap },
        { name: "Settings", href: "/portal/student/settings", icon: Settings },
    ];

    if (!userRole) return null; // or Loading Spinner

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <AnimatePresence mode="wait">
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 280, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="fixed md:relative z-30 h-screen bg-slate-900 text-white flex flex-col border-r border-slate-800"
                    >
                        <div className="p-6 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-lg tracking-tight">LMS Portal</span>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="md:hidden ml-auto text-slate-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                            <div className="mb-6 px-2">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Menu</p>
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link key={item.href} href={item.href}>
                                            <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                                                <item.icon size={20} />
                                                <span className="font-medium">{item.name}</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Demo Admin Toggle  */}
                            {/* In a real app, this wouldn't exist, but helpful for demo switching */}
                            <div className="px-2 mt-auto">
                                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                                    <p className="text-xs text-slate-400 mb-2">Role Switcher (Demo)</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                const newUser = { name: "Admin User", role: "admin", isAuth: true };
                                                localStorage.setItem("user", JSON.stringify(newUser));
                                                window.location.reload();
                                            }}
                                            className={`flex-1 py-1 px-2 text-xs rounded-lg ${userRole === 'admin' ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'}`}
                                        >
                                            Admin
                                        </button>
                                        <button
                                            onClick={() => {
                                                const newUser = { name: "Student User", role: "student", isAuth: true };
                                                localStorage.setItem("user", JSON.stringify(newUser));
                                                window.location.reload();
                                            }}
                                            className={`flex-1 py-1 px-2 text-xs rounded-lg ${userRole === 'student' ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'}`}
                                        >
                                            Student
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-800">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-400 transition-colors w-full"
                            >
                                <LogOut size={20} />
                                <span className="font-medium">Sign Out</span>
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20">
                    <div className="flex items-center gap-4">
                        {!isSidebarOpen && (
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                            >
                                <Menu size={20} />
                            </button>
                        )}
                        <h2 className="text-sm font-medium text-slate-500">
                            Welcome back, <span className="text-slate-900 font-bold">{userName}</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-sm font-bold text-slate-600">
                            {userName.charAt(0)}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
