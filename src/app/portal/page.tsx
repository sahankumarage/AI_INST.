"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PortalRedirect() {
    const router = useRouter();

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.role === "admin") {
                router.push("/portal/admin");
            } else {
                router.push("/portal/student");
            }
        } else {
            router.push("/register");
        }
    }, [router]);

    return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );
}
