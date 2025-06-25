'use client';

import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type TProps = {
  title: string;
};

export default function SectionHeader({ title }: TProps) {
  return (
    <div className='relative'>
      <Image
        src='/banner.jpg'
        alt={title}
        width={1280}
        height={500}
        className='w-full h-64 md:h-80 object-cover'
      />
      <div className='absolute inset-0 flex flex-col items-center bg-black/70 justify-center text-white'>
        <h1 className='text-4xl md:text-5xl font-bold mb-2'>{title}</h1>
        <div className='flex items-center gap-2 font-medium'>
          <Link
            href='/'
            className='text-sky-300'
          >
            Home
          </Link>
          <ChevronRight />
          <p>{title}</p>
        </div>
      </div>
    </div>
  );
}
