import { ValidationError } from '@/lib/errors'

export interface IProjectPayload {
  title: string
  description: string
  detail: string
}

export function validateProjectPayload(payload: IProjectPayload): { valid: boolean; errors?: string[] } {
  const errors: string[] = []

  if (!payload.title || typeof payload.title !== 'string' || payload.title.length < 3 || payload.title.length > 100) {
    const error = 'Title must be a string between 3 and 100 characters.'
    errors.push(error)
  }

  if (!payload.description || typeof payload.description !== 'string' || payload.description.length < 10 || payload.description.length > 500) {
    const error = 'Description must be a string between 10 and 500 characters.'
    errors.push(error)
  }

  if (payload.detail && typeof payload.detail !== 'string') {
    const error = 'Detail must be a string.'
    errors.push(error)
  }

  if (errors.length > 0) {
    throw new ValidationError('Payload validation failed', errors)
  }

  return { valid: true }
}
