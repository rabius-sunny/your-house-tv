'use client';

import { EmblaOptions } from '@/config/site';
import { Sponsor } from '@/types';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import React from 'react';

type PropType = {
  slides: Sponsor[];
};

const SponsorCarousel: React.FC<PropType> = (props) => {
  const { slides } = props;

  // Override EmblaOptions to show one slide at a time
  const options = {
    ...EmblaOptions,
    slidesToScroll: 1,
    containScroll: 'trimSnaps' as const
  };

  const [emblaRef] = useEmblaCarousel(options, [Autoplay()]);

  return (
    <section className='embla relative'>
      <div
        className='embla__viewport'
        ref={emblaRef}
      >
        <div className='embla__container flex'>
          {slides.map((slide, idx) => (
            <div
              className='embla__slide flex-[0_0_100%] '
              key={idx}
            >
              <div className='flex flex-col justify-center'>
                <div className='p-4 text-center'>
                  <h3 className='text-sm md:text-base text-gray-800 font-semibold'>
                    {slide.name}
                  </h3>
                  <p className='text-xs md:text-sm text-gray-600'>
                    {slide.designation}
                  </p>
                </div>
                <Image
                  src={slide.logo || '/placeholder.webp'}
                  alt={slide.name || 'Slide image'}
                  width={400}
                  height={300}
                  className='w-full h-auto lg:h-48 object-cover '
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorCarousel;
