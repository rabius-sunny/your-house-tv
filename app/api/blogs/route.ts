import db from '@/config/db';
import { createBlogSchema } from '@/helper/schema';
import { generateSlug } from '@/utils/utils';
import { NextRequest, NextResponse } from 'next/server';

// GET - Get all blogs or a specific blog by slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blogSlug = searchParams.get('slug');
    const featured = searchParams.get('featured');

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

      // Get all blogs with optional filtering
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
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST - Create a new blog
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validationResult = createBlogSchema.safeParse(body);
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
      const categories = await db.blogCategory.findMany({
        where: {
          id: {
            in: body.categoryIds
          }
        }
      });

      if (categories.length !== body.categoryIds.length) {
        return NextResponse.json(
          { error: 'One or more blog categories not found' },
          { status: 404 }
        );
      }
    }

    const slug = generateSlug(body.title);

    // Check if slug already exists
    const existingBlog = await db.blog.findUnique({
      where: { slug }
    });

    if (existingBlog) {
      return NextResponse.json(
        { error: 'A blog with this title already exists' },
        { status: 409 }
      );
    }

    // Create the blog
    const blog = await db.blog.create({
      data: {
        title: body.title,
        slug: slug,
        thumbnail: body.thumbnail,
        description: body.description,
        isFeatured: body.isFeatured || false,
        categoryIds: body.categoryIds || []
      },
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

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}

// PUT - Update a blog
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, ...updateData } = body;

    if (!slug) {
      return NextResponse.json(
        { error: 'Blog slug is required' },
        { status: 400 }
      );
    }

    // Check if blog exists
    const existingBlog = await db.blog.findUnique({
      where: { slug }
    });

    if (!existingBlog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // If title is being updated, regenerate slug
    if (updateData.title) {
      updateData.slug = generateSlug(updateData.title);
    }

    // Check if all categories exist (if provided)
    if (updateData.categoryIds && updateData.categoryIds.length > 0) {
      const categories = await db.blogCategory.findMany({
        where: {
          id: {
            in: updateData.categoryIds
          }
        }
      });

      if (categories.length !== updateData.categoryIds.length) {
        return NextResponse.json(
          { error: 'One or more blog categories not found' },
          { status: 404 }
        );
      }
    }

    // Update the blog
    const updatedBlog = await db.blog.update({
      where: { slug },
      data: updateData,
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

    return NextResponse.json(updatedBlog, { status: 200 });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a blog
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get('id');

    if (!blogId) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    // Check if blog exists
    const existingBlog = await db.blog.findUnique({
      where: { id: blogId }
    });

    if (!existingBlog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Delete the blog
    await db.blog.delete({
      where: { id: blogId }
    });

    return NextResponse.json(
      { message: 'Blog deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}
