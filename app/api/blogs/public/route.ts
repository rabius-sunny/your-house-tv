import db from '@/config/db';
import { NextRequest, NextResponse } from 'next/server';

// GET - Get all public blogs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blogSlug = searchParams.get('slug');
    const featured = searchParams.get('featured');
    const categorySlug = searchParams.get('category');

    if (blogSlug) {
      // Get specific blog by slug
      const blog = await db.blog.findUnique({
        where: { slug: blogSlug },
        include: {
          categories: {
            select: {
              id: true,
              name: true,
              slug: true,
              thumbnail: true
            }
          }
        }
      });

      if (!blog) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
      }

      return NextResponse.json(blog);
    } else {
      // Build query conditions
      const whereClause: any = {};

      if (featured === 'true') {
        whereClause.isFeatured = true;
      }

      if (categorySlug) {
        // Find category first
        const category = await db.blogCategory.findUnique({
          where: { slug: categorySlug }
        });

        if (category) {
          whereClause.categories = {
            some: {
              id: category.id
            }
          };
        }
      }

      // Get all public blogs with optional filtering
      const blogs = await db.blog.findMany({
        where: whereClause,
        include: {
          categories: {
            select: {
              id: true,
              name: true,
              slug: true,
              thumbnail: true
            }
          }
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
      });

      return NextResponse.json(blogs);
    }
  } catch (error) {
    console.error('Error fetching public blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}
