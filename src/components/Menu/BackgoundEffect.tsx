import { useMenuStore } from '@/store/useMenuStore'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BackgoundEffect = () => {
  const { isMenuOpen } = useMenuStore()

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div className={`pointer-events-none fixed inset-0 z-[100] flex items-center justify-center`}>
          <motion.div
            initial={{ scale: 0, borderRadius: '100%' }}
            animate={{
              scale: 1,
              borderRadius: '0%'
            }}
            exit={{
              scale: 0,
              borderRadius: '100%'
            }}
            transition={{
              duration: 0.5,
              ease: 'easeInOut'
            }}
            className='h-dvh w-full bg-black/40'
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
export default BackgoundEffect
