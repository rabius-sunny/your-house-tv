import HeroCarousel from '@/components/frontend/carousel/HeroCarousel';
import BottomCarousel from '@/components/frontend/home/BottomCarousel';
import FeaturedCarousel from '@/components/frontend/home/FeaturedCarousel';
import FeaturedChannels from '@/components/frontend/home/FeaturedChannels';
import FeaturedNetworks from '@/components/frontend/home/FeaturedNetworks';
import { baseUrl } from '@/lib/utils';

export default async function page() {
  const res = await fetch(baseUrl + '/api/homepage');
  const data = await res.json();

  return (
    <div>
      <HeroCarousel slides={data.sliders} />
      <FeaturedCarousel
        title='Networks'
        items={data.networks || []}
        type='networks'
      />
      <FeaturedNetworks networks={data.featuredNetworks || []} />
      <FeaturedChannels channels={data.channels || []} />
      <FeaturedCarousel
        title='Video Shows | Vlogs'
        items={data.vlogs || []}
        type='videos'
      />
      <BottomCarousel />
    </div>
  );
}
