import { Network } from '@/types';
import FeaturedCarousel from './FeaturedCarousel';

type TProps = {
  networks: Network[];
};

export default function FeaturedNetworks({ networks }: TProps) {
  return (
    <div>
      {networks.map((item, idx) => (
        <FeaturedCarousel
          key={idx}
          items={item.city}
          title={item.name}
          type='networks'
          link={`/networks/${item.slug}`}
          linkText='View This Network'
        />
      ))}
    </div>
  );
}
