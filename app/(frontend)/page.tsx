import { baseUrl } from '@/lib/utils';
import Home from './Home';

export default async function page() {
  const data = await fetch(baseUrl + '/api/sliders');
  const json = await data.json();
  return (
    <div>
      <Home data={{ sliders: json }} />
    </div>
  );
}
