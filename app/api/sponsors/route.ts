import db from '@/config/db';
import { createSponsorSchema } from '@/helper/schema/sponsor';
import { NextRequest, NextResponse } from 'next/server';

// GET - Get all sponsors or a specific sponsor by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sponsorId = searchParams.get('id');

    if (sponsorId) {
      // Get specific sponsor by ID
      const sponsor = await db.sponsor.findUnique({
        where: { id: sponsorId }
      });

      if (!sponsor) {
        return NextResponse.json(
          { error: 'Sponsor not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(sponsor);
    } else {
      // Get all sponsors
      const sponsors = await db.sponsor.findMany({
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json(sponsors);
    }
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sponsors' },
      { status: 500 }
    );
  }
}

// POST - Create a new sponsor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validationResult = createSponsorSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid data provided',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    // Check if stations exist
    if (body.stationIds && body.stationIds.length > 0) {
      const existingStations = await db.station.findMany({
        where: {
          id: {
            in: body.stationIds
          }
        }
      });

      if (existingStations.length !== body.stationIds.length) {
        return NextResponse.json(
          { error: 'One or more stations not found' },
          { status: 404 }
        );
      }
    }

    // Create the sponsor
    const sponsor = await db.sponsor.create({
      data: {
        name: body.name,
        designation: body.designation,
        thumbnail: body.thumbnail,
        website: body.website,
        stationIds: body.stationIds || [],
        station: {
          connect: body.stationIds?.map((id: string) => ({ id }))
        }
      }
    });

    return NextResponse.json(sponsor, { status: 201 });
  } catch (error) {
    console.error('Error creating sponsor:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create sponsor' },
      { status: 500 }
    );
  }
}

// PUT - Update a sponsor
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Sponsor ID is required' },
        { status: 400 }
      );
    }

    // Check if sponsor exists
    const existingSponsor = await db.sponsor.findUnique({
      where: { id }
    });

    if (!existingSponsor) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 });
    }

    // Check if stations exist (if stationIds is being updated)
    if (updateData.stationIds && updateData.stationIds.length > 0) {
      const existingStations = await db.station.findMany({
        where: {
          id: {
            in: updateData.stationIds
          }
        }
      });

      if (existingStations.length !== updateData.stationIds.length) {
        return NextResponse.json(
          { error: 'One or more stations not found' },
          { status: 404 }
        );
      }
    }

    // Update the sponsor
    const updatedSponsor = await db.sponsor.update({
      where: { id },
      data: {
        ...updateData,
        station: {
          connect:
            updateData.stationIds?.map((stationId: string) => ({
              id: stationId
            })) || []
        }
      }
    });

    return NextResponse.json(updatedSponsor);
  } catch (error) {
    console.error('Error updating sponsor:', error);
    return NextResponse.json(
      { error: 'Failed to update sponsor' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a sponsor
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sponsorId = searchParams.get('id');

    if (!sponsorId) {
      return NextResponse.json(
        { error: 'Sponsor ID is required' },
        { status: 400 }
      );
    }

    // Check if sponsor exists
    const existingSponsor = await db.sponsor.findUnique({
      where: { id: sponsorId }
    });

    if (!existingSponsor) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 });
    }

    // Delete the sponsor
    await db.sponsor.delete({
      where: { id: sponsorId }
    });

    return NextResponse.json(
      { message: 'Sponsor deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting sponsor:', error);
    return NextResponse.json(
      { error: 'Failed to delete sponsor' },
      { status: 500 }
    );
  }
}
