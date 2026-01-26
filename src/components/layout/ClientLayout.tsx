"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ClientLayout({
    children,
    isLMS = false
}: {
    children: React.ReactNode;
    isLMS?: boolean;
}) {
    const pathname = usePathname();

    // Pages where Navbar/Footer should be hidden
    const hideNavPaths = [
        "/portal",
        "/student-register",
        "/student-login",
        "/lms"
    ];

    // Check if current path starts with any hidden path
    const shouldHideNav = isLMS || hideNavPaths.some(path => pathname?.startsWith(path));

    return (
        <>
            {!shouldHideNav && <Navbar />}
            {children}
            {!shouldHideNav && <Footer />}
        </>
    );
}
