import db from '@/config/db';
import { handleError } from '@/helper/errorHandler';
import { createVlogSchema } from '@/helper/schema/vlog';
import { generateSlug } from '@/utils/utils';
import { NextRequest, NextResponse } from 'next/server';

// GET - Get all vlogs or a specific vlog by slug
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

    const slug = generateSlug(body.title);

    // Check if slug already exists
    const existingVlog = await db.vlog.findUnique({
      where: { slug }
    });

    if (existingVlog) {
      return NextResponse.json(
        { error: 'A vlog with this title already exists' },
        { status: 409 }
      );
    }

    // Create the vlog
    const vlog = await db.vlog.create({
      data: {
        title: body.title,
        slug,
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
    return handleError(error);
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

    const { slug, ...updateData } = body;

    // Check if vlog exists
    const existingVlog = await db.vlog.findUnique({
      where: { slug }
    });

    if (!existingVlog) {
      return NextResponse.json({ error: 'Vlog not found' }, { status: 404 });
    }

    // If title is being updated, generate new slug and check for conflicts
    if (updateData.title && updateData.title !== existingVlog.title) {
      const newSlug = generateSlug(updateData.title);
      const slugExists = await db.vlog.findUnique({
        where: { slug: newSlug }
      });

      if (slugExists && slugExists.slug !== slug) {
        return NextResponse.json(
          { error: 'A vlog with this title already exists' },
          { status: 409 }
        );
      }

      updateData.slug = newSlug;
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
      where: { slug },
      data: updateData,
      include: {
        categories: true
      }
    });

    return NextResponse.json(updatedVlog);
  } catch (error) {
    return handleError(error);
  }
}

// DELETE - Delete a vlog
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vlogSlug = searchParams.get('slug');

    if (!vlogSlug) {
      return NextResponse.json(
        { error: 'Vlog slug is required' },
        { status: 400 }
      );
    }

    // Check if vlog exists
    const existingVlog = await db.vlog.findUnique({
      where: { slug: vlogSlug }
    });

    if (!existingVlog) {
      return NextResponse.json({ error: 'Vlog not found' }, { status: 404 });
    }

    // Delete the vlog
    await db.vlog.delete({
      where: { slug: vlogSlug }
    });

    return NextResponse.json(
      { message: 'Vlog deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
