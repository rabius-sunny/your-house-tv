'use client';

import { Home, LogOut, Menu } from 'lucide-react';

import { logout } from '@/actions/users/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';

export function NavUser({
  user
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { push } = useRouter();
  const handleLogout = async () => {
    await logout();
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground' */}
            <Menu className='cursor-pointer border border-gray-300 p-1 size-8 hover:bg-gray-200 rounded' />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side='bottom'
            align='end'
            sideOffset={4}
          >
            {/* <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage
                    src={user.avatar}
                    alt={user.name}
                  />
                  <AvatarFallback className='rounded-lg'>Ad</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{user.name}</span>
                  <span className='truncate text-xs'>{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel> */}

            <DropdownMenuItem onClick={() => push('/')}>
              <Home />
              Go to Site
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
