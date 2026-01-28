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
    CreditCard,
    FolderOpen,
    Award,
    ChevronRight,
    Grid
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertProvider } from "@/components/ui/AlertService";
import LMSIntroAnimation from "@/components/LMSIntroAnimation";
import WelcomeModal from "@/components/WelcomeModal";

interface User {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'admin';
    avatar?: string;
    enrolledCourses?: any[];
}

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showIntro, setShowIntro] = useState(true);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);

    useEffect(() => {
        // Auth check
        const userStr = localStorage.getItem("lms_user");
        if (!userStr) {
            router.push("/student-login");
            return;
        }

        try {
            const userData = JSON.parse(userStr);
            setUser(userData);

            // Fetch latest user data to sync avatar
            fetch(`/api/student/profile?userId=${userData.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.user) {
                        const updatedUser = {
                            ...userData,
                            avatar: data.user.avatar
                        };
                        setUser(updatedUser);
                        localStorage.setItem("lms_user", JSON.stringify(updatedUser));
                    }
                })
                .catch(err => console.error("Failed to sync profile", err));

        } catch {
            router.push("/student-login");
            return;
        }

        setIsLoading(false);

        // Responsive: close sidebar on mobile
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    }, [router]);

    // Check if welcome modal should be shown (first-time user)
    const handleIntroComplete = () => {
        setShowIntro(false);

        // Check if this is first time user (welcome not shown before)
        const welcomeShown = localStorage.getItem("lms_welcome_shown");
        if (!welcomeShown && user?.role === 'student') {
            // Small delay for smooth transition after intro
            setTimeout(() => {
                setShowWelcomeModal(true);
            }, 500);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("lms_user");
        router.push("/student-login");
    };

    // Navigation items based on role
    const studentNavItems = [
        { name: "Dashboard", href: "/portal/student", icon: LayoutDashboard },
        { name: "My Courses", href: "/portal/student/courses", icon: BookOpen },
        { name: "Course Catalog", href: "/portal/student/catalog", icon: Grid },
        { name: "Certificates", href: "/portal/student/certificates", icon: Award },
        { name: "Settings", href: "/portal/student/settings", icon: Settings },
    ];

    const adminNavItems = [
        { name: "Dashboard", href: "/portal/admin", icon: LayoutDashboard },
        { name: "Manage Courses", href: "/portal/admin/courses", icon: FolderOpen },
        { name: "Classroom", href: "/portal/admin/classroom", icon: GraduationCap },
        { name: "Students", href: "/portal/admin/students", icon: Users },
        { name: "Payments", href: "/portal/admin/payments", icon: CreditCard },
        { name: "Settings", href: "/portal/admin/settings", icon: Settings },
    ];

    const navItems = user?.role === 'admin' ? adminNavItems : studentNavItems;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <AlertProvider>
            {/* Intro Animation */}
            {showIntro && <LMSIntroAnimation onComplete={handleIntroComplete} />}

            {/* Welcome Modal for First-Time Users */}
            <AnimatePresence>
                {showWelcomeModal && (
                    <WelcomeModal
                        userName={user?.name?.split(' ')[0] || 'Student'}
                        onClose={() => setShowWelcomeModal(false)}
                    />
                )}
            </AnimatePresence>

            <div className="min-h-screen bg-slate-50 flex">
                {/* Sidebar Overlay for Mobile */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-20 md:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    )}
                </AnimatePresence>

                {/* Sidebar */}
                <AnimatePresence mode="wait">
                    {isSidebarOpen && (
                        <motion.aside
                            initial={{ x: -280, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -280, opacity: 0 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="fixed md:sticky top-0 left-0 z-30 h-screen w-[280px] bg-slate-900 text-white flex flex-col"
                        >
                            {/* Logo */}
                            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                                <Link href="/" className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                        <GraduationCap className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="font-bold text-lg">AI INST Academy</span>
                                </Link>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Navigation */}
                            <div className="flex-1 overflow-y-auto py-6 px-4">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-3">
                                    {user.role === 'admin' ? 'Administration' : 'Learning'}
                                </p>
                                <nav className="space-y-1">
                                    {navItems.map((item) => {
                                        const isActive = pathname === item.href ||
                                            (item.href !== '/portal/student' && item.href !== '/portal/admin' && pathname?.startsWith(item.href));
                                        return (
                                            <Link key={item.href} href={item.href}>
                                                <motion.div
                                                    whileHover={{ x: 4 }}
                                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
                                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                                        }`}
                                                >
                                                    <item.icon size={20} />
                                                    <span className="font-medium">{item.name}</span>
                                                    {isActive && <ChevronRight size={16} className="ml-auto" />}
                                                </motion.div>
                                            </Link>
                                        );
                                    })}
                                </nav>


                            </div>

                            {/* User Profile & Logout */}
                            <div className="p-4 border-t border-slate-800">
                                <div className="flex items-center gap-3 mb-4 px-2">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-slate-700" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center font-bold text-sm text-white">
                                            {user.name?.charAt(0) || 'U'}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{user.name}</p>
                                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <LogOut size={18} />
                                    <span className="font-medium text-sm">Sign Out</span>
                                </button>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-h-screen">
                    {/* Top Header */}
                    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                            >
                                <Menu size={20} />
                            </button>
                            <div>
                                <p className="text-sm text-slate-500">
                                    Welcome back, <span className="text-slate-900 font-semibold">{user.name}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500">
                                <Bell size={20} />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                            </button>
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center font-bold text-white text-sm">
                                    {user.name?.charAt(0) || 'U'}
                                </div>
                            )}
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 p-6 md:p-8 overflow-auto">
                        {children}
                    </main>
                </div>
            </div>
        </AlertProvider>
    );
}

