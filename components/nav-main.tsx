'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar
} from '@/components/ui/sidebar';
import Link from 'next/link';

export function NavMain({
  items
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
    }[];
  }[];
}) {
  const { toggleSidebar, isMobile } = useSidebar();
  return (
    <SidebarGroup className='px-3 py-2'>
      <SidebarMenu className='gap-2 mt-2'>
        {items.map((item, idx) =>
          item.items?.length ? (
            <Collapsible
              key={idx}
              asChild
              defaultOpen={item.isActive}
              className='group/collapsible'
            >
              <SidebarMenuItem className='mb-1'>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className='w-full px-4 py-5 rounded-lg hover:bg-accent/50 transition-all duration-200 ease-in-out group-hover:shadow-sm'
                  >
                    {item.icon && (
                      <item.icon className='h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors duration-200' />
                    )}
                    <span className='font-medium text-sm ml-3 group-hover:text-foreground transition-colors duration-200'>
                      {item.title}
                    </span>
                    <ChevronRight className='ml-auto h-4 w-4 text-muted-foreground transition-all duration-200 group-data-[state=open]/collapsible:rotate-90 group-hover:text-foreground' />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className='mt-2 ml-2'>
                  <SidebarMenuSub className='gap-1 pl-4 border-l-2 border-border/40'>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem
                        key={subItem.title}
                        className='mb-1'
                      >
                        <SidebarMenuButton
                          onClick={() => isMobile && toggleSidebar()}
                          className='w-full px-4 py-5 rounded-md hover:bg-accent/30 transition-all duration-200 ease-in-out group'
                        >
                          <Link
                            href={subItem.url}
                            className='flex items-center w-full'
                          >
                            {subItem.icon && (
                              <subItem.icon className='h-4 w-4 text-muted-foreground/70 group-hover:text-foreground transition-colors duration-200' />
                            )}
                            <span className='text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200 ml-3'>
                              {subItem.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem
              key={idx}
              className='mb-1'
            >
              <SidebarMenuButton
                onClick={() => isMobile && toggleSidebar()}
                asChild
                className='w-full px-4 py-5 rounded-lg hover:bg-accent/50 transition-all duration-200 ease-in-out group hover:shadow-sm'
              >
                <Link
                  href={item.url}
                  className='flex items-center'
                >
                  {item.icon && (
                    <item.icon className='h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors duration-200' />
                  )}
                  <span className='font-medium text-sm ml-3 group-hover:text-foreground transition-colors duration-200'>
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
