import { ApiError } from '@/lib/errors'

export const updateUser = async (orderProjectIds: string[]) => {
  const response = await fetch('/api/user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ orderProjectIds })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new ApiError(error?.error || 'Failed to update user')
  }

  return response.json()
}
