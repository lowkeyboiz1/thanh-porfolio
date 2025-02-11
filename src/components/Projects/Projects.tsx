import { getProjects } from '@/apis/projects'
import { useIsMobile } from '@/hooks/use-mobile'
import { TProject } from '@/type'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const Projects = () => {
  const targetRef = useRef(null)
  const [projects, setProjects] = useState<TProject[]>([])
  const isMobile = useIsMobile()
  const [isFetching, setIsFetching] = useState(false)
  const fetchProjects = async () => {
    try {
      const projects = await getProjects()
      setProjects(projects || [])
    } catch (error) {
      console.error(error)
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    setIsFetching(true)
  }, [])

  useEffect(() => {
    if (isFetching) {
      fetchProjects()
    }
  }, [isFetching])

  const { scrollYProgress } = useScroll({
    target: targetRef
  })

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 50,
    stiffness: 400
  })

  const x = useTransform(smoothProgress, [0, 1], ['0%', isMobile ? `-${projects.length * 60}%` : `-${projects.length * 47}%`])

  return (
    <section id='projects' ref={targetRef} className='relative h-[400vh] w-full page'>
      <div className='sticky top-[4.3rem] 2xl:top-40'>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className='gradient-text text-4xl font-bold lg:py-1 xl:text-6xl'
        >
          My Projects
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='max-w-sm text-lg font-medium leading-[1.25] md:max-w-2xl xl:text-2xl xl:leading-[2] 2xl:mt-2'
        >
          Fresh off the press. Explore a showcase of my latest projects, pushing the boundaries of visual storytelling.
        </motion.div>
        <div className='w-ful mt-2 flex items-center overflow-hidden'>
          {isFetching ? (
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
            <motion.div style={{ x }} className='flex h-full w-full gap-4 p-2 md:gap-20'>
              {projects.map((project) => {
                return <ProjectItem key={project.title} project={project} />
              })}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

const ProjectItem = ({ project }: { project: TProject }) => {
  const isMobile = useIsMobile()
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, {
    stiffness: 150,
    damping: 15
  })
  const mouseYSpring = useSpring(y, {
    stiffness: 150,
    damping: 15
  })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['17.5deg', '-17.5deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-17.5deg', '17.5deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return

    const element = e.currentTarget
    const rect = element.getBoundingClientRect()

    const width = rect.width
    const height = rect.height

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = (mouseX / width - 0.5) * 2
    const yPct = (mouseY / height - 0.5) * 2

    x.set(xPct * 0.3)
    y.set(yPct * 0.3)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (!isMobile) {
          x.set(0)
          y.set(0)
        }
      }}
      style={{
        transformStyle: 'preserve-3d',
        rotateX: isMobile ? 0 : rotateX,
        rotateY: isMobile ? 0 : rotateY,
        transition: 'transform 0.3s ease-out'
      }}
      className='group relative flex w-full max-w-[280px] flex-shrink-0 flex-col gap-3 overflow-hidden rounded-lg border border-white/20 bg-gradient-to-br from-gray-900/50 to-gray-800/30 p-3 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:from-gray-800/50 hover:to-gray-700/30 sm:max-w-[400px] sm:gap-4 sm:rounded-xl sm:p-4 md:max-w-[450px] md:gap-6 md:rounded-2xl md:p-6 lg:max-w-[500px] lg:gap-8 lg:rounded-3xl xl:gap-10 2xl:p-8'
    >
      <div className='flex flex-col gap-1.5 sm:gap-2 md:gap-3 lg:gap-4'>
        <p className='text-base font-bold text-white transition-colors group-hover:text-blue-400 sm:text-lg md:text-xl lg:text-2xl'>{project.title}</p>
        <p className='line-clamp-3 min-h-[3.6em] text-xs font-normal text-gray-300 transition-colors group-hover:text-white sm:min-h-[4em] sm:text-sm md:min-h-[4.5em] md:text-base'>
          {project.description}
        </p>
      </div>
      <Link href={`/projects/${project.slug}`} className='absolute inset-0 z-10' />
      <div className='relative h-full w-full overflow-hidden rounded-md transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/20 sm:rounded-lg md:rounded-xl lg:rounded-2xl'>
        <div className='aspect-[3/2] w-full'>
          <Image src={`${project.image_review.url}`} alt={project.title} width={1500} height={1000} className='size-full object-cover transition-transform duration-300 group-hover:scale-105' />
        </div>
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
      </div>
    </motion.div>
  )
}

export default Projects
