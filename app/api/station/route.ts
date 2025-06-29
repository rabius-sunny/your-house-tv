import db from '@/config/db';
import { handleError } from '@/helper/errorHandler';
import { createStationSchema } from '@/helper/schema/station';
import { generateSlug } from '@/utils/utils';
import { NextRequest, NextResponse } from 'next/server';

// GET - Get all stations or a specific station by slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stationSlug = searchParams.get('slug');
    const channelSlug = searchParams.get('channelSlug');

    if (stationSlug) {
      // Get specific station by slug
      const station = await db.station.findUnique({
        where: { slug: stationSlug },
        include: {
          channel: true
        }
      });

      if (!station) {
        return NextResponse.json(
          { error: 'Station not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(station);
    } else if (channelSlug) {
      // Get stations by channel slug
      const stations = await db.station.findMany({
        where: {
          channel: {
            slug: channelSlug
          }
        },
        include: {
          channel: true
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
      });

      return NextResponse.json(stations);
    } else {
      // Get all stations
      const stations = await db.station.findMany({
        include: {
          channel: true
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
      });

      return NextResponse.json(stations);
    }
  } catch (error) {
    console.error('Error fetching stations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stations' },
      { status: 500 }
    );
  }
}

// POST - Create a new station
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Convert date strings to Date objects if they're strings
    if (body.startedAt && typeof body.startedAt === 'string') {
      body.startedAt = new Date(body.startedAt);
    }
    if (body.endedAt && typeof body.endedAt === 'string') {
      body.endedAt = new Date(body.endedAt);
    }

    // Validate the request body
    const validationResult = createStationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid data provided',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    // Check if the channel exists by slug
    const channel = await db.channel.findUnique({
      where: { id: body.channelId }
    });

    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    const slug = channel.slug + '-' + generateSlug(body.name);

    // Create the station
    const station = await db.station.create({
      data: {
        name: body.name,
        slug,
        thumbnail: body.thumbnail,
        startedAt: body.startedAt,
        endedAt: body.endedAt,
        videos: body.videos,
        isFeatured: body.isFeatured || false,
        channelId: channel.id,
        description: body.description || ''
      }
    });

    return NextResponse.json(station, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

// PUT - Update a station
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, ...updateData } = body;

    if (!slug) {
      return NextResponse.json(
        { error: 'Station slug is required' },
        { status: 400 }
      );
    }

    // Convert date strings to Date objects if they're strings
    if (updateData.startedAt && typeof updateData.startedAt === 'string') {
      updateData.startedAt = new Date(updateData.startedAt);
    }
    if (updateData.endedAt && typeof updateData.endedAt === 'string') {
      updateData.endedAt = new Date(updateData.endedAt);
    }

    // Check if station exists
    const existingStation = await db.station.findUnique({
      where: { slug }
    });

    if (!existingStation) {
      return NextResponse.json({ error: 'Station not found' }, { status: 404 });
    }

    // Validate date range if both dates are provided
    if (updateData.startedAt && updateData.endedAt) {
      if (updateData.endedAt <= updateData.startedAt) {
        return NextResponse.json(
          { error: 'End date must be after start date' },
          { status: 400 }
        );
      }
    }

    // Check if the channel exists by slug
    const channel = await db.channel.findUnique({
      where: { id: body.channelId }
    });

    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    const updatedSlug = channel.slug + '-' + generateSlug(body.name);

    // Update the station
    const updatedStation = await db.station.update({
      where: { slug },
      data: { ...updateData, slug: updatedSlug }
    });

    return NextResponse.json(updatedStation);
  } catch (error) {
    return handleError(error);
  }
}

// DELETE - Delete a station
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Station id is required' },
        { status: 400 }
      );
    }

    // Check if station exists
    const existingStation = await db.station.findUnique({
      where: { id }
    });

    if (!existingStation) {
      return NextResponse.json({ error: 'Station not found' }, { status: 404 });
    }

    // Delete the station
    await db.station.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Station deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
