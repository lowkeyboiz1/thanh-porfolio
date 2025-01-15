import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'

const GridBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  const textScale = useTransform(scrollYProgress, [0, 1], [3, 200])
  const textOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play()
    }
  }, [])

  return (
    <div ref={containerRef} className='h-[150vh]'>
      <div className='sticky top-0 flex min-h-screen items-center justify-center overflow-hidden bg-white text-black'>
        <motion.div className='absolute inset-0 flex items-center justify-center' style={{ scale: textScale, opacity: textOpacity }}>
          <h1 className='text-8xl font-bold tracking-wider text-black'>VIKA</h1>
        </motion.div>
      </div>
    </div>
  )
}

export default GridBackground
