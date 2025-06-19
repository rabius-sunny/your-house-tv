import db from '@/config/db';
import { createChannelSchema } from '@/helper/schema/channel';
import { NextRequest, NextResponse } from 'next/server';

// GET - Get all channels or a specific channel by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get('id');
    const cityId = searchParams.get('cityId');

    if (channelId) {
      // Get specific channel by ID
      const channel = await db.channel.findUnique({
        where: { id: channelId },
        include: {
          city: {
            include: {
              network: true
            }
          },
          stations: true
        }
      });

      if (!channel) {
        return NextResponse.json(
          { error: 'Channel not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(channel);
    } else if (cityId) {
      // Get channels by city ID
      const channels = await db.channel.findMany({
        where: { cityId },
        include: {
          city: {
            include: {
              network: true
            }
          },
          stations: true
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
      });

      return NextResponse.json(channels);
    } else {
      // Get all channels
      const channels = await db.channel.findMany({
        include: {
          city: {
            include: {
              network: true
            }
          },
          stations: true
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
      });

      return NextResponse.json(channels);
    }
  } catch (error) {
    console.error('Error fetching channels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch channels' },
      { status: 500 }
    );
  }
}

// POST - Create a new channel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validationResult = createChannelSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid data provided',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    // Check if the city exists
    const city = await db.city.findUnique({
      where: { id: body.cityId }
    });

    if (!city) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    // Create the channel
    const channel = await db.channel.create({
      data: {
        name: body.name,
        description: body.description,
        thumbnail: body.thumbnail,
        isFeatured: body.isFeatured || false,
        cityId: body.cityId
      }
    });

    return NextResponse.json(channel, { status: 201 });
  } catch (error) {
    console.error('Error creating channel:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create channel' },
      { status: 500 }
    );
  }
}

// PUT - Update a channel
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Channel ID is required' },
        { status: 400 }
      );
    }

    // Check if channel exists
    const existingChannel = await db.channel.findUnique({
      where: { id }
    });

    if (!existingChannel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    // If cityId is being updated, check if the city exists
    if (updateData.cityId) {
      const city = await db.city.findUnique({
        where: { id: updateData.cityId }
      });

      if (!city) {
        return NextResponse.json({ error: 'City not found' }, { status: 404 });
      }
    }

    // Update the channel
    const updatedChannel = await db.channel.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(updatedChannel);
  } catch (error) {
    console.error('Error updating channel:', error);
    return NextResponse.json(
      { error: 'Failed to update channel' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a channel
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get('id');

    if (!channelId) {
      return NextResponse.json(
        { error: 'Channel ID is required' },
        { status: 400 }
      );
    }

    // Check if channel exists
    const existingChannel = await db.channel.findUnique({
      where: { id: channelId },
      include: {
        stations: true
      }
    });

    if (!existingChannel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    // Check if channel has stations (optional: prevent deletion if has stations)
    if (existingChannel.stations.length > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete channel with existing stations. Please delete all stations first.'
        },
        { status: 400 }
      );
    }

    // Delete the channel
    await db.channel.delete({
      where: { id: channelId }
    });

    return NextResponse.json(
      { message: 'Channel deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting channel:', error);
    return NextResponse.json(
      { error: 'Failed to delete channel' },
      { status: 500 }
    );
  }
}
