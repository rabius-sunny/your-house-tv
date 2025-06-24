import db from '@/config/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const citySlug = searchParams.get('slug');
    const networkSlug = searchParams.get('networkSlug');

    if (citySlug) {
      // Get specific city by slug
      const city = await db.city.findUnique({
        where: { slug: citySlug },
        include: {
          network: {
            select: {
              name: true,
              slug: true
            }
          },
          channels: {
            select: {
              name: true,
              slug: true,
              thumbnail: true,
              isFeatured: true
            }
          }
        }
      });

      if (!city) {
        return NextResponse.json({ error: 'City not found' }, { status: 404 });
      }

      return NextResponse.json(city);
    } else if (networkSlug) {
      // Get cities by network slug
      const cities = await db.city.findMany({
        where: {
          network: {
            slug: networkSlug
          }
        },
        include: {
          network: true,
          channels: true
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
      });

      return NextResponse.json(cities);
    } else {
      // Get all cities
      const cities = await db.city.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          thumbnail: true,
          isFeatured: true,
          createdAt: true,
          _count: {
            select: {
              channels: true
            }
          }
        },

        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
      });

      return NextResponse.json(cities);
    }
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    );
  }
}
