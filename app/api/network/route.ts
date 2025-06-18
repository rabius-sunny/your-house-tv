import { NextRequest, NextResponse } from 'next/server';
import db from '@/config/db';
import { createNetworkSchema } from '@/helper/schema/network';

// GET - Get all networks or a specific network by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const networkId = searchParams.get('id');

    if (networkId) {
      // Get specific network by ID
      const network = await db.network.findUnique({
        where: { id: networkId },
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
    const validatedData = createNetworkSchema.parse(body);

    // Create the network
    const network = await db.network.create({
      data: validatedData,
      include: {
        city: {
          include: {
            channels: true
          }
        }
      }
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
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Network ID is required' },
        { status: 400 }
      );
    }

    // Check if network exists
    const existingNetwork = await db.network.findUnique({
      where: { id }
    });

    if (!existingNetwork) {
      return NextResponse.json({ error: 'Network not found' }, { status: 404 });
    }

    // Update the network
    const updatedNetwork = await db.network.update({
      where: { id },
      data: updateData,
      include: {
        city: {
          include: {
            channels: true
          }
        }
      }
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
    const networkId = searchParams.get('id');

    if (!networkId) {
      return NextResponse.json(
        { error: 'Network ID is required' },
        { status: 400 }
      );
    }

    // Check if network exists
    const existingNetwork = await db.network.findUnique({
      where: { id: networkId },
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
      where: { id: networkId }
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
