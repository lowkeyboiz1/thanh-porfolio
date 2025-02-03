'use client'

import { useScroll, motion, useTransform, MotionValue } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'

const CardsStack = () => {
  const container = useRef(null)

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  })

  const cards = [
    {
      title: 'Video Production',
      description: 'I have a passion for creating engaging and visually stunning videos that tell stories and captivate audiences.',
      color: 'bg-[#1E293B]'
    },
    {
      title: 'Creative Direction',
      description: 'Bringing visions to life through innovative storytelling and artistic direction.',
      color: 'bg-[#334155]'
    },
    {
      title: 'Post Production',
      description: 'Expert editing, color grading, and visual effects to enhance your video content.',
      color: 'bg-[#475569]'
    },
    {
      title: 'Commercial Production',
      description: 'Creating impactful commercial content that drives engagement and results.',
      color: 'bg-[#64748B]'
    },
    {
      title: 'Documentary Filmmaking',
      description: 'Telling authentic stories through compelling documentary-style videos.',
      color: 'bg-[#94A3B8]'
    }
  ]

  return (
    <main ref={container} className='page'>
      {cards.map((card, i) => {
        const targetScale = 1 - (cards.length - i) * 0.05
        return <Card key={i} {...card} index={i} length={cards.length} progress={scrollYProgress} range={[i * ((cards.length - 1) / 100), 1]} targetScale={targetScale} />
      })}
    </main>
  )
}

const Card = ({
  title,
  description,
  color,
  index,
  length,
  progress,
  range,
  targetScale
}: {
  title: string
  description: string
  color: string
  index: number
  length: number
  progress: MotionValue<number>
  range: number[]
  targetScale: number
}) => {
  const scale = useTransform(progress, range, [1, targetScale])
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end center']
  })

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1])

  return (
    <motion.div ref={containerRef} style={{ scale, top: `calc(-7vh + ${index * (100 / length - 1)}px)` }} className={`sticky flex h-dvh w-full items-center justify-center px-4 md:px-0`}>
      <div className={`flex h-[50%] w-full flex-col rounded-2xl 2xl:gap-6 ${color} gap-2 border border-gray-700 p-6 2xl:p-10`}>
        <p className='text-center text-2xl font-bold text-white md:text-3xl lg:text-4xl 2xl:my-2'>{title}</p>
        <div className='mb-6 grid size-full grid-cols-1 gap-4 md:mb-12 xl:grid-cols-3 2xl:gap-6'>
          <p className='text-sm text-gray-300 md:text-base'>{description}</p>
          <div className='col-span-1 size-full h-[calc(100%-70px)] overflow-hidden rounded-2xl xl:col-span-2 xl:h-[calc(100%-110px)]'>
            <motion.div style={{ scale: imageScale }} className='size-full'>
              <Image src='/hero.jpg' alt='card1' width={500} height={500} className='size-full object-cover object-center' />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CardsStack
