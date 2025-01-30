'use client'

import { Contact } from '@/components/Contact'
import { Education } from '@/components/Education'
import { Hero } from '@/components/Hero'
import { MySkills } from '@/components/MySkills'
import { Projects } from '@/components/Projects'
import TextRevealByWord from '@/components/ui/text-reveal'
import useLenis from '@/hooks/useLenis'
import { Header } from '@/layouts/header'
import { useCursorStore } from '@/store/useCursorStore'

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
      <Education />
      <MySkills />
      <div className='flex flex-col gap-4'>
        <div className='z-10 flex min-h-64 items-center justify-center'>
          <TextRevealByWord text='I have a strong obsession for attention to detail.' />
        </div>
      </div>
      <Projects />
      <Contact />
    </div>
  )
}
