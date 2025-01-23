'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const getGoogleAuthUrl = () => {
    const url = 'https://accounts.google.com/o/oauth2/auth'
    const query = {
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
      response_type: 'code',
      scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'].join(' '),
      prompt: 'consent'
    }
    const queryString = new URLSearchParams(query).toString()
    return `${url}?${queryString}`
  }

  return (
    <div className='relative min-h-screen overflow-hidden bg-black'>
      <div className='bg-grid-white/[0.02] absolute inset-0 bg-[size:50px_50px]' />
      <div className='absolute -left-1/2 top-0 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-indigo-500/30 to-transparent blur-3xl' />
      <div className='absolute -right-1/2 bottom-0 h-[600px] w-[600px] rounded-full bg-gradient-to-l from-purple-500/30 to-transparent blur-3xl' />

      <div className='relative flex min-h-screen items-center justify-center p-4'>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className='w-full max-w-md overflow-hidden rounded-2xl backdrop-blur-xl'>
          <div className='relative space-y-8 bg-zinc-900/70 p-8'>
            <div className='absolute left-1/2 top-0 h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent' />
            <div className='absolute bottom-0 left-0 h-px w-1/2 bg-gradient-to-r from-purple-500 via-indigo-500 to-transparent' />

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className='space-y-6'>
              <h2 className='text-center text-3xl font-bold tracking-tight text-white'>Welcome Back</h2>
              <p className='text-center text-sm text-zinc-400'>Sign in to access your dashboard</p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className='flex justify-center'>
              <Link href={getGoogleAuthUrl()} className='flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-100'>
                <svg className='h-5 w-5' viewBox='0 0 24 24'>
                  <path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' fill='#4285F4' />
                  <path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='#34A853' />
                  <path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' fill='#FBBC05' />
                  <path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='#EA4335' />
                </svg>
                Login with Google
              </Link>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className='text-center text-xs text-zinc-500'>
              By signing in, you agree to our Terms of Service and Privacy Policy
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
