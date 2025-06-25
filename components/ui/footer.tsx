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
    <footer className='bg-slate-800 pt-10 border-t border-slate-400 text-white'>
      <div className='box grid grid-cols-2 lg:grid-cols-4 gap-8'>
        <div className='grid gap-3'>
          <Image
            src={data.logo}
            alt='Footer Logo'
            width={250}
            height={150}
            className='w-44 md:w-60 h-auto'
          />
          <p className='font-medium text-slate-200 text-sm'>
            {footerData.description}
          </p>
        </div>
        <div className='grid gap-3'>
          <p className='font-semibold uppercase'>Policy Links</p>
          {footerData.policyLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.url}
              className='text-slate-300 hover:text-white transition-colors'
            >
              {link.title}
            </Link>
          ))}
        </div>
        <div className='grid gap-3'>
          <p className='font-semibold uppercase'>Info Links</p>
          {footerData.infoLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.url}
              className='text-slate-300 hover:text-white transition-colors'
            >
              {link.title}
            </Link>
          ))}
        </div>
        <div className='grid gap-3'>
          <p className='font-semibold uppercase'>Social Links</p>
          {footerData.socialLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.url}
              className='text-slate-300 hover:text-white transition-colors flex items-center gap-2'
            >
              <link.icon className='size-5' />
              {link.title}
            </Link>
          ))}
        </div>
      </div>
      <div className='box text-slate-300'>
        <div className='mt-12 h-[1px] bg-slate-300' />
        <div className='flex items-center justify-between'>
          <p className='uppercase font-medium text-sm py-4'>
            copyright Rogue Wolf, LLC © {new Date().getFullYear()}. All right
            reserved.
          </p>
          <p className='uppercase font-medium text-sm py-4'>
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
