import { IProjectPayload } from '@/validators/projectValidator'
import { ApiError } from '@/lib/errors'
import { TPoject } from '@/type'

export const getProjects = async () => {
  const response = await fetch('/api/projects')
  if (!response.ok) {
    throw new ApiError('Failed to fetch projects')
  }
  return response.json()
}

export const createProject = async (project: IProjectPayload) => {
  const response = await fetch('/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(project)
  })

  if (!response.ok) {
    const error = await response.json()
    console.log({ response, error })
    throw new ApiError(error?.error || 'Failed to create project')
  }

  return response.json()
}

export const updateProject = async (project: IProjectPayload & { _id: string; image_review?: { url: string; fileId: string } }) => {
  const response = await fetch('/api/projects', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(project)
  })
  console.log({ response })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update project')
  }

  return response.json()
}

export const deleteProject = async (_id: string) => {
  const response = await fetch('/api/projects', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ _id })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete project')
  }

  return response.json()
}

export const getProjectDetail = async (id: string) => {
  const response = await fetch(`/api/projects/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch project detail')
  }
  return response.json()
}
