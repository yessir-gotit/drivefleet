import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const protectedRoutes = ["/dashboard"];

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const response = await fetch(`${API_URL}/api/auth/get-session`, {
      headers: { cookie: request.headers.get("cookie") || "" },
    });

    if (!response.ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}
