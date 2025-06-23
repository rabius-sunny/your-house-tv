import HeroCarousel from '@/components/frontend/carousel/HeroCarousel';
import FCities from '@/components/frontend/home/cities';
import { baseUrl } from '@/lib/utils';

export default async function page() {
  const res = await fetch(baseUrl + '/api/homepage');
  const data = await res.json();
  return (
    <div>
      <HeroCarousel slides={data.sliders} />
      <FCities cities={data.cities} />
    </div>
  );
}
