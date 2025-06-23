import db from '@/config/db';
import { createCitySchema } from '@/helper/schema/city';
import { NextRequest, NextResponse } from 'next/server';

// GET - Get all cities or a specific city by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get('id');
    const networkId = searchParams.get('networkId');

    if (cityId) {
      // Get specific city by ID
      const city = await db.city.findUnique({
        where: { id: cityId },
        include: {
          network: true,
          channels: true
        }
      });

      if (!city) {
        return NextResponse.json({ error: 'City not found' }, { status: 404 });
      }

      return NextResponse.json(city);
    } else if (networkId) {
      // Get cities by network ID
      const cities = await db.city.findMany({
        where: { networkId },
        include: {
          network: true,
          channels: true
        },
        orderBy: [
          { isFeatured: 'desc' },
          { sortOrder: 'desc' },
          { createdAt: 'desc' }
        ]
      });

      return NextResponse.json(cities);
    } else {
      // Get all cities
      const cities = await db.city.findMany({
        include: {
          network: true,
          channels: true
        },
        orderBy: [
          { isFeatured: 'desc' },
          { sortOrder: 'desc' },
          { createdAt: 'desc' }
        ]
      });

      return NextResponse.json(cities);
    }
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    );
  }
}

// POST - Create a new city
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const { error } = createCitySchema.safeParse(body);
    if (error) {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.errors },
        { status: 400 }
      );
    }

    // Check if the network exists
    const network = await db.network.findUnique({
      where: { id: body.networkId }
    });

    if (!network) {
      return NextResponse.json({ error: 'Network not found' }, { status: 404 });
    }

    // Create the city
    const city = await db.city.create({
      data: body
    });

    return NextResponse.json(city, { status: 201 });
  } catch (error) {
    console.error('Error creating city:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create city' },
      { status: 500 }
    );
  }
}

// PUT - Update a city
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'City ID is required' },
        { status: 400 }
      );
    }

    // Check if city exists
    const existingCity = await db.city.findUnique({
      where: { id }
    });

    if (!existingCity) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    // If networkId is being updated, check if the network exists
    if (updateData.networkId) {
      const network = await db.network.findUnique({
        where: { id: updateData.networkId }
      });

      if (!network) {
        return NextResponse.json(
          { error: 'Network not found' },
          { status: 404 }
        );
      }
    }

    // Update the city
    const updatedCity = await db.city.update({
      where: { id },
      data: updateData,
      include: {
        network: true,
        channels: true
      }
    });

    return NextResponse.json(updatedCity);
  } catch (error) {
    console.error('Error updating city:', error);
    return NextResponse.json(
      { error: 'Failed to update city' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a city
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get('id');

    if (!cityId) {
      return NextResponse.json(
        { error: 'City ID is required' },
        { status: 400 }
      );
    }

    // Check if city exists
    const existingCity = await db.city.findUnique({
      where: { id: cityId },
      include: {
        channels: true
      }
    });

    if (!existingCity) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    // Check if city has channels (optional: prevent deletion if has channels)
    if (existingCity.channels.length > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete city with existing channels. Please delete all channels first.',
          channelsCount: existingCity.channels.length
        },
        { status: 400 }
      );
    }

    // Delete the city
    await db.city.delete({
      where: { id: cityId }
    });

    return NextResponse.json(
      { message: 'City deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting city:', error);
    return NextResponse.json(
      { error: 'Failed to delete city' },
      { status: 500 }
    );
  }
}
