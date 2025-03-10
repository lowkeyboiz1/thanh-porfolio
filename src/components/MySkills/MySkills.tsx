'use client'
import { motion } from 'framer-motion'

import { AnimatedTooltip } from '@/components/AnimatedTooltip'
import Image from 'next/image'

type TSkillItem = {
  id: number
  name: string
  image: React.ReactNode
}

const MySkills = () => {
  const expertise: TSkillItem[] = [
    { id: 1, name: 'Video Editing', image: '/VideoEditing.png' },
    { id: 2, name: 'Videography', image: '/Videography.png' },
    { id: 3, name: 'Photography', image: '/Photography.png' },
    { id: 4, name: '2D Graphic Design', image: '/2DGraphicDesign.png' },
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
    <div id='skills' className='gap-10 py-24 page lg:grid lg:grid-cols-2'>
      <motion.div className='flex flex-col gap-8 lg:gap-14'>
        <div className='space-y-2'>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className='gradient-text py-1 text-4xl font-bold xl:text-6xl'
          >
            My Skills
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='mt-2 max-w-sm text-lg font-medium leading-[1.25] md:max-w-xl xl:text-2xl xl:leading-[2]'
          >
            More than just buttons. Explore the artistic and technical skills that drive my filmmaking passion.
          </motion.div>
        </div>
        <div className='space-y-4 lg:space-y-6'>
          <SkillCard title='EXPERTISE' items={expertise} />
          <SkillCard title='TOOLS' items={tools} />
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 40, scale: 0.5 }} whileInView={{ opacity: 1, x: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className='col-span-1'>
        <Image src='/my-skills.png' alt='skills' width={1000} height={1000} className='hidden size-full object-contain lg:flex' />
      </motion.div>
    </div>
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
      <div className='flex flex-wrap gap-6'>
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
    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: (item.id / 100) * 3 }} viewport={{ once: true }} className='h-14 xl:h-16'>
      <AnimatedTooltip item={item as any} />
    </motion.div>
  )
}

export default MySkills
