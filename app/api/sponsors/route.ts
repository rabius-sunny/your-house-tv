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
