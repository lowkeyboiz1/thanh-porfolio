'use client'

import { Donations } from '@/components/Donations'
import { Hero } from '@/components/Hero'
import CenteredPixelTransition from '@/components/Menu/CenteredPixelTransition'
import Menu from '@/components/Menu/Menu'
import { MySkills } from '@/components/MySkills'
import { Projects } from '@/components/Projects'
import TextRevealByWord from '@/components/ui/text-reveal'
import { useIsMobile } from '@/hooks/use-mobile'
import useLenis from '@/hooks/useLenis'
import { Header } from '@/layouts/header'
import { useCursorStore } from '@/store/useCursorStore'
import { useEffect, useState } from 'react'

export default function Home() {
  useLenis()
  const { isCursorVisible } = useCursorStore()
  const isMobile = useIsMobile()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [slowPosition, setSlowPosition] = useState({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!isCursorVisible || isMobile) return

    let timeout: NodeJS.Timeout
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event
      setPosition({ x: clientX, y: clientY })
      // Smoothly update the slower position
      timeout = setTimeout(() => {
        setSlowPosition({ x: clientX, y: clientY })
      }, 50) // Adjust the delay for the slower speed
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(timeout)
    }
  }, [isCursorVisible, isMobile])

  const updateDimensions = () => {
    const { innerWidth, innerHeight } = window

    setDimensions({ width: innerWidth, height: innerHeight })
  }

  useEffect(() => {
    updateDimensions()

    window.addEventListener('resize', updateDimensions)

    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  return (
    <div className={`flex flex-col gap-10 bg-black text-white ${isCursorVisible ? 'cursor-none' : 'cursor-default'} `}>
      <Menu />
      {dimensions.height > 0 && <CenteredPixelTransition dimensions={dimensions} />}
      {isCursorVisible && !isMobile && (
        <>
          <div
            className='pointer-events-none fixed z-[130] h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white'
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`
            }}
          />
          <div
            className='pointer-events-none fixed z-[130] size-10 -translate-x-1/2 -translate-y-1/2 transform rounded-full border-[0.5px] border-[#6f6f6f]'
            style={{
              left: `${slowPosition.x}px`,
              top: `${slowPosition.y}px`
            }}
          />
        </>
      )}
      <Header />
      <Hero />
      <div className='flex flex-col gap-4'>
        <div className='z-10 flex min-h-64 items-center justify-center'>
          <TextRevealByWord text='My mission is to bridge the gap between design and development, ensuring a harmonious and cohesive user experience.' />
        </div>
      </div>
      <MySkills />
      <div className='flex flex-col gap-4'>
        <div className='z-10 flex min-h-64 items-center justify-center'>
          <TextRevealByWord text='I have a strong obsession for attention to detail.' />
        </div>
      </div>
      <Projects />
      <Donations />
    </div>
  )
}
