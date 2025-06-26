'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { frontendNavData } from '@/helper/nav-data';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { DialogTitle } from './dialog';

export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (url: string) => {
    if (url === '/') return pathname === url;
    return pathname.startsWith(url);
  };

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger asChild>
        <Menu className='size-7 data-[state=open]:hidden' />
      </SheetTrigger>
      <SheetContent className='bg-nav  text-white p-6 w-full flex items-center justify-center'>
        <DialogTitle></DialogTitle>
        {frontendNavData.map((item, idx) => (
          <Link
            key={idx}
            href={item.url}
            onClick={handleLinkClick}
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
