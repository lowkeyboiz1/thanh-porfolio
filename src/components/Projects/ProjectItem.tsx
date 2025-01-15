import React from 'react'
import { PinContainer } from '@/components/PinContainer'
export type ProjectItemProps = {
  title: string
  href: string
  description: string
}
const ProjectItem = ({ title, href, description }: ProjectItemProps) => {
  return (
    <div key={title} className='flex w-full items-center justify-center'>
      <PinContainer title={title} href={href} containerClassName='!size-full'>
        <div className='flex h-[320px] w-[320px] basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2'>
          <h3 className='!m-0 max-w-xs !pb-2 text-base font-bold text-slate-100'>{title}</h3>
          <div className='!m-0 !p-0 text-base font-normal'>
            <span className='text-slate-500'>{description}</span>
          </div>
          <div className='mt-4 flex w-full flex-1 rounded-lg bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500' />
        </div>
      </PinContainer>
    </div>
  )
}

export default ProjectItem
