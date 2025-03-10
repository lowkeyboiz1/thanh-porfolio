'use client'

import React, { FC, ReactNode, useRef } from 'react'
import { motion, MotionValue, useScroll, useTransform } from 'motion/react'

import { cn } from '@/lib/utils'

interface TextRevealByWordProps {
  text: string
  className?: string
}

export const TextRevealByWord: FC<TextRevealByWordProps> = ({ text, className }) => {
  const targetRef = useRef<HTMLDivElement | null>(null)

  const { scrollYProgress } = useScroll({
    target: targetRef
  })

  const words = text.split(' ')
  const lineBreakAfter = ['that', 'spirit,', 'also'] // Array of words after which to add line break
  const textsHighlighted = ['tell', 'stories', 'impact.', 'leave', 'lasting', 'a']

  return (
    <div ref={targetRef} className={cn('relative z-0 h-[150vh]', className)}>
      <div className={'sticky top-20 mx-auto flex h-[50%] max-w-6xl items-center bg-transparent'}>
        <p ref={targetRef} className={'flex flex-wrap items-center justify-center p-5 text-4xl font-bold text-black/20 dark:text-white/20 md:text-5xl lg:text-6xl xl:text-7xl'}>
          {words.map((word, i) => {
            const start = i / words.length
            const end = start + 1 / words.length
            const isHighlighted = textsHighlighted.includes(word) && i !== 2
            return (
              <React.Fragment key={word + '-' + i}>
                <Word progress={scrollYProgress} range={[start, end]} isHighlighted={isHighlighted}>
                  {word}
                </Word>
                {lineBreakAfter.includes(word) && <span className='block w-full' />}
              </React.Fragment>
            )
          })}
        </p>
      </div>
    </div>
  )
}

interface WordProps {
  children: ReactNode
  progress: MotionValue<number>
  range: [number, number]
  isHighlighted?: boolean
}

const Word: FC<WordProps> = ({ children, progress, range, isHighlighted }) => {
  const opacity = useTransform(progress, range, [0, 1])
  return (
    <span className='xl:lg-3 my:1 relative mx-1 lg:mx-3.5 lg:my-2'>
      <span className={'absolute opacity-30'}>{children}</span>
      <motion.span style={{ opacity: opacity }} className={cn('text-black dark:text-white', isHighlighted && 'text-blue-500 dark:text-blue-500')}>
        {children}
      </motion.span>
    </span>
  )
}

export default TextRevealByWord
