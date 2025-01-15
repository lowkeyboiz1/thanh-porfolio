'use client'
import { ProjectItem } from '@/components/Projects'
import { ProjectItemProps } from '@/components/Projects/ProjectItem'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'
const ProjectsPage = () => {
  const router = useRouter()
  const initProjects: ProjectItemProps[] = [
    {
      title: 'Project 1',
      href: '/dashboard/projects/1',
      description: 'This is a project'
    },
    {
      title: 'Project 2',
      href: '/dashboard/projects/2',
      description: 'This is a project'
    },
    {
      title: 'Project 3',
      href: '/dashboard/projects/3',
      description: 'This is a project'
    }
  ]

  const searchParams = useSearchParams()
  const page = searchParams.get('page')

  const [projects, setProjects] = useState<ProjectItemProps[]>([...initProjects, ...initProjects])
  const [currentPage, setCurrentPage] = useState(page ?? 1)
  const totalPages = 5

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    router.push(`/dashboard/projects?page=${pageNumber}`)
  }

  const handleNextPage = () => {
    setCurrentPage(Number(currentPage) + 1)
    router.push(`/dashboard/projects?page=${Number(currentPage) + 1}`)
  }

  const handlePreviousPage = () => {
    setCurrentPage(Number(currentPage) - 1)
    router.push(`/dashboard/projects?page=${Number(currentPage) - 1}`)
  }

  return (
    <div className='flex flex-col gap-14 py-10'>
      <div className='grid grid-cols-3 gap-2 *:mt-10'>
        {projects.map((project) => (
          <ProjectItem key={project.title} {...project} />
        ))}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href='#' onClick={handlePreviousPage} />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index}>
              <PaginationLink href='#' onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext href='#' onClick={handleNextPage} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default ProjectsPage
