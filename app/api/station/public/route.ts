import db from '@/config/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const channelSlug = searchParams.get('channelSlug');

    if (slug) {
      // Get specific station by slug
      const station = await db.station.findUnique({
        where: { slug },
        include: {
          channel: true
        }
      });

      if (!station) {
        return NextResponse.json(
          { error: 'Station not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(station);
    } else if (channelSlug) {
      // Get stations by channel slug
      const stations = await db.station.findMany({
        where: {
          channel: {
            slug: channelSlug
          }
        },
        include: {
          channel: true
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
      });

      return NextResponse.json(stations);
    } else {
      // Get all stations
      const stations = await db.station.findMany({
        include: {
          channel: true
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
      });

      return NextResponse.json(stations);
    }
  } catch (error) {
    console.error('Error fetching stations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stations' },
      { status: 500 }
    );
  }
}
