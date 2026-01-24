"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PortalRedirect() {
    const router = useRouter();

    useEffect(() => {
        const userStr = localStorage.getItem("lms_user");
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.role === "admin") {
                    router.push("/portal/admin");
                } else {
                    router.push("/portal/student");
                }
            } catch {
                router.push("/student-login");
            }
        } else {
            router.push("/student-login");
        }
    }, [router]);

    return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
    );
}
