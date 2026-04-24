// It is like a middleware to get the token

import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function proxy(request: NextRequest) {

  const token = await getToken({
    req: request,
    secret: process.env.BETTER_AUTH_SECRET
  })

  const url = request.nextUrl

  // If logged in user tries auth pages
  if (token &&
    (
      url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify')
    )
  ) {
    return NextResponse.redirect(new URL('/dashboard'))
  }

  // If guest tries dashboard
  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in',
      request.url))
  }
  return NextResponse.next()

}

export const config = { // to which path this proxy/middleware file should run
  matcher: [
    "/sign-in",
    "/sign-up",
    "/",
    "/dashboard/:path*",
    "/verify/:path*"
  ]
}

