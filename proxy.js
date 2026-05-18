
import { NextResponse } from 'next/server'

export async function proxy(request) {
  const { pathname } = request.nextUrl
  const protectedRoutes = ['/dashboard']

  if (protectedRoutes.some(route => pathname.startsWith(route))) {

    const response = await fetch('http://localhost:5000/api/auth/get-session', {
      headers: { cookie: request.headers.get('cookie') || '' }
    })
    
    if (!response.ok) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}
