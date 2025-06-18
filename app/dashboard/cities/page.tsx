import { baseUrl } from '@/lib/utils';
import CityComp from './City';

type TProps = {};

export default async function NetworkPage({}: TProps) {
  const data = await fetch(baseUrl + '/api/network', {
    next: { tags: ['cities'] }
  });
  if (!data.ok) {
    return <div>Error on fetching cities</div>;
  }
  const networks = await data.json();
  return (
    <div>
      <CityComp networks={networks} />
    </div>
  );
}
