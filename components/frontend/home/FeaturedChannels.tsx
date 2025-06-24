import { Channel } from '@/types';
import FeaturedCarousel from './FeaturedCarousel';

type TProps = {
  channels: Channel[];
};

export default function FeaturedChannels({ channels }: TProps) {
  return (
    <div>
      {channels.map((item, idx) => (
        <FeaturedCarousel
          key={idx}
          items={item.stations}
          title={item.name}
          type='stations'
          link={`/channels/${item.slug}`}
          linkText='View This Channel'
        />
      ))}
    </div>
  );
}
