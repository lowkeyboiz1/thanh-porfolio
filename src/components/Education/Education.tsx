'use client'

import { motion } from 'framer-motion'
import React from 'react'
import CardsStack from '@/components/CardsStack'

const Education = () => {
  return (
    <motion.div id='education' className='flex flex-col gap-8 py-24 page lg:gap-14'>
      <div className='space-y-2'>
        <div className='gradient-text text-4xl font-bold xl:text-6xl'>Education</div>
        <div className='mt-2 max-w-sm text-lg font-medium leading-[1.25] md:max-w-lg xl:text-2xl xl:leading-[2]'>
          The foundation of my vision. Explore the educational journey that has shaped my creative perspective.
        </div>
      </div>
      <CardsStack />
    </motion.div>
  )
}

export default Education
