import { NextResponse } from 'next/server'
import * as jose from 'jose'
import { toast } from 'sonner'
import { ApiError } from '@/lib/errors'
import { db } from '@/lib/db'
import { COLLECTION_USER_NAME } from '@/utils/constans'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  const validGmails = [process.env.NEXT_PUBLIC_SECRET_GMAIL_ADMIN1!, process.env.NEXT_PUBLIC_SECRET_GMAIL_ADMIN2!]
  if (!code) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  try {
    // Exchange code lấy về từ Google để lấy access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
        grant_type: 'authorization_code'
      })
    })

    const tokenData = await tokenResponse.json()

    // Lấy thông tin user từ Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`
      }
    })

    const userData = await userResponse.json()

    await db.collection(COLLECTION_USER_NAME).insertOne(userData)

    if (!validGmails.includes(userData.email)) {
      throw new ApiError('Unauthorized: Access denied')
    }
    // Create JWT token using jose
    const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET_KEY!)
    const token = await new jose.SignJWT(userData).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('1d').sign(secret)
    // Create response with cookie
    const response = NextResponse.redirect(new URL('/dashboard', request.url))
    response.cookies.set('user', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400 // 1 day
    })
    return response
  } catch (error) {
    console.error('Google auth error:', error)
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
}
