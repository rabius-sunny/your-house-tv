import db from '@/config/db';
import { handleError } from '@/helper/errorHandler';
import { createBlogCategorySchema } from '@/helper/schema';
import { generateSlug } from '@/utils/utils';
import { NextRequest, NextResponse } from 'next/server';

// GET - Get all blog categories or a specific category by slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('slug');

    if (categorySlug) {
      // Get specific category by slug
      const category = await db.blogCategory.findUnique({
        where: { slug: categorySlug },
        include: {
          blogs: {
            select: {
              id: true,
              title: true,
              slug: true,
              thumbnail: true,
              isFeatured: true,
              createdAt: true
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
      // Get all categories
      const categories = await db.blogCategory.findMany({
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
    console.error('Error fetching blog categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog categories' },
      { status: 500 }
    );
  }
}

// POST - Create a new blog category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validationResult = createBlogCategorySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid data provided',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    // Create the category
    const category = await db.blogCategory.create({
      data: {
        name: body.name,
        slug: generateSlug(body.name),
        description: body.description,
        thumbnail: body.thumbnail,
        isFeatured: body.isFeatured || false
      }
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

// PUT - Update a blog category
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, ...updateData } = body;

    if (!slug) {
      return NextResponse.json(
        { error: 'Blog category slug is required' },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await db.blogCategory.findUnique({
      where: { slug }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Blog category not found' },
        { status: 404 }
      );
    }

    // If name is being updated, regenerate slug
    if (updateData.name) {
      updateData.slug = generateSlug(updateData.name);
    }

    // Update the category
    const updatedCategory = await db.blogCategory.update({
      where: { slug },
      data: updateData
    });

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

// DELETE - Delete a blog category
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('id');

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Blog category ID is required' },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await db.blogCategory.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: {
            blogs: true
          }
        }
      }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Blog category not found' },
        { status: 404 }
      );
    }

    // Check if category has blogs
    if (existingCategory._count.blogs > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete category with associated blogs',
          details: `This category has ${existingCategory._count.blogs} blog(s) associated with it. Please reassign or delete the blogs first.`
        },
        { status: 400 }
      );
    }

    // Delete the category
    await db.blogCategory.delete({
      where: { id: categoryId }
    });

    return NextResponse.json(
      { message: 'Blog category deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
