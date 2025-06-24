import db from '@/config/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const cityId = searchParams.get('cityId');
    const currentStation = searchParams.get('currentStation');

    if (slug) {
      // Get specific channel by slug
      const channel = await db.channel.findUnique({
        where: { slug },
        include: {
          stations: {
            ...(currentStation && {
              where: {
                NOT: { slug: currentStation }
              }
            }),
            select: {
              slug: true,
              name: true,
              thumbnail: true
            }
          }
        }
      });

      if (!channel) {
        return NextResponse.json(
          { error: 'Channel not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(channel);
    } else if (cityId) {
      // Get channels by city ID
      const channels = await db.channel.findMany({
        where: { cityId },
        include: {
          city: {
            include: {
              network: true
            }
          },
          stations: true
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
      });

      return NextResponse.json(channels);
    } else {
      // Get all channels
      const channels = await db.channel.findMany({
        include: {
          stations: true
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
      });

      return NextResponse.json(channels);
    }
  } catch (error) {
    console.error('Error fetching channels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch channels' },
      { status: 500 }
    );
  }
}
