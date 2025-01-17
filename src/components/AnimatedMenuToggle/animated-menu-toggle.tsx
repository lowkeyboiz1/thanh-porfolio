'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useMenuStore } from '@/store/useMenuStore'
import { useCursorStore } from '@/store/useCursorStore'
import { useIsMobile } from '@/hooks/use-mobile'

const AnimatedMenuToggle = () => {
  const { isMenuOpen, toggleMenu } = useMenuStore()
  const { toggleCursor } = useCursorStore()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [buttonHeight, setButtonHeight] = useState<number>(48)
  const [isClickable, setIsClickable] = useState(true)
  const isMobile = useIsMobile()
  const topLineVariants = {
    closed: { rotate: 0, translateY: 0 },
    open: { rotate: 45, translateY: buttonHeight / (isMobile ? 8 : 4) }
  }

  const middleLineVariants = {
    closed: { opacity: 1, x: 0 },
    open: { opacity: 0, x: isMobile ? 50 : 100 }
  }

  const bottomLineVariants = {
    closed: { rotate: 0, translateY: 0 },
    open: { rotate: -45, translateY: -buttonHeight / 4 }
  }

  useEffect(() => {
    const updateHeight = () => {
      if (buttonRef.current) {
        setButtonHeight(buttonRef.current.offsetHeight) // Set the height dynamically
      }
    }

    updateHeight() // Set the initial height
    window.addEventListener('resize', updateHeight) // Update height on window resize

    return () => {
      window.removeEventListener('resize', updateHeight) // Clean up event listener
    }
  }, [isMobile])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto'
  }, [isMenuOpen])

  const handleToggle = () => {
    if (!isClickable) return

    setIsClickable(false)
    toggleMenu(!isMenuOpen)

    if (isMenuOpen) {
      toggleCursor(false)
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setIsClickable(true)
    }, 500)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <button
      ref={buttonRef}
      className='z-[120] flex size-12 flex-col items-center justify-center gap-0.5 pr-2 xl:pr-0'
      onClick={handleToggle}
      aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
      style={{ pointerEvents: isClickable ? 'auto' : 'none' }}
    >
      <motion.div className='mb-1.5 h-px w-8 rounded-full bg-white xl:h-1 xl:w-10' variants={topLineVariants} animate={isMenuOpen ? 'open' : 'closed'} transition={{ duration: 0.3 }} />
      <motion.div className='mb-1.5 h-px w-8 rounded-full bg-white xl:h-1 xl:w-10' variants={middleLineVariants} animate={isMenuOpen ? 'open' : 'closed'} transition={{ duration: 0.3 }} />
      <motion.div className='h-px w-8 rounded-full bg-white xl:h-1 xl:w-10' variants={bottomLineVariants} animate={isMenuOpen ? 'open' : 'closed'} transition={{ duration: 0.3 }} />
    </button>
  )
}

export default AnimatedMenuToggle
