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

  const x = useTransform(scrollYProgress, [0, 1], ['0%', isMobile ? `-${projects.length * 105}%` : `-${projects.length * 55}%`])

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
            <motion.div style={{ x }} className='flex h-full min-h-[500px] w-full gap-20'>
              {projects.map((project) => {
                return (
                  // <div key={project.title} className='flex w-full items-center justify-center'>
                  //   <PinContainer title={project.title} href={`/projects/${project.slug}`} containerClassName='!size-full'>
                  //     <div className='flex size-[400px] basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2'>
                  //       <h3 className='!m-0 max-w-xs !pb-2 text-base font-bold text-slate-100'>{project.title}</h3>
                  //       <div className='!m-0 !p-0 text-base font-normal'>
                  //         <span className='text-slate-500'>{project.description}</span>
                  //       </div>
                  //       <div className='mt-4 flex w-full flex-1 rounded-lg bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500' />
                  //     </div>
                  //   </PinContainer>
                  // </div>
                  <ProjectItem key={project.title} project={project} />
                )
              })}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
const ProjectItem = ({ project }: { project: TProject }) => {
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
        x.set(0)
        y.set(0)
      }}
      style={{
        transformStyle: 'preserve-3d',
        rotateX: rotateX,
        rotateY: rotateY,
        transition: 'transform 0.3s ease-out'
      }}
      className='relative flex w-full max-w-[700px] flex-shrink-0 overflow-hidden rounded-3xl bg-blue-500'
    >
      <p className='absolute left-4 top-4 text-2xl font-bold text-white'>{project.title}</p>
      <Link href={`/projects/${project.slug}`} className='absolute inset-0 z-10' />
      <Image src={`${project.image_review.url}`} alt={project.title} width={1000} height={1000} className='size-full object-cover' />
    </motion.div>
  )
}

export default Projects
