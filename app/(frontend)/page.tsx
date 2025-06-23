import HeroCarousel from '@/components/frontend/carousel/HeroCarousel';
import FeaturedCarousel from '@/components/frontend/home/FeaturedCarousel';
import { baseUrl } from '@/lib/utils';

export default async function page() {
  const res = await fetch(baseUrl + '/api/homepage');
  const data = await res.json();

  return (
    <div>
      <HeroCarousel slides={data.sliders} />
      <FeaturedCarousel
        items={data.networks || []}
        type='networks'
      />
      <FeaturedCarousel
        title={data.cities ? data.cities?.[0]?.network?.name : ''}
        items={data.cities || []}
        type='cities'
      />
      <FeaturedCarousel
        title={data.channels ? data.channels?.[0]?.city?.name : ''}
        items={data.channels || []}
        type='channels'
      />
      <FeaturedCarousel
        title='Video Shows | Vlogs'
        items={data.vlogs || []}
        type='vlogs'
      />
    </div>
  );
}
