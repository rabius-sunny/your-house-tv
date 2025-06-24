'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { frontendNavData } from '@/helper/nav-data';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DialogTitle } from './dialog';

export default function MobileNav() {
  const pathname = usePathname();
  const isActive = (url: string) => {
    if (url === '/') return pathname === url;
    return pathname.startsWith(url);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu className='size-7 data-[state=open]:hidden' />
      </SheetTrigger>
      <SheetContent className='bg-slate-800/80 text-white p-6 w-full flex items-center justify-center'>
        <DialogTitle></DialogTitle>
        {frontendNavData.map((item, idx) => (
          <Link
            key={idx}
            href={item.url}
            className={cn(
              'block text-2xl font-medium text-slate-200 hover:text-sky-300 mb-2',
              isActive(item.url) ? 'text-sky-300' : ''
            )}
          >
            {item.title}
          </Link>
        ))}
      </SheetContent>
    </Sheet>
  );
}
