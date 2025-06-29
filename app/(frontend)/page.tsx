import HeroCarousel from '@/components/frontend/carousel/HeroCarousel';
import BottomCarousel from '@/components/frontend/home/BottomCarousel';
import FeaturedCarousel from '@/components/frontend/home/FeaturedCarousel';
import FeaturedChannels from '@/components/frontend/home/FeaturedChannels';
import { skipApi } from '@/config/site';
import { baseUrl } from '@/lib/utils';

export const metadata = {
  title: 'Home'
};

export default async function page() {
  if (skipApi) {
    return <div>Building site...</div>;
  }
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
