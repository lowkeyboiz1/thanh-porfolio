import { ValidationError } from '@/lib/errors'

export interface IProjectPayload {
  title: string
  description: string
  href: string
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

  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
  if (!payload.href || typeof payload.href !== 'string' || !urlPattern.test(payload.href)) {
    const error = 'HREF must be a valid URL.'
    errors.push(error)
  }

  if (errors.length > 0) {
    throw new ValidationError('Payload validation failed', errors)
  }

  return { valid: true }
}
