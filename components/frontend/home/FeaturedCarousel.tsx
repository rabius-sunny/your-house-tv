import { CarouselSlide, Resource } from '@/types';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Carousel from '../carousel/Carousel';

type TProps = {
  items: CarouselSlide[];
  type: Resource;
  title?: string;
  link?: string;
  linkText?: string;
};

export default function FeaturedCarousel({
  items,
  type,
  title,
  link,
  linkText
}: TProps) {
  return (
    <div className=' py-10 bg-slate-700'>
      <div className='box'>
        {title && (
          <div className='pb-6 flex items-center justify-between'>
            <h2 className='font-semibold text-lg md:text-2xl  text-white'>
              {title}
            </h2>
            <Link
              href={link || `/${type}`}
              className='flex items-center gap-2 text-sm text-slate-300 hover:text-blue-400'
            >
              {linkText ? (
                <span className='capitalize text-xs md:text-base'>
                  {linkText}
                </span>
              ) : (
                <span className='capitalize text-xs md:text-base'>
                  View All {type}
                </span>
              )}
              <ArrowRight className='size-5' />
            </Link>
          </div>
        )}
      </div>
      <Carousel
        slides={items.map((item) => ({
          thumbnail: item.thumbnail || '/placeholder.webp',
          name: item.name || (item as any).title,
          slug: `/${type}/${item.slug}`
        }))}
      />
    </div>
  );
}
