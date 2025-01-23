import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

export async function middleware(request: NextRequest) {
  const userToken = request.cookies.get('user')?.value

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!userToken) {
      // Nếu không có token, chuyển hướng đến trang đăng nhập
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    try {
      // Use jose for token verification
      const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET_KEY)
      await jose.jwtVerify(userToken, secret)
    } catch (err) {
      console.error('Invalid token:', err)
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
