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

  return (
    <div className={`flex flex-col gap-10 bg-black text-white ${isCursorVisible ? 'cursor-none' : 'cursor-default'} `}>
      <Header />
      <Hero />
      <div className='flex flex-col gap-4'>
        <div className='z-10 flex min-h-64 items-center justify-center'>
          <TextRevealByWord text='Driven by a dedicated spirit, I strive to create films that not only tell stories but also leave a lasting impact' />
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
