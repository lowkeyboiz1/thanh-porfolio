import { ValidationError } from '@/lib/errors'

export interface ProjectPayload {
  title: string
  description: string
  url: string
}

export function validateProjectPayload(payload: ProjectPayload): { valid: boolean; errors?: string[] } {
  const errors: string[] = []

  if (!payload.title || typeof payload.title !== 'string' || payload.title.length < 3 || payload.title.length > 100) {
    errors.push('Title must be a string between 3 and 100 characters.')
  }

  if (!payload.description || typeof payload.description !== 'string' || payload.description.length < 10 || payload.description.length > 500) {
    errors.push('Description must be a string between 10 and 500 characters.')
  }

  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
  if (!payload.url || typeof payload.url !== 'string' || !urlPattern.test(payload.url)) {
    errors.push('URL must be a valid URI.')
  }

  if (errors.length > 0) {
    throw new ValidationError('Payload validation failed', errors)
  }

  return { valid: true }
}
