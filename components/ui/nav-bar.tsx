import { frontendNavData } from '@/helper/nav-data';
import { baseUrl } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export default async function Navbar() {
  const res = await fetch(baseUrl + '/api/site');
  if (!res.ok) {
    return <div>Error loading navbar</div>;
  }
  const data = await res.json();
  return (
    <nav className='bg-slate-600 py-2 text-white font-medium'>
      <div className='box flex items-center justify-between gap-3'>
        <Image
          src={data.logo}
          alt='Logo'
          width={100}
          height={100}
        />
        <div className='flex items-center gap-6'>
          {frontendNavData.map((item, idx) => (
            <Link
              key={idx}
              href={item.url}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
