'use client';

import { frontendNavData } from '@/helper/nav-data';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks() {
  const pathname = usePathname();
  const isActive = (url: string) => {
    if (url === '/') return pathname === url;
    return pathname.startsWith(url);
  };
  return (
    <div className='flex items-center gap-6'>
      {frontendNavData.map((item, idx) => (
        <Link
          key={idx}
          href={item.url}
          className={`text-sm font-medium transition-colors hover:text-sky-300 ${
            isActive(item.url) ? 'text-sky-300' : 'text-slate-200'
          }`}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
}
