import db from '@/config/db';
import { createSponsorSchema } from '@/helper/schema/sponsor';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch all sponsors
export async function GET() {
  try {
    // Get sponsors from settings table
    const sponsorsSettings = await db.settings.findUnique({
      where: { key: 'sponsors' }
    });

    if (!sponsorsSettings) {
      return NextResponse.json([], { status: 200 });
    }

    // Parse the JSON value
    const sponsors = JSON.parse(sponsorsSettings.value as string);
    return NextResponse.json(sponsors, { status: 200 });
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
    const validatedData = createSponsorSchema.parse(body);

    // Get existing sponsors
    const sponsorsSettings = await db.settings.findUnique({
      where: { key: 'sponsors' }
    });

    let existingSponsors = [];
    if (sponsorsSettings) {
      existingSponsors = JSON.parse(sponsorsSettings.value as string);
    }

    // Create new sponsor with a unique id
    const newSponsor = {
      id: `sponsor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...validatedData,
      logo: body.logo, // Include the uploaded logo URL
      createdAt: new Date().toISOString()
    };

    // Add to existing sponsors
    const updatedSponsors = [...existingSponsors, newSponsor];

    // Save back to settings
    await db.settings.upsert({
      where: { key: 'sponsors' },
      update: { value: JSON.stringify(updatedSponsors) },
      create: {
        key: 'sponsors',
        value: JSON.stringify(updatedSponsors)
      }
    });

    return NextResponse.json(newSponsor, { status: 201 });
  } catch (error: any) {
    console.error('Error creating sponsor:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create sponsor' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing sponsor
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

    // Validate the update data
    const validatedData = createSponsorSchema.parse(updateData);

    // Get existing sponsors
    const sponsorsSettings = await db.settings.findUnique({
      where: { key: 'sponsors' }
    });

    if (!sponsorsSettings) {
      return NextResponse.json({ error: 'No sponsors found' }, { status: 404 });
    }

    let existingSponsors = JSON.parse(sponsorsSettings.value as string);

    // Find the sponsor to update
    const sponsorIndex = existingSponsors.findIndex(
      (sponsor: any) => sponsor.id === id
    );

    if (sponsorIndex === -1) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 });
    }

    // Update the sponsor
    const updatedSponsor = {
      ...existingSponsors[sponsorIndex],
      ...validatedData,
      logo: body.logo, // Include the uploaded logo URL
      updatedAt: new Date().toISOString()
    };

    existingSponsors[sponsorIndex] = updatedSponsor;

    // Save back to settings
    await db.settings.update({
      where: { key: 'sponsors' },
      data: { value: JSON.stringify(existingSponsors) }
    });

    return NextResponse.json(updatedSponsor, { status: 200 });
  } catch (error: any) {
    console.error('Error updating sponsor:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.errors },
        { status: 400 }
      );
    }

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

    // Get existing sponsors
    const sponsorsSettings = await db.settings.findUnique({
      where: { key: 'sponsors' }
    });

    if (!sponsorsSettings) {
      return NextResponse.json({ error: 'No sponsors found' }, { status: 404 });
    }

    let existingSponsors = JSON.parse(sponsorsSettings.value as string);

    // Find the sponsor to delete
    const sponsorIndex = existingSponsors.findIndex(
      (sponsor: any) => sponsor.id === sponsorId
    );

    if (sponsorIndex === -1) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 });
    }

    // Remove the sponsor
    existingSponsors.splice(sponsorIndex, 1);

    // Save back to settings
    await db.settings.update({
      where: { key: 'sponsors' },
      data: { value: JSON.stringify(existingSponsors) }
    });

    return NextResponse.json(
      { message: 'Sponsor deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting sponsor:', error);
    return NextResponse.json(
      { error: 'Failed to delete sponsor' },
      { status: 500 }
    );
  }
}
