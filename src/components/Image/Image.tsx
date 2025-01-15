'use client'
import React from 'react'
import { IKImage } from 'imagekitio-next'

interface ImageProps {
  path: string
  width: number
  height: number
  alt: string
}

const Image = (props: ImageProps) => {
  const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT
  return <IKImage urlEndpoint={urlEndpoint} {...props} className='pointer-events-none select-none' loading='lazy' lqip={{ active: true, quality: 20 }} />
}

export default Image
