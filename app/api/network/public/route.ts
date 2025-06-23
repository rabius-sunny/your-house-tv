import db from '@/config/db';
import { NextRequest, NextResponse } from 'next/server';

// GET - Get all networks or a specific network by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      // Get specific network by slug
      const network = await db.network.findUnique({
        where: { slug },
        include: {
          city: {
            include: {
              channels: true
            }
          }
        }
      });

      if (!network) {
        return NextResponse.json(
          { error: 'Network not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(network);
    } else {
      // Get all networks
      const networks = await db.network.findMany({
        orderBy: [{ createdAt: 'desc' }]
      });

      return NextResponse.json(networks);
    }
  } catch (error) {
    console.error('Error fetching networks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch networks' },
      { status: 500 }
    );
  }
}
