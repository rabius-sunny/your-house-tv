import db from '@/config/db';
import { createVlogCategorySchema } from '@/helper/schema';
import { NextRequest, NextResponse } from 'next/server';

// GET - Get all categories or a specific category by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('id');

    if (categoryId) {
      // Get specific category by ID
      const category = await db.vlogCategory.findUnique({
        where: { id: categoryId }
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
        description: body.description,
        thumbnail: body.thumbnail,
        isFeatured: body.isFeatured || false
      }
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

// PUT - Update a category
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await db.vlogCategory.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Update the category
    const updatedCategory = await db.vlogCategory.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a category
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('id');

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await db.vlogCategory.findUnique({
      where: { id: categoryId }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Delete the category
    await db.vlogCategory.delete({
      where: { id: categoryId }
    });

    return NextResponse.json(
      { message: 'Category deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
