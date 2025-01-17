'use client'

import Tiktok from '@/assets/Icons/tiktok.svg'
import { Cover } from '@/components/Cover'
import { MagneticWrapper } from '@/components/MagneticWrapper'
import HyperText from '@/components/ui/hyper-text'
import ScratchToReveal from '@/components/ui/scratch-to-reveal'
import ShinyButton from '@/components/ui/shiny-button'
import { useCursorStore } from '@/store/useCursorStore'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import { Facebook, Github, Instagram } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'

const Hero = () => {
  const { toggleCursor, isCursorVisible } = useCursorStore()
  const containerRef = useRef(null)
  const socialLinks = [
    {
      name: 'Github',
      url: 'https://github.com/lowkeyboiz1',
      icon: Github
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/lvkhang_',
      icon: Instagram
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/lowkeyboiz1',
      icon: Facebook
    },
    {
      name: 'Tiktok',
      url: 'https://www.tiktok.com/@sheepcutee',
      icon: Tiktok // Keep the imported Tiktok SVG here
    }
  ]

  const handleMouseOver = () => {
    if (!isCursorVisible) return
    toggleCursor(false)
  }

  const handleMouseLeave = () => {
    if (isCursorVisible) return
    toggleCursor(true)
  }

  const handleComplete = () => {
    if (!containerRef.current) return
    const rect = (containerRef.current as HTMLDivElement).getBoundingClientRect()

    const defaults = {
      spread: 360,
      ticks: 50,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
    }

    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ['star'],
      origin: {
        x: (rect.left + rect.right) / 2 / window.innerWidth,
        y: (rect.top + rect.bottom) / 2 / window.innerHeight
      }
    })

    confetti({
      ...defaults,
      particleCount: 30,
      scalar: 0.75,
      shapes: ['circle'],
      origin: {
        x: (rect.left + rect.right) / 2 / window.innerWidth,
        y: (rect.top + rect.bottom) / 2 / window.innerHeight
      }
    })
  }

  return (
    <div
      id='home'
      className='grid items-start justify-center gap-10 page lg:grid-cols-3 lg:justify-start lg:py-10 2xl:space-y-10 2xl:py-44'
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className='col-span-2 2xl:space-y-6'>
        <h1 className='3xl:7xl relative z-20 mt-6 max-w-7xl bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 bg-clip-text py-6 text-4xl font-semibold text-transparent dark:from-neutral-800 dark:via-white dark:to-white md:text-4xl lg:text-5xl xl:text-6xl'>
          Hi, I&apos;m <Cover>Vika</Cover>, <br />a{' '}
          <span className='relative'>
            <span className='text-white'>Frontend Developer</span>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className='absolute -bottom-1 left-0 h-2 rounded-full bg-default bg-gradient-to-r from-default to-[#ff8c00]'
            />
          </span>
        </h1>
        <motion.div
          ref={containerRef}
          className='relative w-full'
          initial={{ opacity: 0, x: -100, scale: 0.5, rotate: -45 }}
          animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className='flex w-full items-center justify-center overflow-hidden rounded-2xl border-2 lg:hidden'>
            <div className='size-full'>
              <Image src='/hero.jpg' alt='hero' width={360} height={360} className='size-full object-cover' />
            </div>
          </div>
        </motion.div>
        <div className='flex items-center gap-5'>
          {socialLinks.map((link) => (
            <MagneticWrapper key={link.name}>
              <Link href={link.url} target='_blank' className='group p-10'>
                {link.name === 'Tiktok' ? (
                  <div className='size-[26px]'>
                    <Image src={link.icon} alt='Tiktok Icon' width={30} height={30} className='size-full duration-200 group-hover:text-default' />
                  </div>
                ) : (
                  <link.icon className='size-[30px] duration-200 group-hover:text-default' />
                )}
              </Link>
            </MagneticWrapper>
          ))}
        </div>
        <ShinyButton className='px-10 py-4'>
          <HyperText delay={500} duration={400} className='text-xl'>
            Let&apos;s talk
          </HyperText>
        </ShinyButton>
      </motion.div>
      <motion.div
        ref={containerRef}
        className='relative w-full'
        initial={{ opacity: 0, y: -100, scale: 0.5, rotate: -45 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
        transition={{ duration: 0.4 }}
      >
        <ScratchToReveal
          width={360}
          height={360}
          minScratchPercentage={70}
          className='hidden w-full items-center justify-center overflow-hidden rounded-2xl border-2 lg:flex'
          onComplete={handleComplete}
          gradientColors={['#FFA07A', '#FFA68D', '#FFD39B']}
        >
          <div className='size-full'>
            <Image src='/hero.jpg' alt='hero' width={360} height={360} className='size-full object-cover' />
          </div>
        </ScratchToReveal>
      </motion.div>
    </div>
  )
}

export default Hero
