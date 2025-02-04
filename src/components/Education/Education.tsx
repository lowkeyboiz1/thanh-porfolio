'use client'

import { motion } from 'framer-motion'
import React from 'react'
import CardsStack from '@/components/CardsStack'

const educationData = [
  {
    title: 'THE THEATRE CINEMA UNIVERSITY OF HO CHI MINH CITY',
    description: "Bachelor's Degree in Film Directing. Studied directing techniques, cinematography, production design, film analysis, screenwriting techniques, and sound design practices.",
    color: 'bg-[#123273]/80',
    courses: ['Directing Techniques', 'Cinematography', 'Production Design', 'Film Analysis', 'Screenwriting Techniques', 'Sound Design Practices']
  },
  {
    title: 'UNIVERSITY OF SOCIAL SCIENCES AND HUMANITIES, VNU-HCM',
    description: "Bachelor's Degree in Multimedia Communications. Focused on directing, filming and editing, photography, graphic design principles, media design, and digital marketing.",
    color: 'bg-[#123273]/90',
    courses: ['Directing', 'Filming and Editing', 'Photography', 'Graphic Design Principles', 'Media Design', 'Digital Marketing']
  },
  {
    title: 'GREEN ACADEMY',
    description: 'Certificate in Film Editing. Mastered Adobe Premiere Pro, Adobe After Effects, DaVinci Resolve, videography, scriptwriting, and sound design.',
    color: 'bg-[#123273]',
    courses: ['Adobe Premiere Pro', 'Adobe After Effects', 'DaVinci Resolve', 'Videography', 'Scriptwriting', 'Sound Design']
  }
]

const Education = () => {
  return (
    <motion.div id='education' className='flex flex-col gap-8 py-24 page lg:gap-14'>
      <div className='space-y-2'>
        <div className='gradient-text text-4xl font-bold xl:text-6xl'>Education</div>
        <div className='mt-2 max-w-sm text-lg font-medium leading-[1.25] md:max-w-lg xl:text-2xl xl:leading-[2]'>
          The foundation of my vision. Explore the educational journey that has shaped my creative perspective.
        </div>
      </div>
      <div className='space-y-8'>
        <CardsStack data={educationData} />
      </div>
    </motion.div>
  )
}

export default Education
