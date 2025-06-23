import db from '@/config/db';
import { createNetworkSchema } from '@/helper/schema/network';
import { generateSlug } from '@/utils/utils';
import { NextRequest, NextResponse } from 'next/server';

// GET - Get all networks or a specific network by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      // Get specific network by slug
      const network = await db.network.findUnique({
        where: { slug },
        include: {
          city: {
            include: {
              channels: true
            }
          }
        }
      });

      if (!network) {
        return NextResponse.json(
          { error: 'Network not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(network);
    } else {
      // Get all networks
      const networks = await db.network.findMany({
        include: {
          city: {
            include: {
              channels: true
            }
          }
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
      });

      return NextResponse.json(networks);
    }
  } catch (error) {
    console.error('Error fetching networks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch networks' },
      { status: 500 }
    );
  }
}

// POST - Create a new network
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const { error } = createNetworkSchema.safeParse(body);
    if (error) {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.errors },
        { status: 400 }
      );
    }

    // Create the network
    const network = await db.network.create({
      data: { ...body, slug: generateSlug(body.name) }
    });

    return NextResponse.json(network, { status: 201 });
  } catch (error) {
    console.error('Error creating network:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create network' },
      { status: 500 }
    );
  }
}

// PUT - Update a network
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, ...updateData } = body;

    if (!slug) {
      return NextResponse.json(
        { error: 'Network slug is required' },
        { status: 400 }
      );
    }

    // Check if network exists
    const existingNetwork = await db.network.findUnique({
      where: { slug }
    });

    if (!existingNetwork) {
      return NextResponse.json({ error: 'Network not found' }, { status: 404 });
    }

    // Update the network
    const updatedNetwork = await db.network.update({
      where: { slug },
      data: updateData
    });

    return NextResponse.json(updatedNetwork);
  } catch (error) {
    console.error('Error updating network:', error);
    return NextResponse.json(
      { error: 'Failed to update network' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a network
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Network slug is required' },
        { status: 400 }
      );
    }

    // Check if network exists
    const existingNetwork = await db.network.findUnique({
      where: { slug },
      include: {
        city: true
      }
    });

    if (!existingNetwork) {
      return NextResponse.json({ error: 'Network not found' }, { status: 404 });
    }

    // Check if network has cities (optional: prevent deletion if has cities)
    if (existingNetwork.city.length > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete network with existing cities. Please delete all cities first.',
          citiesCount: existingNetwork.city.length
        },
        { status: 400 }
      );
    }

    // Delete the network
    await db.network.delete({
      where: { slug }
    });

    return NextResponse.json(
      { message: 'Network deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting network:', error);
    return NextResponse.json(
      { error: 'Failed to delete network' },
      { status: 500 }
    );
  }
}
