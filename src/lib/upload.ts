import { v4 as uuidv4 } from 'uuid'

interface AuthResponse {
  signature: string
  expire: string
  token: string
}

interface UploadResult {
  url: string
  uuid: string
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

    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', fileName)
    formData.append('signature', auth.signature)
    formData.append('token', auth.token)
    formData.append('expire', auth.expire)
    formData.append('publicKey', publicKey)

    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`)
    }

    const result = await response.json()
    return { url: result.url, uuid }
  })

  // Wait for all uploads to complete
  return Promise.all(uploadPromises)
}
