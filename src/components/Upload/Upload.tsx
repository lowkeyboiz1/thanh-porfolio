'use client'
import React from 'react'
import { IKUpload, ImageKitProvider } from 'imagekitio-next'

const authenticator = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/auth')

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Request failed with status ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    const { signature, expire, token } = data
    return { signature, expire, token }
  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}`)
  }
}

const onError = (err: any) => {
  console.log('Error', err)
}

const onSuccess = (res: any) => {
  console.log('Success', res)
}

const onUploadProgress = (progress: any) => {
  console.log('Progress', progress)
}

const Upload = () => {
  const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT
  const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY

  return (
    <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint}>
      <IKUpload useUniqueFileName urlEndpoint={urlEndpoint} authenticator={authenticator} onError={onError} onSuccess={onSuccess} onUploadProgress={onUploadProgress} />
    </ImageKitProvider>
  )
}

export default Upload
