import { AnimatedMenuToggle } from '@/components/AnimatedMenuToggle'
import { useIsMobile } from '@/hooks/use-mobile'
import { useState } from 'react'
import Image from 'next/image'
import { useEffect } from 'react'
import { useCursorStore } from '@/store/useCursorStore'
import { Menu, CenteredPixelTransition } from '@/components/Menu'

const Header = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const isMobile = useIsMobile()
  const { isCursorVisible } = useCursorStore()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [slowPosition, setSlowPosition] = useState({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!isCursorVisible || isMobile) return

    let timeout: NodeJS.Timeout
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event
      setPosition({ x: clientX, y: clientY })
      // Smoothly update the slower position
      timeout = setTimeout(() => {
        setSlowPosition({ x: clientX, y: clientY })
      }, 50) // Adjust the delay for the slower speed
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(timeout)
    }
  }, [isCursorVisible, isMobile])

  const updateDimensions = () => {
    const { innerWidth, innerHeight } = window

    setDimensions({ width: innerWidth, height: innerHeight })
  }

  useEffect(() => {
    updateDimensions()

    window.addEventListener('resize', updateDimensions)

    return () => window.removeEventListener('resize', updateDimensions)
  }, [])
  return (
    <>
      <Menu />
      {dimensions.height > 0 && <CenteredPixelTransition dimensions={dimensions} />}
      {isCursorVisible && !isMobile && (
        <>
          <div
            className='pointer-events-none fixed z-[130] h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white'
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`
            }}
          />
          <div
            className='pointer-events-none fixed z-[130] size-10 -translate-x-1/2 -translate-y-1/2 transform rounded-full border-[0.5px] border-[#6f6f6f]'
            style={{
              left: `${slowPosition.x}px`,
              top: `${slowPosition.y}px`
            }}
          />
        </>
      )}
      <header className='sticky top-0 z-[120] pt-2 backdrop-blur-sm page flex-between xl:pt-8'>
        <div onClick={handleScrollToTop} className='size-16 xl:w-20'>
          <Image src='/logo.png' alt='vika dev logo' width={100} height={100} className='size-full object-cover' />
        </div>
        <AnimatedMenuToggle />
      </header>
    </>
  )
}

export default Header
