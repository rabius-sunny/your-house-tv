import { City } from '@/types';
import Carousel from '../carousel/Carousel';

type TProps = {
  cities: City[];
};

export default function FCities({ cities }: TProps) {
  console.log('cities', cities);
  return (
    <div className=' py-10 bg-slate-700'>
      <Carousel
        slides={cities.map((city) => ({
          thumbnail: city.thumbnail || '/placeholder.webp',
          title: city.name,
          link: `/cities/${city.slug}`
        }))}
      />
    </div>
  );
}
