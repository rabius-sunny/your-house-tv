import { skipApi } from '@/config/site';
import { baseUrl } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import MobileNav from './mobile-nav';
import NavLinks from './nav-links';

export default async function Navbar() {
  if (skipApi) {
    return <div>Building site...</div>;
  }
  const res = await fetch(baseUrl + '/api/site');
  const data = await res.json();
  return (
    <nav className='bg-color py-2 text-white font-medium h-24 flex items-center w-full'>
      <div className='box flex items-center justify-between gap-3 w-full'>
        <Link
          href='/'
          className='h-full'
        >
          <Image
            src={data.logo}
            alt='Logo'
            width={200}
            height={150}
            className='w-52 md:w-60 h-full'
          />
        </Link>
        <div className='hidden md:block'>
          <NavLinks />
        </div>
        <div className='md:hidden'>
          <MobileNav />
        </div>
      </div>
    </nav>
  );
}
