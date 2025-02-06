'use client'

import Tiktok from '@/assets/Icons/tiktok.svg'
import { MagneticWrapper } from '@/components/MagneticWrapper'
import { motion } from 'framer-motion'
import { Linkedin, Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const fadeInUpAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
}

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

const SocialLinks = () => {
  return (
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
  )
}

export default SocialLinks
