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

  const x = useTransform(scrollYProgress, [0, 1], ['0%', isMobile ? `-${projects.length * 105}%` : `-${projects.length * 60}%`])

  return (
    <section id='projects' ref={targetRef} className='relative h-[150vh] w-full page'>
      <div className='sticky top-24 2xl:top-40'>
        <div className='gradient-text text-4xl font-bold xl:text-6xl'>My Projects</div>
        <div className='mt-2 max-w-sm text-lg font-medium leading-[1.25] md:max-w-lg xl:text-2xl xl:leading-[2]'>
          Some things I&apos;ve built with love, expertise and a pinch of magical ingredients.
        </div>
        <div className='mt-10 flex w-full items-center overflow-hidden'>
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
            <motion.div
              style={{ x }}
              initial={{
                opacity: 0,
                y: 100
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.25,
                ease: 'easeOut'
              }}
              viewport={{ once: true }}
              className='flex h-full min-h-[500px] w-full gap-20 p-2'
            >
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
      className='relative flex w-full max-w-[280px] flex-shrink-0 flex-col gap-3 overflow-hidden rounded-lg border border-white/20 p-3 sm:max-w-[500px] sm:gap-4 sm:rounded-xl sm:p-4 md:max-w-[600px] md:gap-6 md:rounded-2xl md:p-6 lg:max-w-[700px] lg:gap-8 lg:rounded-3xl lg:p-8 xl:gap-10'
    >
      <div className='flex flex-col gap-1.5 sm:gap-2 md:gap-3 lg:gap-4'>
        <p className='text-base font-bold text-white sm:text-lg md:text-xl lg:text-2xl'>{project.title}</p>
        <p className='line-clamp-3 min-h-[3.6em] text-xs font-normal text-white sm:min-h-[4em] sm:text-sm md:min-h-[4.5em] md:text-base'>{project.description}</p>
      </div>
      <Link href={`/projects/${project.slug}`} className='absolute inset-0 z-10' />
      <div className='h-full max-h-[180px] w-full overflow-hidden rounded-md sm:max-h-[220px] sm:rounded-lg md:max-h-[280px] md:rounded-xl lg:max-h-[320px] lg:rounded-2xl xl:max-h-[440px]'>
        <Image src={`${project.image_review.url}`} alt={project.title} width={1000} height={1000} className='size-full object-cover' priority />
      </div>
    </motion.div>
  )
}

export default Projects
