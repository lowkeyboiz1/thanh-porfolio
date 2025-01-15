import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { PinContainer } from '../PinContainer'

const Projects = () => {
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef
  })

  const projects = [
    {
      title: 'Trello Clone',
      href: 'https://trello.aceternity.com',
      description: 'A Trello clone built with Fullstack (Next.js, Tailwind CSS, ExpressJS, NextUI, MongoDB).'
    },
    {
      title: 'Vua Thợ Website',
      href: 'https://vuatho.com',
      description: 'Vua Thợ is a company website I developed to showcase our projects and services.'
    },
    {
      title: 'Youtube Clone',
      href: 'https://youtube.aceternity.com',
      description: 'A Youtube clone built with Fullstack (React.js, Tailwind CSS, Nodejs, ExpressJS, MongoDB).'
    },
    {
      title: 'Shop T-Shirt 3D',
      href: 'https://shop.aceternity.com',
      description: 'A 3D shop for T-Shirt.'
    },
    {
      title: 'Task Manager',
      href: 'https://tasks.example.com',
      description: 'A task manager for organizing and tracking your tasks.'
    },
    {
      title: 'Recipe Finder',
      href: 'https://recipes.example.com',
      description: 'A recipe finder for finding recipes based on ingredients or cuisine.'
    },
    {
      title: 'Social Media Dashboard',
      href: 'https://social.example.com',
      description: 'A social media dashboard for managing your social media accounts.'
    }
  ]

  const x = useTransform(scrollYProgress, [0, 1], ['2%', '-200%'])

  return (
    <section id='projects' ref={targetRef} className='relative left-10 h-[150vh] w-[calc(100vw-100px)] !px-0 page'>
      <div className='sticky top-40'>
        <div className='gradient-text text-6xl font-bold'>My Projects</div>
        <div className='mt-2 max-w-sm text-2xl font-medium leading-[2] md:max-w-lg'>Some things I&apos;ve built with love, expertise and a pinch of magical ingredients.</div>
        <div className='flex w-full items-center overflow-hidden'>
          <motion.div style={{ x }} className='flex h-full min-h-[500px] w-full gap-20'>
            {projects.map((project) => {
              return (
                <div key={project.title} className='flex w-full items-center justify-center'>
                  <PinContainer title={project.title} href={project.href} containerClassName='!size-full'>
                    <div className='flex h-[400px] w-[400px] basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2'>
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
        </div>
      </div>
    </section>
  )
}

export default Projects
