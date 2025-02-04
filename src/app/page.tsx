'use client'

import CardsStack from '@/components/CardsStack'
import { Contact } from '@/components/Contact'
import { Education } from '@/components/Education'
import { Hero } from '@/components/Hero'
import { Menu } from '@/components/Menu'
import { CenteredPixelTransition } from '@/components/Menu'
import { MySkills } from '@/components/MySkills'
import { Projects } from '@/components/Projects'
import TextRevealByWord from '@/components/ui/text-reveal'
import { WorkExperience } from '@/components/WorkExperience'
import { useIsMobile } from '@/hooks/use-mobile'
import useLenis from '@/hooks/useLenis'
import { Header } from '@/layouts/header'
import { useEffect } from 'react'
import { useCursorStore } from '@/store/useCursorStore'
import { useState } from 'react'
import { useMousePosition } from '@/hooks/useMousePosition'

export default function Home() {
  useLenis()
  const { isCursorVisible } = useCursorStore()
  const isMobile = useIsMobile()
  const { position, slowPosition } = useMousePosition()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

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
    <div className={`flex flex-col gap-4 bg-black text-white xl:gap-10 ${isCursorVisible ? 'cursor-none' : 'cursor-default'} `}>
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
          <TextRevealByWord text='Driven by a dedicated spirit, I strive to create films that not only tell stories but also leave a lasting impact.' />
        </div>
      </div>
      <Education />
      <MySkills />
      <WorkExperience />
      <Projects />
      <Contact />
    </div>
  )
}
