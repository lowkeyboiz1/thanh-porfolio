import { useMousePosition } from '@/hooks/useMousePosition'
import { useCursorStore } from '@/store/useCursorStore'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import React, { memo, useState } from 'react'

const experiences = [
  {
    period: '08/2024 - 12/2024',
    role: 'Creative Design Trainee',
    company: 'Sanofi',
    image: '/SBlack.png',
    description: [
      "Developed <strong>nearly 30 multimedia content</strong>, including videos and communication assets, for Sanofi <strong>Southeast Asia's</strong> social media and digital channels.",
      'Developed multimedia content on the new HR model - PCOM, for distribution to over <strong>100,000 employees</strong> globally.',
      'Collaborated with cross-functional teams to initiate and execute innovative branding initiatives.'
    ]
  },
  {
    period: '12/2021 - 08/2024',
    role: 'Senior Video Editor & President',
    company: 'Young Reporter Club',
    image: '/YoungReporterClub.png',
    description: [
      'Managed a team of <strong>nearly 60 members</strong> to produce multimedia products such as news bulletins, reports, game shows, talk shows...',
      'Led the production team to produce <strong>75 products</strong> with a total of <strong>nearly 90,000 views</strong>, helping Young Reporters Club increase by <strong>more than 5,400 followers</strong>.',
      'Collaborated with teammates to film and take photos for media products.'
    ]
  },
  {
    period: '12/2021 - 12/2023',
    role: 'Senior Video Editor & President',
    company: 'English Debunk Club',
    image: '/LogoEnglishDebunkClub.png',
    description: [
      'Managed a team of <strong>more than 20 members</strong> to produce media products about English learning tips, posted on Facebook Watch and TikTok.',
      'Led the production team to produce <strong>33 products</strong> with a total of <strong>nearly 15,000 views</strong>, helping English Debunk Club increase by <strong>about 3,200 followers</strong>.'
    ]
  },
  {
    period: '12/2021 - 04/2023',
    role: 'Head of Video Editing & Design',
    company: 'VNU-HCM Student Radio and TV Club',
    image: '/NPT.png',
    description: [
      'Lead the production team to produce <strong>20 products</strong> with a total of <strong>nearly 30,000 views</strong>, helping the club increase by <strong>about 5,000 followers</strong>.',
      'Collaborated with teammates to film and take pictures for media products.'
    ]
  }
]

const WorkExperience = () => {
  const [modal, setModal] = useState({ isActive: false, index: 1 })
  const { position } = useMousePosition()

  return (
    <div id='work-experience' className='flex cursor-none flex-col overflow-x-hidden py-24 page'>
      <div className='space-y-2'>
        <div className='gradient-text text-4xl font-bold xl:text-6xl'>Work Experience</div>
        <div className='mt-2 max-w-sm text-lg font-medium leading-[1.25] md:max-w-lg xl:text-2xl xl:leading-[2]'>
          Building the foundation. Discover the diverse experiences that have fueled my creative growth.
        </div>
      </div>
      <div className='divide-y-2'>
        {experiences.map((exp, index) => (
          <ExperienceCard key={index} {...exp} index={index} setModal={setModal} />
        ))}
      </div>
      <div
        className='pointer-events-none fixed z-[130]'
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
      >
        <ModalImage modal={modal} experiences={experiences} />
      </div>
    </div>
  )
}

type TExperienceCard = {
  period: string
  role: string
  company: string
  image: string
  description: string[]
  index: number
  setModal: React.Dispatch<React.SetStateAction<{ isActive: boolean; index: number }>>
}

const ExperienceCard = ({ period, role, company, image, description, index, setModal }: TExperienceCard) => {
  const { toggleCursor } = useCursorStore()

  return (
    <motion.div
      onMouseEnter={() => {
        setModal({ isActive: true, index })
        toggleCursor(false)
      }}
      onMouseLeave={() => {
        setModal({ isActive: false, index })
        toggleCursor(true)
      }}
      className='group flex flex-col gap-8 py-12 duration-200 md:flex-row md:gap-16 lg:hover:opacity-60 xl:py-24'
    >
      <motion.div initial={{ opacity: 0, x: -100 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.2 }} className='space-y-4 md:w-1/3'>
        <p className='text-sm text-white/60 duration-200 lg:group-hover:-translate-x-2'>{period}</p>
        <div className='flex items-center gap-4'>
          <div className='size-10 lg:hidden xl:size-12'>
            <Image src={company === 'Sanofi' ? '/sanofi.png' : image || '/placeholder.svg'} alt={company} height={100} width={100} className='size-full object-contain' priority />
          </div>
          <p className='text-lg font-medium duration-200 lg:group-hover:-translate-x-2 xl:text-2xl'>{company}</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 100 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.2 }} className='space-y-4 md:w-2/3'>
        <h3 className='text-lg font-medium duration-200 lg:group-hover:translate-x-2'>{role}</h3>
        <ul className='list-disc space-y-2 pl-4 leading-relaxed text-white/80 duration-200 lg:group-hover:translate-x-2'>
          {description.map((desc, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: desc }} />
          ))}
        </ul>
      </motion.div>
    </motion.div>
  )
}

type TModalImage = {
  modal: { isActive: boolean; index: number }
  experiences: {
    period: string
    role: string
    company: string
    image: string
    description: string[]
  }[]
}

const ModalImage = ({ modal, experiences }: TModalImage) => {
  const { isActive, index } = modal

  const scaleAnimation = {
    initial: { scale: 0, x: '-50%', y: '-50%' },
    enter: { scale: 1, x: '-50%', y: '-50%', transition: { duration: 0.2, ease: [0.76, 0, 0.24, 1] } },
    closed: { scale: 0, x: '-50%', y: '-50%', transition: { duration: 0.2, ease: [0.32, 0, 0.67, 0] } }
  }

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          animate={isActive ? 'enter' : 'closed'}
          variants={scaleAnimation}
          initial='initial'
          exit='closed'
          className='pointer-events-none absolute flex size-[300px] translate-x-1/2 translate-y-1/2 items-center justify-center overflow-hidden bg-white'
        >
          <div style={{ transition: 'top 0.25s cubic-bezier(0.76, 0, 0.24, 1)', top: index * -100 + '%' }} className='absolute h-full w-full transition-[top] duration-300 ease-in-out'>
            {experiences.map((exp, index) => {
              const { image, company } = exp
              return (
                <div key={index} className='flex size-full items-center justify-center'>
                  <Image src={image} alt={company} height={200} width={200} className='h-auto object-contain' priority />
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
export default memo(WorkExperience)
