'use client'

import React, { useState, useRef } from 'react'
import { ImageKitProvider } from 'imagekitio-next'
import { Image } from '../Image'
import { uploadFiles } from '@/lib/upload'

const authenticator = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/auth`)

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

const Upload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [uploadedFiles, setUploadedFiles] = useState<Array<{ url: string; uuid: string }>>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      setSelectedFiles(Array.from(files))
    }
  }

  const onError = (err: any) => {
    console.error('Error', err)
  }

  const onSubmit = async () => {
    try {
      const uploadedResults = await uploadFiles(selectedFiles)

      // Update the uploaded files state
      setUploadedFiles((prev) => [...prev, ...uploadedResults])

      // Clear selected files after successful upload
      setSelectedFiles([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      alert('Files uploaded successfully!')
    } catch (error: any) {
      console.error('Upload error:', error.message)
      alert(`Upload error: ${error.message}`)
    }
  }

  return (
    <div>
      <input type='file' ref={fileInputRef} onChange={handleFileChange} multiple accept='image/*' />
      <div>
        <h3>Selected Files: {selectedFiles.length}</h3>
        <div>
          {selectedFiles.map((file, index) => (
            <p key={index}>{file.name}</p>
          ))}
        </div>
      </div>
      <div>
        <h3>Uploaded Files:</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {uploadedFiles.map((file, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <Image path={file.url} alt={`Uploaded file ${index + 1}`} width={100} height={100} />
              <p style={{ fontSize: '12px', wordBreak: 'break-word' }}>URL: {file.url}</p>
              <p style={{ fontSize: '12px', wordBreak: 'break-word' }}>UUID: {file.uuid}</p>
            </div>
          ))}
        </div>
      </div>
      <button onClick={onSubmit}>Upload Files</button>
    </div>
  )
}

export default Upload
