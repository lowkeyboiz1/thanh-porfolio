'use client'

import React from 'react'
import { motion, type AnimationProps, type HTMLMotionProps } from 'motion/react'
import { cn } from '@/lib/utils'

const animationProps = {
  initial: { '--x': '100%', scale: 0.8 },
  animate: { '--x': '-100%', scale: 1 },
  whileTap: { scale: 0.95 },
  transition: {
    repeat: Infinity,
    repeatType: 'loop',
    repeatDelay: 1,
    type: 'spring',
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: 'spring',
      stiffness: 200,
      damping: 5,
      mass: 0.5
    }
  }
} as AnimationProps

interface ShinyButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode
  className?: string
  ref?: React.Ref<HTMLButtonElement>
}

const ShinyButton = React.forwardRef<HTMLButtonElement, ShinyButtonProps>(({ children, className, ...props }, ref) => {
  return (
    <motion.button
      ref={ref}
      {...animationProps}
      {...props}
      className={cn(
        'relative rounded-lg px-6 py-2 font-medium backdrop-blur-xl transition-shadow duration-300 ease-in-out hover:shadow dark:bg-[radial-gradient(circle_at_50%_0%,rgba(0,100,255,0.1)_0%,transparent_60%)] dark:hover:shadow-[0_0_20px_rgba(0,100,255,0.2)]',
        className
      )}
    >
      <span
        className='relative block size-full text-sm uppercase tracking-wide text-[rgb(0,0,0,65%)] dark:font-light dark:text-[rgb(255,255,255,90%)]'
        style={{
          maskImage: 'linear-gradient(-75deg, #0066cc calc(var(--x) + 20%), transparent calc(var(--x) + 30%), #0066cc calc(var(--x) + 100%))',
          WebkitMaskImage: 'linear-gradient(-75deg, #0066cc calc(var(--x) + 20%), transparent calc(var(--x) + 30%), #0066cc calc(var(--x) + 100%))'
        }}
      >
        {children}
      </span>
      <span
        style={{
          mask: 'linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box,linear-gradient(rgb(0,0,0), rgb(0,0,0))',
          WebkitMaskComposite: 'destination-out',
          maskComposite: 'exclude'
        }}
        className='absolute inset-0 z-10 block rounded-[inherit] bg-[linear-gradient(-75deg,#0066cc_calc(var(--x)+20%),#0077cc_calc(var(--x)+50%),#0088cc_calc(var(--x)+100%))] p-px'
      ></span>
    </motion.button>
  )
})

ShinyButton.displayName = 'ShinyButton'

export default ShinyButton
