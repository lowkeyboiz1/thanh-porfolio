'use client'

import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { postContactMessage } from '@/apis/contact'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter your name')
      return false
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email')
      return false
    }
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return false
    }
    if (!formData.message.trim()) {
      toast.error('Please enter your message')
      return false
    }

    if (formData.message.length > 300) {
      toast.error('Message must be less than 300 characters')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await postContactMessage(formData.name, formData.email, formData.message)

      // Reset form
      setFormData({
        name: '',
        email: '',
        message: ''
      })
      toast.success('Message sent successfully!')
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Error sending message')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <motion.div id='contact' className='flex w-full flex-col items-center gap-8 py-40 page *:w-full lg:gap-14'>
      <div className='space-y-4 text-center'>
        <div className='gradient-text text-4xl font-bold xl:text-6xl'>Contact</div>
        <h2 className='text-2xl font-medium text-gray-200 xl:text-3xl'>Ready to embark on a new project? Work with me.</h2>
      </div>
      <form onSubmit={handleSubmit} className='mt-8 flex flex-col gap-6'>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='name' className='0 text-lg font-medium'>
            Name
          </Label>
          <Input type='text' id='name' name='name' value={formData.name} onChange={handleChange} className='px-4 py-2 focus:outline-none' />
        </div>

        <div className='flex flex-col gap-2'>
          <Label htmlFor='email' className='text-lg font-medium text-gray-200'>
            Email
          </Label>
          <Input type='email' id='email' name='email' value={formData.email} onChange={handleChange} className='px-4 py-2 focus:outline-none' />
        </div>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='message' className='0 text-lg font-medium'>
              Message
            </Label>
            <p className='text-sm text-gray-100'>{formData.message.length} / 300</p>
          </div>
          <Textarea id='message' name='message' value={formData.message} onChange={handleChange} rows={5} className='px-4 py-2 focus:outline-none' />
        </div>

        <button type='submit' className='mt-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 px-8 py-3 font-medium text-white transition-all hover:from-blue-600 hover:to-blue-800'>
          Send Message
        </button>
      </form>
    </motion.div>
  )
}

export default Contact
