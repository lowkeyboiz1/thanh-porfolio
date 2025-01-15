'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { ProjectItem } from '@/components/Projects'
import { apiRequest } from '@/lib/api'

export default function FormCreateProject() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    url: ''
  })
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    url: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' })) // Clear error on input change
  }

  const validateForm = () => {
    const newErrors = { title: '', description: '', url: '' }
    if (!formState.title) newErrors.title = 'Title is required'
    if (!formState.description) newErrors.description = 'Description is required'
    if (!formState.url) newErrors.url = 'URL is required'
    setErrors(newErrors)
    return Object.values(newErrors).every((error) => error === '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await apiRequest('/api/create-new-project', 'POST', formState)
      setIsSubmitted(true)
      setFormState({ title: '', description: '', url: '' })
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='flex gap-14 py-10'>
      <div className='w-full max-w-md rounded-lg p-8 shadow-lg'>
        <div className='mb-6 flex items-center justify-between'>
          <h2 className='text-3xl font-bold text-white'>Create Project</h2>
        </div>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <Input
              name='title'
              value={formState.title}
              onChange={handleInputChange}
              placeholder='Project Title'
              className={`w-full border-gray-300 bg-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${errors.title ? 'border-red-500' : ''}`}
            />
            {errors.title && <div className='text-sm text-red-400'>{errors.title}</div>}
          </div>
          <div>
            <Input
              name='url'
              value={formState.url}
              onChange={handleInputChange}
              placeholder='Project URL'
              className={`w-full border-gray-300 bg-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${errors.url ? 'border-red-500' : ''}`}
            />
            {errors.url && <div className='text-sm text-red-400'>{errors.url}</div>}
          </div>
          <div>
            <Textarea
              name='description'
              value={formState.description}
              onChange={handleInputChange}
              placeholder='Project Description'
              className={`h-32 w-full resize-none border-gray-300 bg-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && <div className='text-sm text-red-400'>{errors.description}</div>}
          </div>
          <Button
            type='submit'
            disabled={isSubmitting || isSubmitted}
            className='flex w-full items-center justify-center rounded-lg bg-blue-600 py-3 font-semibold text-white transition duration-300 ease-in-out hover:bg-blue-700'
          >
            {isSubmitting ? <Loader2 className='mr-2 h-5 w-5 animate-spin' /> : isSubmitted ? <CheckCircle2 className='mr-2 h-5 w-5' /> : null}
            {isSubmitting ? 'Submitting...' : isSubmitted ? 'Submitted!' : 'Create Project'}
          </Button>
        </form>
        {isSubmitted && <div className='mt-4 text-center font-semibold text-green-400'>Project created successfully!</div>}
      </div>
      <ProjectItem title={formState?.title || ''} href={formState?.url || ''} description={formState?.description || ''} />
    </div>
  )
}
