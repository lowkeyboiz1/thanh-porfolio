import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { PinContainer } from '../PinContainer'
import { useIsMobile } from '@/hooks/use-mobile'
import { typeOfProject } from '@/utils/constans'
import { getProjects } from '@/apis/projects'
import { TPoject } from '@/type'
import { useState, useEffect } from 'react'

const Projects = () => {
  const targetRef = useRef(null)
  const [projects, setProjects] = useState<TPoject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const isMobile = useIsMobile()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        const projects = await getProjects()
        setProjects(projects || [])
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const { scrollYProgress } = useScroll({
    target: targetRef
  })

  const x = useTransform(scrollYProgress, [0, 1], ['0%', isMobile ? `-${projects.length * 105}%` : `-${projects.length * 32}%`])

  return (
    <section id='projects' ref={targetRef} className='relative h-[150vh] w-full page'>
      <div className='sticky top-40'>
        <div className='gradient-text text-4xl font-bold xl:text-6xl'>My Projects</div>
        <div className='mt-2 max-w-sm text-lg font-medium leading-[1.25] md:max-w-lg xl:text-2xl xl:leading-[2]'>
          Some things I&apos;ve built with love, expertise and a pinch of magical ingredients.
        </div>
        <div className='flex w-full items-center overflow-hidden'>
          {isLoading ? (
            <div className='flex h-full min-h-[500px] w-full gap-20'>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className='flex w-full items-center justify-center'>
                  <div className='flex size-[400px] basis-full flex-col gap-4 rounded-lg bg-gray-800/50 p-4'>
                    <div className='h-6 w-48 animate-pulse rounded-lg bg-gray-700/50' />
                    <div className='h-20 w-full animate-pulse rounded-lg bg-gray-700/50' />
                    <div className='flex-1 animate-pulse rounded-lg bg-gray-700/50' />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div style={{ x }} className='flex h-full min-h-[500px] w-full gap-20'>
              {projects.map((project) => {
                return (
                  <div key={project.title} className='flex w-full items-center justify-center'>
                    <PinContainer title={project.title} href={`/projects/${project.slug}`} containerClassName='!size-full'>
                      <div className='flex size-[400px] basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2'>
                        <h3 className='!m-0 max-w-xs !pb-2 text-base font-bold text-slate-100'>{project.title}</h3>
                        <div className='!m-0 !p-0 text-base font-normal'>
                          <span className='text-slate-500'>{project.description}</span>
                        </div>
                        <div className='mt-4 flex w-full flex-1 rounded-lg bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500' />
                      </div>
                    </PinContainer>
                  </div>
                )
              })}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Projects
