'use client'
import { IKVideo } from 'imagekitio-next'

const Video = (props: any) => {
  const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT
  return <IKVideo urlEndpoint={urlEndpoint} {...props} />
}

export default Video
