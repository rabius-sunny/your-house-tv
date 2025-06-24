import { baseUrl } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import NavLinks from './nav-links';

export default async function Navbar() {
  const res = await fetch(baseUrl + '/api/site');
  if (!res.ok) {
    return (
      <nav className='bg-slate-600 py-2 text-white font-medium h-20'></nav>
    );
  }
  const data = await res.json();
  return (
    <nav className='bg-slate-600 py-2 text-white font-medium h-20'>
      <div className='box flex items-center justify-between gap-3'>
        <Link href='/'>
          <Image
            src={data.logo}
            alt='Logo'
            width={100}
            height={100}
          />
        </Link>
        <NavLinks />
      </div>
    </nav>
  );
}
