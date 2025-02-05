'use client'

import { motion, MotionValue, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'

const CardsStack = ({ data }: { data: { title: string; description: string; color: string; courses: string[]; role: string; year: string; image: string }[] }) => {
  const container = useRef(null)

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  })

  if (!data) return null

  return (
    <main ref={container} className='page'>
      {data.map((card, i) => {
        const targetScale = 1 - (data.length - i) * 0.05
        return <Card key={i} {...card} index={i} length={data.length} progress={scrollYProgress} range={[i * ((data.length - 1) / 100), 1]} targetScale={targetScale} image={card.image} />
      })}
    </main>
  )
}

const Card = ({
  title,
  description,
  color,
  courses,
  index,
  length,
  progress,
  range,
  targetScale,
  image
}: {
  title: string
  description: string
  color: string
  courses: string[]
  index: number
  length: number
  progress: MotionValue<number>
  range: number[]
  targetScale: number
  image: string
}) => {
  const scale = useTransform(progress, range, [1, targetScale])
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  const imageScale = useTransform(scrollYProgress, [0, 0.5], [2, 1])
  return (
    <motion.div
      ref={containerRef}
      style={{ scale, top: `calc(-7vh + ${index * (100 / length - 1)}px)`, zIndex: index }}
      className={`sticky flex h-dvh w-full items-center justify-center px-4 md:px-0`}
    >
      <div className={`max-h-1/2 mx-auto flex flex-col overflow-hidden rounded-2xl 2xl:gap-8 ${color} gap-4 border border-gray-700 p-6 lg:p-10 2xl:p-10`}>
        <p className='text-center text-2xl font-bold text-white md:text-3xl lg:text-4xl 2xl:my-2'>{title}</p>
        <div className='grid h-fit gap-4 md:grid-cols-2 md:gap-6'>
          <div className='flex flex-col gap-4'>
            <p className='text-base text-gray-300 md:text-lg'>{description}</p>
            <ul className='list-inside list-disc space-y-1'>
              {courses.map((course, i) => (
                <li key={i} className='text-sm text-gray-300 md:text-base'>
                  {course}
                </li>
              ))}
            </ul>
          </div>
          <div className='overflow-hidden rounded-2xl'>
            <motion.div style={{ scale: imageScale }} className='mx-auto size-full w-auto overflow-hidden rounded-2xl p-10 md:p-20'>
              <Image src={image} alt={image} width={500} height={500} className='size-full object-cover object-center' />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CardsStack
