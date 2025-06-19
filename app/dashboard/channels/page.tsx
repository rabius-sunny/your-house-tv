'use client';

import { useAsync } from '@/hooks/useAsync';
import ChannelComp from './Channel';

type TProps = {};

export default function NetworkPage({}: TProps) {
  const { data } = useAsync('/city');
  return (
    <div>
      <ChannelComp cities={data || []} />
    </div>
  );
}
