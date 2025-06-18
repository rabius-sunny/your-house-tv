import { baseUrl } from '@/lib/utils';
import Network from './Network';

type TProps = {};

export default async function NetworkPage({}: TProps) {
  const data = await fetch(baseUrl + '/api/city', {
    next: { tags: ['cities'] }
  });
  if (!data.ok) {
    return <div>Error on fetching cities</div>;
  }
  const cities = await data.json();
  return (
    <div>
      <Network />
    </div>
  );
}
