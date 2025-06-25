'use client';

import { EmblaOptions } from '@/config/site';
import { CarouselSlide } from '@/types';
import { EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback } from 'react';
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './CarouselArrowButton';

type PropType = {
  slides: CarouselSlide[];
};

const Carousel: React.FC<PropType> = (props) => {
  const { slides } = props;

  // Responsive Embla options for different screen sizes
  const responsiveOptions = {
    ...EmblaOptions
    // breakpoints: {
    //   '(min-width: 1280px)': { slidesToScroll: 1 }, // xl: 4 slides visible
    //   '(min-width: 1024px)': { slidesToScroll: 1 }, // lg: 3 slides visible
    //   '(min-width: 768px)': { slidesToScroll: 1 }, // md: 2 slides visible
    //   '(max-width: 767px)': { slidesToScroll: 1 } // sm and below: 1 slide visible
    // }
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(responsiveOptions, [
    // Autoplay()
  ]);

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop;

    resetOrStop();
  }, []);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi);

  return (
    <section className='embla relative'>
      <div className='box'>
        <div
          className='embla__viewport'
          ref={emblaRef}
        >
          <div className='embla__container'>
            {slides.map((slide, idx) => (
              <div
                className='embla__slide flex-[0_0_100%] sm:flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] xl:flex-[0_0_25%] pl-4 first:pl-0 min-w-0'
                key={idx}
              >
                <div className='relative group cursor-pointer overflow-hidden rounded-md shadow-md hover:shadow-lg transition-all duration-300 w-full'>
                  {slide.slug ? (
                    <Link
                      href={slide.slug}
                      className='block bg-black/20'
                    >
                      <div className='relative aspect-[4/2] overflow-hidden'>
                        <Image
                          src={slide.thumbnail}
                          alt={slide.name || 'Slide image'}
                          width={400}
                          height={300}
                          className='w-full rounded-t-md  h-full object-cover group-hover:scale-105 transition-transform duration-300'
                          sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
                        />
                      </div>
                      {slide.name && (
                        <div className='p-4'>
                          <h3 className='text-sm md:text-base font-medium text-gray-300 line-clamp-2 transition-colors duration-200'>
                            {slide.name}
                          </h3>
                        </div>
                      )}
                    </Link>
                  ) : (
                    <div>
                      <div className='relative aspect-[4/3] overflow-hidden'>
                        <Image
                          src={slide.thumbnail}
                          alt={slide.name || 'Slide image'}
                          width={400}
                          height={300}
                          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                          sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
                        />
                      </div>
                      {slide.name && (
                        <div className='p-4'>
                          <h3 className='text-sm md:text-base font-medium text-gray-300 line-clamp-2'>
                            {slide.name}
                          </h3>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation controls */}
      <PrevButton
        onClick={onPrevButtonClick}
        disabled={prevBtnDisabled}
        styles='absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-md rounded-full p-2'
      />
      <NextButton
        onClick={onNextButtonClick}
        disabled={nextBtnDisabled}
        styles='absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-md rounded-full p-2'
      />
    </section>
  );
};

export default Carousel;
