'use client'

import Tiktok from '@/assets/Icons/tiktok.svg'
import { Linkedin, Mail } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MagneticWrapper } from '@/components/MagneticWrapper'
import ShinyButton from '@/components/ui/shiny-button'
import HyperText from '@/components/ui/hyper-text'
import { useCursorStore } from '@/store/useCursorStore'
import { memo } from 'react'

const Hero = () => {
  const { isCursorVisible, toggleCursor } = useCursorStore()

  const socialLinks = [
    {
      name: 'Gmail',
      url: 'mailto:tranquangthanh808@gmail.com',
      icon: Mail
    },
    {
      name: 'LinkedIn',
      url: 'http://www.linkedin.com/in/tranquangthanh-videographer',
      icon: Linkedin
    },
    {
      name: 'Tiktok',
      url: 'https://www.tiktok.com/@kwantanchen.filmaholic',
      icon: Tiktok
    }
  ]

  const handleMouseOver = () => {
    if (!isCursorVisible) toggleCursor(false)
  }

  const handleMouseLeave = () => {
    if (!isCursorVisible) toggleCursor(true)
  }

  const fadeInUpAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' }
  }

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className='grid w-full justify-center py-14 page lg:grid-cols-3 2xl:py-28' onMouseEnter={handleMouseOver} onMouseLeave={handleMouseLeave}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} className='col-span-2 flex flex-col'>
        <div className='flex flex-col gap-2'>
          <motion.p {...fadeInUpAnimation} transition={{ ...fadeInUpAnimation.transition, delay: 0.2 }} className='mb-2 text-lg font-medium text-blue-500 sm:text-xl'>
            Hi, my name is
          </motion.p>

          <motion.h1 {...fadeInUpAnimation} transition={{ ...fadeInUpAnimation.transition, delay: 0.4 }} className='mb-4 text-4xl font-bold text-white sm:text-5xl md:text-6xl'>
            Tran Quang Thanh
          </motion.h1>
        </div>

        <motion.span {...fadeInUpAnimation} transition={{ ...fadeInUpAnimation.transition, delay: 0.6 }} className='mb-8 font-mono text-xl text-gray-400 sm:text-2xl md:text-3xl'>
          I&apos;m a <TextUnderline delay={0.8} text='videographer' /> and <TextUnderline delay={1} text='video editor' /> <br className='hidden md:block' /> based in Ho Chi Minh City.
        </motion.span>

        <motion.div {...fadeInUpAnimation} transition={{ ...fadeInUpAnimation.transition, delay: 0.8, duration: 0.5 }} className='flex flex-col gap-4'>
          <div className='flex gap-6'>
            {socialLinks.map((link, index) => (
              <motion.div key={link.name} {...fadeInUpAnimation} transition={{ ...fadeInUpAnimation.transition, delay: 1 + index * 0.1, duration: 0.5 }}>
                <MagneticWrapper>
                  <Link href={link.url} target='_blank' className='group p-10'>
                    {link.name === 'Tiktok' ? (
                      <div className='size-[26px]'>
                        <Image src={link.icon} alt='Tiktok Icon' width={30} height={30} className='size-full duration-300 group-hover:text-default' />
                      </div>
                    ) : (
                      <link.icon className='size-[30px] duration-300 group-hover:text-default' />
                    )}
                  </Link>
                </MagneticWrapper>
              </motion.div>
            ))}
          </div>

          <div className='flex items-center justify-center lg:hidden'>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2, duration: 0.5, ease: 'easeOut' }} className='size-full 2xl:size-[500px]'>
              <Image src='/test.png' alt='Hero' width={500} height={500} className='size-full rounded-lg object-cover' priority />
            </motion.div>
          </div>

          <motion.div {...fadeInUpAnimation} transition={{ ...fadeInUpAnimation.transition, delay: 1.4, duration: 0.5 }}>
            <ShinyButton className='w-full px-6 py-2 lg:w-fit lg:px-10 lg:py-4' onClick={scrollToContact}>
              <HyperText delay={300} duration={300} className='text-base lg:text-xl'>
                Let&apos;s collaborate!
              </HyperText>
            </ShinyButton>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40, y: 40 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
        className='hidden items-center justify-center lg:flex'
      >
        <div className='size-[500px]'>
          <Image src='/test.png' alt='Hero' width={500} height={500} className='size-full rounded-lg object-cover' priority />
        </div>
      </motion.div>
    </div>
  )
}

export default memo(Hero)

const TextUnderline = ({ text, delay }: { text: string; delay: number }) => {
  return (
    <p className='relative mb-4 inline-block w-fit font-bold'>
      {text}
      <motion.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay }}
        className='absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600'
        style={{ transformOrigin: 'left' }}
      />
    </p>
  )
}
