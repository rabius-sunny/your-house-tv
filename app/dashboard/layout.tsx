'use client';

import { AppSidebar } from '@/components/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { navData } from '@/helper/nav-data';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className='p-4 md:p-6 xl:p-8'>
          <div className='flex items-center gap-3 mb-8'>
            <SidebarTrigger className='-ml-1' />
            <h2 className='font-bold'>
              {navData.navMain.find((item) => item.url === pathname)?.title ||
                'Dashboard'}
            </h2>
          </div>

          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
