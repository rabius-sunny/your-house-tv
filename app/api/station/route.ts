import db from '@/config/db';
import { createStationSchema } from '@/helper/schema/station';
import { NextRequest, NextResponse } from 'next/server';

// GET - Get all stations or a specific station by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stationId = searchParams.get('id');
    const channelId = searchParams.get('channelId');

    if (stationId) {
      // Get specific station by ID
      const station = await db.station.findUnique({
        where: { id: stationId },
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
    } else if (channelId) {
      // Get stations by channel ID
      const stations = await db.station.findMany({
        where: { channelId },
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

    // Check if the channel exists
    const channel = await db.channel.findUnique({
      where: { id: body.channelId }
    });

    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    // Create the station
    const station = await db.station.create({
      data: {
        name: body.name,
        thumbnail: body.thumbnail,
        startedAt: body.startedAt,
        endedAt: body.endedAt,
        videos: body.videos,
        isFeatured: body.isFeatured || false,
        channelId: body.channelId
      }
    });

    return NextResponse.json(station, { status: 201 });
  } catch (error) {
    console.error('Error creating station:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create station' },
      { status: 500 }
    );
  }
}

// PUT - Update a station
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Station ID is required' },
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
      where: { id }
    });

    if (!existingStation) {
      return NextResponse.json({ error: 'Station not found' }, { status: 404 });
    }

    // If channelId is being updated, check if the channel exists
    if (updateData.channelId) {
      const channel = await db.channel.findUnique({
        where: { id: updateData.channelId }
      });

      if (!channel) {
        return NextResponse.json(
          { error: 'Channel not found' },
          { status: 404 }
        );
      }
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

    // Update the station
    const updatedStation = await db.station.update({
      where: { id },
      data: updateData,
      include: {
        channel: {
          include: {
            city: {
              include: {
                network: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(updatedStation);
  } catch (error) {
    console.error('Error updating station:', error);
    return NextResponse.json(
      { error: 'Failed to update station' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a station
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stationId = searchParams.get('id');

    if (!stationId) {
      return NextResponse.json(
        { error: 'Station ID is required' },
        { status: 400 }
      );
    }

    // Check if station exists
    const existingStation = await db.station.findUnique({
      where: { id: stationId }
    });

    if (!existingStation) {
      return NextResponse.json({ error: 'Station not found' }, { status: 404 });
    }

    // Delete the station
    await db.station.delete({
      where: { id: stationId }
    });

    return NextResponse.json(
      { message: 'Station deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting station:', error);
    return NextResponse.json(
      { error: 'Failed to delete station' },
      { status: 500 }
    );
  }
}
