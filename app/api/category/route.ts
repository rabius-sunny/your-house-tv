import db from '@/config/db';
import { handleError } from '@/helper/errorHandler';
import { createVlogCategorySchema } from '@/helper/schema';
import { generateSlug } from '@/utils/utils';
import { NextRequest, NextResponse } from 'next/server';

// GET - Get all categories or a specific category by slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('slug');

    if (categorySlug) {
      // Get specific category by slug
      const category = await db.vlogCategory.findUnique({
        where: { slug: categorySlug }
      });

      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(category);
    } else {
      // Get all categories
      const categories = await db.vlogCategory.findMany({
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
      });

      return NextResponse.json(categories);
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - Create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validationResult = createVlogCategorySchema.safeParse(body);
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
    const category = await db.vlogCategory.create({
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

// PUT - Update a category
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, ...updateData } = body;

    if (!slug) {
      return NextResponse.json(
        { error: 'Category slug is required' },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await db.vlogCategory.findUnique({
      where: { slug }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // If name is being updated, regenerate slug
    if (updateData.name) {
      updateData.slug = generateSlug(updateData.name);
    }

    // Update the category
    const updatedCategory = await db.vlogCategory.update({
      where: { slug },
      data: updateData
    });

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

// DELETE - Delete a category
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('slug');

    if (!categorySlug) {
      return NextResponse.json(
        { error: 'Category slug is required' },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await db.vlogCategory.findUnique({
      where: { slug: categorySlug }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Delete the category
    await db.vlogCategory.delete({
      where: { slug: categorySlug }
    });

    return NextResponse.json(
      { message: 'Category deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
