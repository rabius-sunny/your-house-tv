'use client';

import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from '@/components/ui/sidebar';
import { navData } from '@/helper/nav-data';
import Image from 'next/image';

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible='icon'
      {...props}
    >
      <SidebarHeader>
        <div>
          <Image
            src='/logo-black.png'
            alt='Logo'
            width={150}
            height={150}
            className='w-full'
          />
        </div>
        {/* <NavUser user={navData.user} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <p className='font-medium text-center text-xs text-slate-500'>
          Made with ❤️ by Curlware
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
