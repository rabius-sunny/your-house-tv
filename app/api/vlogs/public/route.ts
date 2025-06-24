import db from '@/config/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vlogSlug = searchParams.get('slug');
    const categoryId = searchParams.get('categoryId');
    const type = searchParams.get('type');
    const featured = searchParams.get('featured');

    if (vlogSlug) {
      // Get specific vlog by slug
      const vlog = await db.vlog.findUnique({
        where: { slug: vlogSlug },
        include: {
          categories: {
            select: {
              name: true,
              slug: true
            }
          }
        }
      });

      if (!vlog) {
        return NextResponse.json({ error: 'Vlog not found' }, { status: 404 });
      }

      return NextResponse.json(vlog);
    } else {
      // Build where clause based on query parameters
      const whereClause: any = {};

      if (categoryId) {
        whereClause.categoryIds = {
          has: categoryId
        };
      }

      if (type && ['VLOG', 'PODCAST'].includes(type)) {
        whereClause.type = type;
      }

      if (featured === 'true') {
        whereClause.isFeatured = true;
      }

      // Get all vlogs with optional filtering
      const vlogs = await db.vlog.findMany({
        where: whereClause,
        select: {
          title: true,
          slug: true,
          thumbnail: true
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
      });

      return NextResponse.json(vlogs);
    }
  } catch (error) {
    console.error('Error fetching vlogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vlogs' },
      { status: 500 }
    );
  }
}
