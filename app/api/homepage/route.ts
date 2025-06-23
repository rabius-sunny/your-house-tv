import db from '@/config/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Execute both database calls concurrently
    const [slidersSettings, networks, cities, channels, stations, vlogs] =
      await Promise.all([
        db.settings.findUnique({
          where: { key: 'hero_sliders' }
        }),
        db.network.findMany({
          where: { isFeatured: true },
          select: {
            isFeatured: true,
            sortOrder: true,
            thumbnail: true,
            slug: true,
            name: true
          },
          orderBy: [{ sortOrder: 'desc' }]
        }),
        db.city.findMany({
          where: { isFeatured: true },
          select: {
            isFeatured: true,
            sortOrder: true,
            thumbnail: true,
            slug: true,
            name: true,
            network: {
              select: {
                name: true
              }
            }
          },
          orderBy: [{ sortOrder: 'desc' }]
        }),
        db.channel.findMany({
          where: { isFeatured: true },
          select: {
            isFeatured: true,
            sortOrder: true,
            thumbnail: true,
            slug: true,
            name: true,
            city: {
              select: {
                name: true
              }
            }
          },
          orderBy: [{ sortOrder: 'desc' }]
        }),
        db.station.findMany({
          where: { isFeatured: true },
          select: {
            isFeatured: true,
            sortOrder: true,
            thumbnail: true,
            slug: true,
            name: true
          }
        }),
        db.vlog.findMany({
          where: { isFeatured: true },
          select: {
            isFeatured: true,
            title: true,
            slug: true,
            thumbnail: true
          }
        })
      ]);

    // Parse the JSON value
    const sliders = JSON.parse((slidersSettings?.value as string) || '[]');
    return NextResponse.json(
      { sliders, networks, cities, channels, stations, vlogs },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching sliders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sliders' },
      { status: 500 }
    );
  }
}
