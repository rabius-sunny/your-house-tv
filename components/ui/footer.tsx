import { footerData } from '@/helper/nav-data';
import { baseUrl } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export default async function Footer() {
  const res = await fetch(baseUrl + '/api/site');
  if (!res.ok) {
    return <div>Error loading navbar</div>;
  }
  const data = await res.json();
  return (
    <footer className='bg-color pt-10 border-t border-slate-400 text-white'>
      <div className='box grid grid-cols-2 lg:grid-cols-4 gap-8'>
        <div className='grid gap-3'>
          <Image
            src={data.logo}
            alt='Footer Logo'
            width={250}
            height={150}
            className='w-44 md:w-60 h-auto'
          />
          <p className='font-medium text-slate-200 text-xs md:text-sm'>
            {footerData.description}
          </p>
        </div>
        <div className='grid gap-3'>
          <p className='font-semibold uppercase text-sm md:text-base'>
            Policy Links
          </p>
          {footerData.policyLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.url}
              className='text-slate-300 hover:text-white transition-colors text-xs md:text-sm font-medium'
            >
              {link.title}
            </Link>
          ))}
        </div>
        <div className='grid gap-3'>
          <p className='font-semibold uppercase text-sm md:text-base'>
            Info Links
          </p>
          {footerData.infoLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.url}
              className='text-slate-300 hover:text-white transition-colors text-xs md:text-sm font-medium'
            >
              {link.title}
            </Link>
          ))}
        </div>
        <div className='grid gap-3'>
          <p className='font-semibold uppercase text-sm md:text-base'>
            Social Links
          </p>
          {footerData.socialLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.url}
              className='text-slate-300 hover:text-white transition-colors text-xs md:text-sm font-medium flex items-center gap-2'
            >
              <link.icon className='size-5' />
              {link.title}
            </Link>
          ))}
        </div>
      </div>
      <div className='box text-slate-400'>
        <div className='mt-12 h-[1px] bg-slate-500' />
        <div className='flex flex-col md:flex-row items-center justify-center md:justify-between'>
          <p className='uppercase font-medium text-xs md:text-sm py-4'>
            copyright Rogue Wolf, LLC © {new Date().getFullYear()}. All right
            reserved.
          </p>
          <p className='uppercase font-medium text-xs md:text-sm pt-0 md:py-4'>
            Developed by{' '}
            <Link
              className='text-white'
              href='https://curlware.com'
            >
              Curlware
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
