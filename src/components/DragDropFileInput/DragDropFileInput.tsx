'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'

interface DragDropFileInputProps {
  onFileChange: (file: File) => void
  error?: string
}

export function DragDropFileInput({ onFileChange, error }: DragDropFileInputProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        onFileChange(file)
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    },
    [onFileChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    multiple: false
  })

  return (
    <div className='space-y-2'>
      <Label htmlFor='add-image'>Image</Label>
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'} ${error ? 'border-red-500' : ''} `}
      >
        <input {...getInputProps()} id='add-image' name='image' />
        {imagePreview ? (
          <div className='mt-2'>
            <Image src={imagePreview || '/placeholder.svg'} alt='Preview' width={100} height={100} className='mx-auto max-w-xs rounded-lg' />
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-4'>
            <Plus className='mb-2 h-12 w-12 text-gray-400' />
            <p className='text-sm text-gray-500'>{isDragActive ? 'Drop the image here' : 'Drag & drop an image here, or click to select'}</p>
          </div>
        )}
      </div>
      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  )
}
