'use client'

import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
const MagneticWrapper = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e
    const { width, height, left, top } = ref.current?.getBoundingClientRect() ?? { width: 0, height: 0, left: 0, top: 0 }
    const x = clientX - (left + width / 2)
    const y = clientY - (top + height / 2)
    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  const { x, y } = position

  return (
    <motion.div ref={ref} transition={{ type: 'spring', stiffness: 100, damping: 15, mass: 0.1 }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} animate={{ x, y }}>
      {children}
    </motion.div>
  )
}

export default MagneticWrapper
