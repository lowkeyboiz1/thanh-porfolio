'use client'

import { getProjectDetail } from '@/apis/projects'
import { TPoject } from '@/type'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const ProjectDetail = () => {
  const [projectDetail, setProjectDetail] = useState<TPoject | null>(null)
  const params = useParams()
  const slug = params.slug as string
  useEffect(() => {
    const fetchProjectDetail = async () => {
      const projectDetail = await getProjectDetail(slug)
      setProjectDetail(projectDetail)
    }
    fetchProjectDetail()
  }, [slug])
  return <div className='page'>ProjectDetail</div>
}

export default ProjectDetail
