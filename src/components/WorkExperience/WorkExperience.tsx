import { motion } from 'framer-motion'
import React from 'react'
import Image from 'next/image'

const experiences = [
  {
    period: '08/2024 - 12/2024',
    role: 'Creative Design Trainee',
    company: 'Sanofi',
    image: '/sanofi.png',
    description:
      'Assisted in developing creative design solutions for pharmaceutical marketing campaigns. Collaborated with cross-functional teams to create visually compelling materials that effectively communicated complex medical information. Gained hands-on experience in healthcare-focused design while adhering to strict industry regulations.'
  },
  {
    period: '12/2021 - 08/2024',
    role: 'Senior Video Editor & President',
    company: 'Young Reporter Club',
    image: '/YoungReporterClub.png',
    description:
      'Led a team of aspiring journalists, oversaw video production, and managed club operations. Mentored junior editors in video editing techniques, storytelling, and journalistic standards. Increased club membership by 150% through strategic recruitment and engaging content creation. Produced over 50 high-quality news reports and documentaries that garnered significant viewership across campus media platforms.'
  },
  {
    period: '12/2021 - 12/2023',
    role: 'Senior Video Editor & President',
    company: 'English Debunk Club',
    image: '/LogoEnglishDebunkClub.png',
    description:
      'Organized debates, edited educational videos, and promoted English language proficiency. Developed and implemented a comprehensive curriculum for debate training and public speaking. Created engaging video content that helped members improve their English skills. Successfully hosted multiple inter-university debate competitions with over 200 participants from various institutions.'
  },
  {
    period: '12/2021 - 04/2023',
    role: 'Head of Video Editing & Design',
    company: 'VNU-HCM Student Radio and TV Club',
    image: '/NPT.png',
    description:
      'Managed video production teams and designed visual content for university media channels. Supervised a team of 15 editors and designers, ensuring consistent quality across all productions. Implemented new workflows that reduced production time by 40% while maintaining high standards. Produced content reaching over 10,000 students monthly through various university platforms.'
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
              <p className='leading-relaxed text-white/80'>{exp.description}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default WorkExperience
