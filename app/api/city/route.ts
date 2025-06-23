import db from '@/config/db';
import { createCitySchema } from '@/helper/schema/city';
import { generateSlug } from '@/utils/utils';
import { NextRequest, NextResponse } from 'next/server';

// GET - Get all cities or a specific city by slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const citySlug = searchParams.get('slug');
    const networkSlug = searchParams.get('networkSlug');

    if (citySlug) {
      // Get specific city by slug
      const city = await db.city.findUnique({
        where: { slug: citySlug },
        include: {
          network: true,
          channels: true
        }
      });

      if (!city) {
        return NextResponse.json({ error: 'City not found' }, { status: 404 });
      }

      return NextResponse.json(city);
    } else if (networkSlug) {
      // Get cities by network slug
      const cities = await db.city.findMany({
        where: {
          network: {
            slug: networkSlug
          }
        },
        include: {
          network: true,
          channels: true
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
      });

      return NextResponse.json(cities);
    } else {
      // Get all cities
      const cities = await db.city.findMany({
        include: {
          network: true,
          channels: true
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
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

    // Check if the network exists by slug
    const network = await db.network.findUnique({
      where: { slug: body.networkSlug }
    });

    if (!network) {
      return NextResponse.json({ error: 'Network not found' }, { status: 404 });
    }

    const { networkSlug, ...rest } = body;

    // Create the city
    const city = await db.city.create({
      data: {
        ...rest,
        slug: generateSlug(body.name),
        networkId: network.id
      }
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
    const { slug, ...updateData } = body;

    if (!slug) {
      return NextResponse.json(
        { error: 'City slug is required' },
        { status: 400 }
      );
    }

    // Check if city exists
    const existingCity = await db.city.findUnique({
      where: { slug }
    });

    if (!existingCity) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    // If networkSlug is being updated, check if the network exists
    let networkId = updateData.networkId;
    if (updateData.networkSlug) {
      const network = await db.network.findUnique({
        where: { slug: updateData.networkSlug }
      });

      if (!network) {
        return NextResponse.json(
          { error: 'Network not found' },
          { status: 404 }
        );
      }
      networkId = network.id;
      delete updateData.networkSlug;
    }

    // Update slug if name is being updated
    if (updateData.name) {
      updateData.slug = generateSlug(updateData.name);
    }

    // Update the city
    const updatedCity = await db.city.update({
      where: { slug },
      data: {
        ...updateData,
        ...(networkId && { networkId })
      },
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
    const citySlug = searchParams.get('slug');

    if (!citySlug) {
      return NextResponse.json(
        { error: 'City slug is required' },
        { status: 400 }
      );
    }

    // Check if city exists
    const existingCity = await db.city.findUnique({
      where: { slug: citySlug },
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
      where: { slug: citySlug }
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
