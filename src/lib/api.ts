import { toast } from 'sonner'

export const apiRequest = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: any, // Optional body for POST/PUT
  options: RequestInit = {}
): Promise<T> => {
  try {
    const defaultOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store', // Prevent caching by default
      ...options
    }

    const response = await fetch(endpoint, defaultOptions)

    if (!response.ok) {
      const errorText = await response.text() // Get the response as text
      if (errorText.startsWith('<!DOCTYPE html>')) {
        // This indicates an HTML response (likely an error page)
        toast.error('Unexpected HTML response. Please check the API endpoint.')
        throw new Error('Unexpected HTML response. Please check the API endpoint.')
      }
      const errorData = JSON.parse(errorText) // Try parsing the error as JSON if it's not HTML
      const errorMessage = errorData.message || `HTTP error! status: ${response.status}`
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }

    const responseData = await response.json() // Attempt to parse the JSON response
    return responseData as T
  } catch (error) {
    console.error('Fetch error:', error)
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    throw error
  }
}
