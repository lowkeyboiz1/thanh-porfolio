'use client'

import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'

const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.05
    })

    const raf = (time: number) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])
}

export default useLenis
