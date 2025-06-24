import db from '@/config/db';
import { NextRequest, NextResponse } from 'next/server';

// GET - Get all public blog categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('slug');
    const featured = searchParams.get('featured');

    if (categorySlug) {
      // Get specific category by slug with its blogs
      const category = await db.blogCategory.findUnique({
        where: { slug: categorySlug },
        include: {
          blogs: {
            select: {
              id: true,
              title: true,
              slug: true,
              thumbnail: true,
              description: true,
              isFeatured: true,
              createdAt: true,
              categories: {
                select: {
                  id: true,
                  name: true,
                  slug: true
                }
              }
            },
            orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
          },
          _count: {
            select: {
              blogs: true
            }
          }
        }
      });

      if (!category) {
        return NextResponse.json(
          { error: 'Blog category not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(category);
    } else {
      // Build query conditions
      const whereClause: any = {};

      if (featured === 'true') {
        whereClause.isFeatured = true;
      }

      // Get all public categories
      const categories = await db.blogCategory.findMany({
        where: whereClause,
        include: {
          _count: {
            select: {
              blogs: true
            }
          }
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
      });

      return NextResponse.json(categories);
    }
  } catch (error) {
    console.error('Error fetching public blog categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog categories' },
      { status: 500 }
    );
  }
}
