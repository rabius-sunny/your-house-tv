'use client';

import HeroCarousel from '@/components/frontend/carousel/HeroCarousel';
import { HomePageData } from '@/types';

type TProps = {
  data: HomePageData;
};

export default function Home({ data }: TProps) {
  return (
    <div>
      <HeroCarousel slides={data.sliders} />
    </div>
  );
}
