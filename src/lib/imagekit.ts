import { v4 as uuidv4 } from 'uuid'
import { objectToFormData } from '@/utils/objectToFormData'
interface AuthResponse {
  signature: string
  expire: string
  token: string
}

interface UploadResult {
  url: string
  uuid: string
  fileId: string
}

const authenticator = async (): Promise<AuthResponse> => {
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

export const uploadFiles = async (files: File[]): Promise<UploadResult[]> => {
  if (files.length === 0) {
    throw new Error('Please select at least one file first.')
  }

  const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY!

  // Create FormData for each file and upload them concurrently
  const uploadPromises = files.map(async (file) => {
    // Generate a unique identifier using UUID v4
    const uuid = uuidv4()
    const fileName = `${uuid}`
    const auth = await authenticator()

    const formData = objectToFormData({
      file: file,
      fileName: fileName,
      signature: auth.signature,
      token: auth.token,
      expire: auth.expire,
      publicKey: publicKey
    })

    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`)
    }

    const result = await response.json()
    return { url: result.url, uuid, fileId: result.fileId }
  })

  // Wait for all uploads to complete
  return Promise.all(uploadPromises)
}

export const deleteFile = async (fileId: string) => {
  if (!fileId) {
    throw new Error('FileId is required')
  }

  // Create base64 encoded auth string from private key
  const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY!
  const authString = Buffer.from(`${privateKey}:`).toString('base64')

  const url = `https://api.imagekit.io/v1/files/${fileId}`
  const options = {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${authString}`
    }
  }

  try {
    const response = await fetch(url, options)

    return response
  } catch (error: any) {
    throw new Error(`Delete failed: ${error.message}`)
  }
}

export const getAllFiles = async () => {
  try {
    const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY!
    const authString = Buffer.from(`${privateKey}:`).toString('base64')

    const url = 'https://api.imagekit.io/v1/files'
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${authString}`
      }
    }

    const response = await fetch(url, options)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error getting files:', error)
    throw error
  }
}
