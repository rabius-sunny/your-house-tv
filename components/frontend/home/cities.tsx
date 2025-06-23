import { City } from '@/types';
import Image from 'next/image';

type TProps = {
  cities: City[];
};

export default function FCities({ cities }: TProps) {
  console.log('cities', cities);
  return (
    <div className=' py-10 bg-slate-700'>
      <div className='box grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {cities.map((city, idx) => (
          <div key={idx}>
            <Image
              src={city.thumbnail || '/placeholder.webp'}
              alt='city'
              width={300}
              height={200}
              className='w-full h-auto object-cover rounded-lg'
            />
          </div>
        ))}
      </div>
    </div>
  );
}
