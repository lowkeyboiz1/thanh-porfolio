'use client'

import { cn } from '@/lib/utils'
import { FC } from 'react'

interface Props {
  children: React.ReactNode
  onClick: () => void
  isActive?: boolean
}

const ToolButton: FC<Props> = ({ children, onClick, isActive = false }) => {
  return (
    <div onClick={onClick} className={cn('rounded-md p-2', isActive && 'bg-gray-200 text-gray-800')}>
      {children}
    </div>
  )
}

export default ToolButton
