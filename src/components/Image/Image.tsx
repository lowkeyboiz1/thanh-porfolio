'use client'
import React from 'react'
import { IKImage } from 'imagekitio-next'
import { cn } from '@/lib/utils'

interface ImageProps {
  path: string
  width: number
  height: number
  alt: string
  className?: string
}

const Image = (props: ImageProps) => {
  const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT
  return <IKImage urlEndpoint={urlEndpoint} {...props} className={cn('pointer-events-none select-none', props.className)} loading='lazy' lqip={{ active: true, quality: 20 }} />
}

export default Image
