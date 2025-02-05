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
  }, [slug])

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
      <div className='flex flex-col gap-6 py-16 page sm:gap-8 sm:py-20 lg:gap-10'>
        <div className='max-h-[500px] w-full overflow-hidden rounded-lg sm:max-h-[600px] lg:max-h-[700px]'>
          <Image src={projectDetail.image_review.url} alt={projectDetail.title} width={2000} height={2000} className='h-full w-full object-contain' priority />
        </div>
        <div className='flex flex-col gap-4 text-white sm:gap-6'>
          <h1 className='gradient-text py-2 text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl'>{projectDetail.title}</h1>

          <div className='flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-8 lg:gap-20'>
            <div className='flex flex-col gap-3 text-sm sm:text-base lg:text-lg'>
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

            <div className='flex flex-col text-sm font-medium sm:text-base lg:text-lg'>
              <p className='text-gray-400'>Description:</p>
              <p>{projectDetail.description}</p>
            </div>
          </div>

          <div className='text-sm sm:text-base lg:text-lg'>
            <span className='font-medium text-gray-400'>Scope of work:</span> {projectDetail.scopeOfWork}
          </div>
        </div>

        <div className='prose prose-sm sm:prose-base lg:prose-lg prose-headings:text-white prose-p:text-gray-300 max-w-none break-words' dangerouslySetInnerHTML={{ __html: projectDetail.detail }} />
      </div>
    </>
  )
}

export default ProjectDetail
