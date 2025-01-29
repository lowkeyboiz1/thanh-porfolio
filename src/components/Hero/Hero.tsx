'use client'

import Tiktok from '@/assets/Icons/tiktok.svg'
import { Linkedin, Mail } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MagneticWrapper } from '@/components/MagneticWrapper'
import ShinyButton from '@/components/ui/shiny-button'
import HyperText from '@/components/ui/hyper-text'

const Hero = () => {
  const socialLinks = [
    {
      name: 'Gmail',
      url: 'tranquangthanh808@gmail.com',
      icon: Mail
    },
    {
      name: 'LinkedIn',
      url: 'linkedin.com/in/tranquangthanh-videographer',
      icon: Linkedin
    },
    {
      name: 'Tiktok',
      url: 'https://www.tiktok.com/@sheepcutee',
      icon: Tiktok
    }
  ]

  return (
    <div className='grid w-full justify-center py-28 page lg:grid-cols-2'>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} className='flex flex-col'>
        <div className='flex flex-col gap-2'>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.25, ease: 'easeOut' }}
            className='mb-2 text-lg font-medium text-blue-500 sm:text-xl'
          >
            Hi, my name is
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.25, ease: 'easeOut' }}
            className='mb-4 text-4xl font-bold text-white sm:text-5xl md:text-6xl'
          >
            Tran Quang Thanh
          </motion.h1>
        </div>

        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.25, ease: 'easeOut' }}
          className='mb-8 font-mono text-xl text-gray-400 sm:text-2xl md:text-3xl'
        >
          I&apos;m a <TextUnderline delay={0.8} text='videographer' /> and <TextUnderline delay={1} text='video editor' /> based in Ho Chi Minh City.
        </motion.span>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8, ease: 'easeOut' }} className='flex flex-col gap-4'>
          <div className='flex gap-6'>
            {socialLinks.map((link, index) => (
              <motion.div key={link.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 + index * 0.1, duration: 0.8, ease: 'easeOut' }}>
                <MagneticWrapper>
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
              </motion.div>
            ))}
          </div>
          <div className='flex items-center justify-center lg:hidden'>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.4, duration: 0.8, ease: 'easeOut' }} className='size-[500px]'>
              <Image src='/test.png' alt='Hero' width={500} height={500} className='size-full rounded-lg object-cover' />
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.8, ease: 'easeOut' }}>
            <ShinyButton className='w-full px-6 py-2 lg:w-fit lg:px-10 lg:py-4'>
              <HyperText delay={500} duration={400} className='text-base lg:text-xl'>
                Let&apos;s collaborate!
              </HyperText>
            </ShinyButton>
          </motion.div>
        </motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2, duration: 1, ease: 'easeOut' }} className='hidden items-center justify-center lg:flex'>
        <div className='size-[500px]'>
          <Image src='/test.png' alt='Hero' width={500} height={500} className='size-full rounded-lg object-cover' />
        </div>
      </motion.div>
    </div>
  )
}

export default Hero

const TextUnderline = ({ text, delay }: { text: string; delay: number }) => {
  return (
    <p className='relative mb-4 inline-block w-fit font-bold'>
      {text}
      <motion.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay }}
        className='absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600'
        style={{ transformOrigin: 'left' }}
      />
    </p>
  )
}
