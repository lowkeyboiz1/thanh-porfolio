'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Loading() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2000) // Shows loading for minimum 2 seconds

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black'>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className='flex flex-col items-center gap-4'
      >
        <div className='h-16 w-16 animate-spin rounded-full border-4 border-white border-t-transparent' />
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='text-lg text-white'>
          Loading...
        </motion.p>
      </motion.div>
    </div>
  )
}
