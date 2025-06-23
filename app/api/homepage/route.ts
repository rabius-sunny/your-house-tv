import db from '@/config/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Execute both database calls concurrently
    const [slidersSettings, cities] = await Promise.all([
      db.settings.findUnique({
        where: { key: 'hero_sliders' }
      }),
      db.city.findMany({
        where: { isFeatured: true },
        select: {
          isFeatured: true,
          sortOrder: true,
          thumbnail: true,
          slug: true
        },
        orderBy: [{ sortOrder: 'desc' }]
      })
    ]);

    // Parse the JSON value
    const sliders = JSON.parse((slidersSettings?.value as string) || '[]');
    return NextResponse.json({ sliders, cities }, { status: 200 });
  } catch (error) {
    console.error('Error fetching sliders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sliders' },
      { status: 500 }
    );
  }
}
