'use client';

import { useAsync } from '@/hooks/useAsync';
import { Sliders } from '@/types';
import { EmblaCarouselType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

type TProps = {};

// Custom hook for vertical navigation buttons
const useVerticalPrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined
) => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on('reInit', onSelect).on('select', onSelect);
  }, [emblaApi, onSelect]);

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  };
};

export default function BottomCarousel({}: TProps) {
  const { data, loading, error } = useAsync<Sliders>(
    '/sliders?key=bottom_sliders'
  );

  const autoplayRef = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      axis: 'y',
      loop: true,
      dragFree: false,
      containScroll: 'trimSnaps',
      slidesToScroll: 1,
      align: 'center'
    },
    [autoplayRef.current]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [exitingImage, setExitingImage] = useState<string | null>(null);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = useVerticalPrevNextButtons(emblaApi);

  const onSelect = useCallback(
    (emblaApi: EmblaCarouselType) => {
      const newIndex = emblaApi.selectedScrollSnap();
      if (newIndex !== selectedIndex && data && data[selectedIndex]) {
        // Set current image to fade out
        setExitingImage(data[selectedIndex].image);
        setShouldFadeOut(false); // Start visible

        // Immediately update to new index (new image appears instantly)
        setSelectedIndex(newIndex);

        // Start fade out after a brief delay to ensure image is mounted
        setTimeout(() => {
          setShouldFadeOut(true);
        }, 50);

        // Remove exiting image after fade completes
        setTimeout(() => {
          setExitingImage(null);
          setShouldFadeOut(false);
        }, 600);
      }
    },
    [selectedIndex, data]
  );

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on('reInit', onSelect).on('select', onSelect);
  }, [emblaApi, onSelect]);

  if (loading) {
    return (
      <div className='relative w-full h-[85vh]'>
        <div className='absolute  inset-0 bg-gradient-to-br from-gray-900 to-black animate-pulse' />
        <div className='relative box z-10 grid grid-cols-3 h-full'>
          <div className='p-8 flex flex-col justify-center'>
            <div className='space-y-4'>
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className='h-[120px] bg-white/10 backdrop-blur-md border border-white/20 rounded-xl animate-pulse'
                />
              ))}
            </div>
          </div>
          <div className='p-8 flex flex-col justify-center'>
            <div className='space-y-4'>
              <div className='h-8 bg-white/10 rounded animate-pulse' />
              <div className='h-6 bg-white/10 rounded animate-pulse' />
              <div className='h-10 bg-white/10 rounded animate-pulse' />
            </div>
          </div>
          <div />
        </div>
      </div>
    );
  }

  if (error || !data || data.length === 0) {
    return null;
  }

  const activeSlide = data[selectedIndex];

  return (
    <div className='relative w-full h-[85vh]  overflow-hidden'>
      {/* Background images - exit animation only */}
      <div className='absolute inset-0'>
        {/* Current image (appears instantly, no entrance animation) */}
        {activeSlide && (
          <div className='absolute inset-0'>
            <Image
              src={activeSlide.image}
              alt={activeSlide.title || 'Background image'}
              fill
              className='object-cover'
              sizes='100vw'
              priority
            />
          </div>
        )}

        {/* Exiting image (fades out only) */}
        {exitingImage && (
          <div
            className={`absolute inset-0 transition-opacity duration-500 ease-out pointer-events-none ${
              shouldFadeOut ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <Image
              src={exitingImage}
              alt='Exiting background image'
              fill
              className='object-cover'
              sizes='100vw'
            />
          </div>
        )}

        <div className='absolute inset-0 bg-black/40' />
      </div>

      <div className='md:hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-between w-full max-w-6xl px-4'>
        <button
          onClick={onPrevButtonClick}
          disabled={prevBtnDisabled}
          className=' w-10 h-10 cursor-pointer bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg'
        >
          <ChevronLeft className='w-4 h-4' />
        </button>
        <button
          onClick={onNextButtonClick}
          disabled={nextBtnDisabled}
          className='  w-10 h-10 cursor-pointer bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg'
        >
          <ChevronRight className='w-4 h-4' />
        </button>
      </div>

      {/* 3-column grid overlay */}
      <div className='relative z-10 box flex h-full'>
        {/* Column 1: Navigation slider */}
        <div className='p-8 hidden md:flex flex-col justify-center max-w-sm w-full'>
          <div className='relative'>
            <div
              className='embla-vertical'
              ref={emblaRef}
            >
              <div className='embla__container-vertical flex flex-col h-[400px]'>
                {data.map((slide, index) => (
                  <div
                    key={index}
                    className='embla__slide-vertical flex-[0_0_33.333%] min-h-0 relative'
                    style={{ paddingTop: '10px', paddingBottom: '10px' }}
                  >
                    <div className='relative h-full w-full'>
                      <div
                        className={`relative h-full w-full cursor-pointer overflow-hidden rounded-lg transition-all duration-300  ${
                          index === selectedIndex && 'border-red-500 border-b-4'
                        }`}
                        onClick={() => emblaApi?.scrollTo(index)}
                      >
                        <Image
                          src={slide.image}
                          alt={slide.title || 'Slide image'}
                          fill
                          className='object-cover'
                          sizes='300px'
                        />
                        <div className='absolute inset-0 bg-black/20' />
                        {slide.title && (
                          <div className='absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent'>
                            <h4 className='text-white text-xs font-medium line-clamp-1'>
                              {slide.title}
                            </h4>
                          </div>
                        )}
                      </div>
                      {/* Red border under active slide */}
                      {/* {index === selectedIndex && (
                        <div className='absolute bottom-0 left-0 right-0 h-[3px] bg-red-500 rounded-b-lg' />
                      )} */}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation arrows for the slider */}
            <button
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
              className='absolute -top-10 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg'
            >
              <ChevronUp className='w-4 h-4' />
            </button>
            <button
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
              className='absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg'
            >
              <ChevronDown className='w-4 h-4' />
            </button>
          </div>
        </div>

        {/* Column 2: Active slide information */}
        <div className='p-8 flex flex-col justify-center'>
          <div className='max-w-xl w-full'>
            {/* Title - Fixed position and height */}
            <div className='h-10 mb-2'>
              {activeSlide.title && (
                <h2 className='text-xl md:text-4xl font-semibold text-white leading-tight line-clamp-1'>
                  {activeSlide.title}
                </h2>
              )}
            </div>

            {/* Subtitle - Fixed position and height */}
            <div className='h-10 mb-4'>
              {activeSlide.subtitle && (
                <p className='text-lg line-clamp-2 text-gray-200 leading-relaxed'>
                  {activeSlide.subtitle}
                </p>
              )}
            </div>

            {/* Description - Fixed position and height */}
            <div className='h-32 mb-12'>
              {activeSlide.description && (
                <p className='text-base text-gray-300 leading-relaxed line-clamp-5'>
                  {activeSlide.description}
                </p>
              )}
            </div>

            {/* CTA Button - Fixed position */}
            <div className='h-14'>
              {activeSlide.link && activeSlide.linktext && (
                <Link
                  href={activeSlide.link}
                  className='inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white font-medium hover:bg-white/30 transition-all duration-200 shadow-lg'
                >
                  {activeSlide.linktext}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Column 3: Empty space */}
        <div />
      </div>
    </div>
  );
}
