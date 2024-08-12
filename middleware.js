import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // Redirect based on authentication status and requested path
    if (!token) {
        // Allow access to the homepage for login
        if (pathname === "/") {
            return NextResponse.next();
        }

        // Restrict access to task api routes if not logged in
        if (pathname.startsWith("/api/tasks")) {
            return NextResponse.json(
                { message: "Unauthorized access" },
                { status: 401 }
            );
        }
        // Redirect to homepage if not logged in and accessing other pages
        return NextResponse.redirect(new URL("/", req.url));
    } else {
        // Redirect to tasks page if logged in and accessing homepage
        if (pathname === "/") {
            return NextResponse.redirect(new URL("/tasks", req.url));
        }
    }

    // Allow access to other routes
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/tasks",
        "/tasks/:path*",
        "/api/tasks",
        "/api/tasks/:path*",
    ],
};