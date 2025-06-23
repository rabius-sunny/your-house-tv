import db from '@/config/db';
import { NextRequest, NextResponse } from 'next/server';

// GET - Get featured cities ordered by sortOrder
export async function GET(request: NextRequest) {
  try {
    const cities = await db.city.findMany({
      where: { isFeatured: true },
      include: {
        network: true,
        channels: true
      },
      orderBy: [{ sortOrder: 'desc' }]
    });

    return NextResponse.json(cities);
  } catch (error) {
    console.error('Error fetching featured cities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured cities' },
      { status: 500 }
    );
  }
}
