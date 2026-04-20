import { type NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/better-auth";

const protectedRoutes = [
    "/dashboard",
];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get session from Better Auth
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    const isAuthenticated = !!session?.user;

    // Redirect authenticated users away from login page
    if (isAuthenticated && pathname === "/login") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Check if route is protected
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route),
    );

    // Redirect unauthenticated users from protected routes
    if (!isAuthenticated && isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/login",
        "/dashboard/:path*",
    ],
};