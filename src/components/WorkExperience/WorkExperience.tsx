import { motion } from 'framer-motion'
import React from 'react'
import Image from 'next/image'

const experiences = [
  {
    period: '08/2024 - 12/2024',
    role: 'Creative Design Trainee',
    company: 'Sanofi',
    image: '/sanofi.png',
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
  return (
    <div id='work-experience' className='flex flex-col overflow-x-hidden py-24 page'>
      <div className='space-y-2'>
        <div className='gradient-text text-4xl font-bold xl:text-6xl'>Work Experience</div>
        <div className='mt-2 max-w-sm text-lg font-medium leading-[1.25] md:max-w-lg xl:text-2xl xl:leading-[2]'>
          Building the foundation. Discover the diverse experiences that have fueled my creative growth.
        </div>
      </div>
      <div className='space-y-16 divide-y-2 py-10'>
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: index * 0.25 }}
            className='flex flex-col gap-8 pt-16 md:flex-row md:gap-16'
          >
            <motion.div initial={{ opacity: 0, x: -100 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }} className='space-y-4 md:w-1/3'>
              <p className='text-sm text-white/60'>{exp.period}</p>
              <div className='flex items-center gap-4'>
                <div style={{ background: exp.company === 'Sanofi' ? 'linear-gradient(to right, #fff, #fff)' : '' }} className='relative h-12 w-12 flex-shrink-0'>
                  <Image src={exp.image || '/placeholder.svg'} alt={exp.company} fill className='object-contain' />
                </div>
                <p className='text-lg font-medium xl:text-2xl'>{exp.company}</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 100 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }} className='space-y-4 md:w-2/3'>
              <h3 className='text-lg font-medium'>{exp.role}</h3>
              <ul className='list-disc space-y-2 pl-4 leading-relaxed text-white/80'>
                {exp.description.map((desc, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: desc }} />
                ))}
              </ul>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default WorkExperience
