'use client'
import { motion } from 'framer-motion'

import { Camera, Film, Image as ImageIcon, Music, Pen } from 'lucide-react'

import { AnimatedTooltip } from '@/components/AnimatedTooltip'

type TSkillItem = {
  id: number
  name: string
  image: React.ReactNode
}

const MySkills = () => {
  const expertise: TSkillItem[] = [
    { id: 1, name: 'Video Editing', image: '/VideoEditing.png' },
    { id: 2, name: 'Videography', image: '/Videography.webp' },
    { id: 3, name: 'Photography', image: '/Photography.png' },
    { id: 4, name: '2D Graphic Design', image: '/2DGraphicDesign.webp' },
    { id: 5, name: 'Sound Design', image: '/SoundDesign.png' }
  ]

  const tools = [
    { id: 6, name: 'Adobe Premiere Pro', image: '/AdobePremierePro.png' },
    { id: 7, name: 'Adobe Lightroom Classic', image: '/AdobeLightroomClassic.png' },
    { id: 8, name: 'Adobe Photoshop', image: '/AdobePhotoshop.png' },
    { id: 9, name: 'Adobe After Effects', image: '/AfterEffects.png' },
    { id: 10, name: 'Adobe Audition', image: '/AdobeAudition.png' },
    { id: 11, name: 'Adobe Illustrator', image: '/AdobeIllustrator.png' },
    { id: 12, name: 'CapCut', image: '/CapCut.png' },
    { id: 13, name: 'DaVinci Resolve', image: '/DaVinciResolve.png' }
  ]

  return (
    <motion.div id='skills' className='flex flex-col gap-8 py-10 page lg:gap-14'>
      <div className='space-y-2'>
        <div className='gradient-text text-4xl font-bold xl:text-6xl'>My Skills</div>
        <div className='mt-2 max-w-sm text-lg font-medium leading-[1.25] md:max-w-lg xl:text-2xl xl:leading-[2]'>
          I craft compelling visual stories through expert video editing, cinematography, and creative design.
        </div>
      </div>
      <div className='space-y-4 lg:space-y-6'>
        <SkillCard title='EXPERTISE' items={expertise} />
        <SkillCard title='TOOLS' items={tools} />
      </div>
    </motion.div>
  )
}

interface SkillCardProps {
  title: string
  items: TSkillItem[]
}

const SkillCard = ({ title, items }: SkillCardProps) => {
  return (
    <div className='space-y-4 lg:space-y-6'>
      <p className='text-base font-medium tracking-widest lg:text-lg'>{title}</p>
      <div className='flex flex-wrap gap-6 lg:gap-10'>
        {items.map((item) => {
          return <Skill key={item.id} item={item} />
        })}
      </div>
    </div>
  )
}

interface SkillProps {
  item: TSkillItem
}

const Skill = ({ item }: SkillProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: (item.id / 100) * 3 }} viewport={{ once: true }} className='h-14'>
      <AnimatedTooltip item={item as any} />
    </motion.div>
  )
}

export default MySkills
