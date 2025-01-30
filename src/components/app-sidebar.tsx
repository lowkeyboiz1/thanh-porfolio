'use client'

import { SquareTerminal } from 'lucide-react'
import * as React from 'react'

import { NavMain } from '@/components/nav-main'
import { Sidebar, SidebarContent, SidebarRail } from '@/components/ui/sidebar'

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg'
  },
  navMain: [
    {
      title: 'Projects',
      url: '/dashboard/projects',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'All Projects',
          url: '/dashboard/projects',
          isActive: true
        },
        {
          title: 'All Messages',
          url: '/dashboard/messages'
        }
      ]
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  )
}
