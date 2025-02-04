import { useCursorStore } from '@/store/useCursorStore'
import { useEffect, useState } from 'react'
import { useIsMobile } from './use-mobile'

export const useMousePosition = () => {
  const { isCursorVisible } = useCursorStore()
  const isMobile = useIsMobile()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [slowPosition, setSlowPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (isMobile) return

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

  return { position, slowPosition }
}
