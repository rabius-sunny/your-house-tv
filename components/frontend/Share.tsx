'use client';

import { Facebook, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Share() {
  const fbLink = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
  const twLink = `https://twitter.com/intent/tweet?url=${window.location.href}`;
  return (
    <div className='grid gap-6'>
      <p className='text-slate-300 text-sm text-center'>Share with friends</p>
      <div className='h-px bg-slate-400 w-full' />
      <div className='flex items-center justify-center gap-2'>
        <Link
          href={fbLink}
          target='_blank'
          className='bg-white/20 p-2 rounded-xs'
        >
          <Facebook className='text-white' />
        </Link>
        <Link
          href={twLink}
          target='_blank'
          className='bg-white/20 p-2 rounded-xs'
        >
          <Twitter className='text-white' />
        </Link>
      </div>
      <p className='mt-6 text-slate-300 text-sm text-center'>
        Watch anywhere, anytime
      </p>
      <div className='h-px bg-slate-400 w-full' />
      <div className='flex items-center justify-center gap-2 flex-wrap'>
        {shareItems.map((item) => (
          <Link
            key={item.title}
            href={item.url}
            className='text-xs text-slate-300 hover:underline'
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

const shareItems = [
  {
    title: 'IPhone',
    url: '#'
  },
  {
    title: 'Apple TV',
    url: '#'
  },
  {
    title: 'Android',
    url: '#'
  },
  {
    title: 'Android TV',
    url: '#'
  },
  {
    title: 'Fire TV',
    url: '#'
  },
  {
    title: 'Roku ®',
    url: '#'
  }
];
