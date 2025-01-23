'use client'

import { getProjectDetail } from '@/apis/projects'
import { TPoject } from '@/type'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'

const ProjectDetail = () => {
  const [projectDetail, setProjectDetail] = useState<TPoject | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const slug = params.slug as string

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        setIsLoading(true)
        const projectDetail = await getProjectDetail(slug)
        setProjectDetail(projectDetail)
      } catch (error) {
        console.error('Error fetching project detail:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProjectDetail()
  }, [])

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-white' />
      </div>
    )
  }

  if (!projectDetail) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <h1 className='text-2xl text-white'>Project not found</h1>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen flex-col gap-8 py-20 page'>
      <div className='w-full overflow-hidden rounded-lg'>
        <Image src={projectDetail.image_review.url} alt={projectDetail.title} width={1000} height={1000} className='object-cover' priority />
      </div>
      <div className='flex flex-col gap-4'>
        <h1 className='gradient-text py-2 text-4xl font-bold xl:text-6xl'>{projectDetail.title}</h1>
        <p className='max-w-2xl text-lg text-gray-400'>{projectDetail.description}</p>
      </div>
    </div>
  )
}

export default ProjectDetail
