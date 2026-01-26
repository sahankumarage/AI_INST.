import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const hostname = request.headers.get("host");
    const { pathname } = request.nextUrl;

    // Check if the hostname is the LMS domain
    // Using includes to be safe, but exact match is "learn.aiinst.io"
    const isLMS = hostname?.includes("learn.aiinst.io");

    if (isLMS) {
        // If the path is an asset or API, let it pass (handled by matcher partially, but good to be safe)
        if (
            !pathname.startsWith("/api") &&
            !pathname.startsWith("/_next") &&
            !pathname.includes(".") // Exclude files like robot.txt, images, etc.
        ) {
            // Allow access to login/register without rewriting to /portal explicitly
            if (pathname.startsWith("/student-login") || pathname.startsWith("/student-register")) {
                return NextResponse.next();
            }

            // If the user accesses /portal directly on the subdomain, let it be (valid path)
            // Or usually, we might want to strip it, but for safety, if the path *starts* with /portal,
            // we don't need to PREPEND /portal again.
            if (pathname.startsWith("/portal")) {
                return NextResponse.next();
            }

            // Rewrite everything else to serve from /portal
            // e.g. /dashboard -> /portal/dashboard
            // e.g. / -> /portal
            return NextResponse.rewrite(new URL(`/portal${pathname === "/" ? "" : pathname}`, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
