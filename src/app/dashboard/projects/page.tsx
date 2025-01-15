'use client'

import { ProjectItem } from '@/components/Projects'
import { ProjectItemProps } from '@/components/Projects/ProjectItem'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { useState, useEffect } from 'react'
import { useGetAllQueryParams } from '@/hooks/useGetAllQueryParams'
import { useRouter } from 'next/navigation'

const ProjectsPage = () => {
  const router = useRouter()

  // Initial Project Data
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

  // Query Params
  //   const queryParams = useGetAllQueryParams()
  const pageFromQuery = 1

  // State Management
  const [projects, setProjects] = useState<ProjectItemProps[]>([...initProjects, ...initProjects])
  const [currentPage, setCurrentPage] = useState(pageFromQuery)
  const totalPages = 5

  // Sync state with query params
  useEffect(() => {
    setCurrentPage(pageFromQuery)
  }, [pageFromQuery])

  // Handlers
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    router.push(`/dashboard/projects?page=${pageNumber}`)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }

  // Render
  return (
    <div className='flex flex-col gap-14 py-10'>
      <div className='grid grid-cols-3 gap-2'>
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
              <PaginationLink href={`/dashboard/projects?page=${index + 1}`} onClick={() => handlePageChange(index + 1)}>
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
