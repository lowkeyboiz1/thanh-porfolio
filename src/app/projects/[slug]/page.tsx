'use client'

import { getProjectDetail } from '@/apis/projects'
import Header from '@/layouts/header/Header'
import { TProject } from '@/type'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const ProjectDetail = () => {
  const [projectDetail, setProjectDetail] = useState<TProject | null>(null)
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
  }, [slug]) // Add slug dependency

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
    <>
      <Header />
      <div className='flex min-h-screen flex-col gap-10 py-20 page'>
        <div className='max-h-[700px] w-full overflow-hidden rounded-lg'>
          <Image src={projectDetail.image_review.url} alt={projectDetail.title} width={2000} height={2000} className='object-contain' priority />
        </div>
        <div className='flex flex-col gap-6 text-white'>
          <h1 className='gradient-text py-2 text-4xl font-bold xl:text-6xl'>{projectDetail.title}</h1>
          <div className='grid grid-cols-2 gap-20'>
            <div className='flex flex-col gap-4 lg:text-lg'>
              <div className='flex items-center justify-between font-medium'>
                <p className='text-gray-400'>Client:</p>
                <p>{projectDetail.client}</p>
              </div>
              <div className='flex items-center justify-between font-medium'>
                <p className='text-gray-400'>Category:</p>
                <p>{projectDetail.category}</p>
              </div>
              <div className='flex items-center justify-between font-medium'>
                <p className='text-gray-400'>Year:</p>
                <p>{projectDetail.year}</p>
              </div>
            </div>
            <div className='flex flex-col font-medium lg:text-lg'>
              <p className='text-gray-400'>Description:</p>
              <p>{projectDetail.description}</p>
            </div>
          </div>

          <p className='lg:text-lg'>
            <span className='font-medium text-gray-400'>Scope of work:</span> {projectDetail.scopeOfWork}
          </p>
        </div>
        <div className='prose break-words' dangerouslySetInnerHTML={{ __html: projectDetail.detail }} />
      </div>
    </>
  )
}

export default ProjectDetail
