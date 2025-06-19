import db from '@/config/db';
import { createVlogSchema } from '@/helper/schema/vlog';
import { NextRequest, NextResponse } from 'next/server';

// GET - Get all vlogs or a specific vlog by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vlogId = searchParams.get('id');
    const categoryId = searchParams.get('categoryId');
    const type = searchParams.get('type');
    const featured = searchParams.get('featured');

    if (vlogId) {
      // Get specific vlog by ID
      const vlog = await db.vlog.findUnique({
        where: { id: vlogId },
        include: {
          categories: true
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
        include: {
          categories: true
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

// POST - Create a new vlog
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validationResult = createVlogSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid data provided',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    // Check if all categories exist
    if (body.categoryIds && body.categoryIds.length > 0) {
      const categories = await db.vlogCategory.findMany({
        where: {
          id: {
            in: body.categoryIds
          }
        }
      });

      if (categories.length !== body.categoryIds.length) {
        return NextResponse.json(
          { error: 'One or more categories not found' },
          { status: 404 }
        );
      }
    }

    // Create the vlog
    const vlog = await db.vlog.create({
      data: {
        title: body.title,
        thumbnail: body.thumbnail,
        description: body.description,
        video: body.video,
        isFeatured: body.isFeatured || false,
        type: body.type || 'VLOG',
        categoryIds: body.categoryIds || [],
        meta: body.meta || null
      },
      include: {
        categories: true
      }
    });

    return NextResponse.json(vlog, { status: 201 });
  } catch (error) {
    console.error('Error creating vlog:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create vlog' },
      { status: 500 }
    );
  }
}

// PUT - Update a vlog
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validationResult = createVlogSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid data provided',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { id, ...updateData } = body;

    // Check if vlog exists
    const existingVlog = await db.vlog.findUnique({
      where: { id }
    });

    if (!existingVlog) {
      return NextResponse.json({ error: 'Vlog not found' }, { status: 404 });
    }

    // If categoryIds are being updated, check if all categories exist
    if (updateData.categoryIds && updateData.categoryIds.length > 0) {
      const categories = await db.vlogCategory.findMany({
        where: {
          id: {
            in: updateData.categoryIds
          }
        }
      });

      if (categories.length !== updateData.categoryIds.length) {
        return NextResponse.json(
          { error: 'One or more categories not found' },
          { status: 404 }
        );
      }
    }

    // Update the vlog
    const updatedVlog = await db.vlog.update({
      where: { id },
      data: updateData,
      include: {
        categories: true
      }
    });

    return NextResponse.json(updatedVlog);
  } catch (error) {
    console.error('Error updating vlog:', error);
    return NextResponse.json(
      { error: 'Failed to update vlog' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a vlog
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vlogId = searchParams.get('id');

    if (!vlogId) {
      return NextResponse.json(
        { error: 'Vlog ID is required' },
        { status: 400 }
      );
    }

    // Check if vlog exists
    const existingVlog = await db.vlog.findUnique({
      where: { id: vlogId }
    });

    if (!existingVlog) {
      return NextResponse.json({ error: 'Vlog not found' }, { status: 404 });
    }

    // Delete the vlog
    await db.vlog.delete({
      where: { id: vlogId }
    });

    return NextResponse.json(
      { message: 'Vlog deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting vlog:', error);
    return NextResponse.json(
      { error: 'Failed to delete vlog' },
      { status: 500 }
    );
  }
}
