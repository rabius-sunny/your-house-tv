'use client';

import { useAsync } from '@/hooks/useAsync';
import Channels from './Channels';

type TProps = {};

export default function ChannelsPage({}: TProps) {
  const { data } = useAsync('/city');
  return (
    <div>
      <Channels cities={data || []} />
    </div>
  );
}
