'use client';

import { EmblaOptions } from '@/config/site';
import { Sliders } from '@/types';
import { EmblaCarouselType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
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
  slides: Sliders;
};

const HeroCarousel: React.FC<PropType> = (props) => {
  const { slides } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { ...EmblaOptions, loop: true },
    [Autoplay({ stopOnInteraction: false, stopOnMouseEnter: false })]
  );

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
  } = usePrevNextButtons(emblaApi, onNavButtonClick);

  return (
    <div className='relative'>
      <section className='embla-hero min-h-[60vh] md:min-h-[70vh] relative overflow-hidden'>
        <div
          className='embla__viewport h-full'
          ref={emblaRef}
        >
          <div className='embla__container h-full'>
            {slides.map((slide, idx) => (
              <div
                className='embla__slide w-full flex-[0_0_100%]  h-full relative'
                key={idx}
              >
                {/* 70vh viewport image */}
                <div className='relative w-full h-[60vh] md:h-[70vh]'>
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className='object-cover'
                    priority={idx === 0}
                    sizes='100vw'
                  />

                  {/* Content container positioned to the left */}
                  <div className='absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent' />
                  <div className='absolute inset-0 flex justify-start box'>
                    <div className='relative px-4 lg:px-8 py-8 max-w-2xl h-full flex items-center'>
                      {/* Gradient overlay only for text area */}

                      <div className='relative z-10 text-white'>
                        {/* Title */}
                        <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight'>
                          {slide.title}
                        </h1>

                        {/* Subtitle */}
                        {slide.subtitle && (
                          <h2 className='text-sm md:text-xl lg:text-2xl font-medium mb-6 text-gray-200'>
                            {slide.subtitle}
                          </h2>
                        )}

                        {/* Description */}
                        {slide.description && (
                          <p className='text-sm md:text-base lg:text-lg mb-8 leading-relaxed text-gray-300 max-w-xl'>
                            {slide.description}
                          </p>
                        )}

                        {/* Call to action link */}
                        {slide.link && slide.linktext && (
                          <Link
                            href={slide.link}
                            className='inline-flex items-center px-4 py-3 md:px-6 md:py-3 lg:px-8 lg:py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm md:text-base'
                          >
                            {slide.linktext}
                            <svg
                              className='ml-2 w-4 h-4 md:w-5 md:h-5'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M9 5l7 7-7 7'
                              />
                            </svg>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation controls */}
        <div className=''>
          <PrevButton
            styles='absolute left-4 top-1/2 transform -translate-y-1/2 z-10'
            onClick={onPrevButtonClick}
            disabled={prevBtnDisabled}
          />
          <NextButton
            styles='absolute right-4 top-1/2 transform -translate-y-1/2 z-10'
            onClick={onNextButtonClick}
            disabled={nextBtnDisabled}
          />
        </div>
      </section>
    </div>
  );
};

export default HeroCarousel;
