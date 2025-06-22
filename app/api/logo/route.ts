import db from '@/config/db';
import { createLogoSchema } from '@/helper/schema/logo';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch the current logo
export async function GET() {
  try {
    // Get logo from settings table
    const logoSettings = await db.settings.findUnique({
      where: { key: 'logo' }
    });

    if (!logoSettings) {
      return NextResponse.json({ logo: null }, { status: 200 });
    }

    // Parse the JSON value to get the logo URL
    const logoData = JSON.parse(logoSettings.value as string);
    return NextResponse.json(
      { logo: logoData.url || logoData },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching logo:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logo' },
      { status: 500 }
    );
  }
}

// POST - Create or update the logo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = createLogoSchema.parse(body);

    // Create logo data object
    const logoData = {
      url: validatedData.logo,
      updatedAt: new Date().toISOString()
    };

    // Save to settings table (upsert to create or update)
    await db.settings.upsert({
      where: { key: 'logo' },
      update: { value: JSON.stringify(logoData) },
      create: {
        key: 'logo',
        value: JSON.stringify(logoData)
      }
    });

    return NextResponse.json(
      { message: 'Logo saved successfully', logo: logoData },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error saving logo:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to save logo' }, { status: 500 });
  }
}

// PUT - Update the existing logo
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = createLogoSchema.parse(body);

    // Check if logo exists
    const logoSettings = await db.settings.findUnique({
      where: { key: 'logo' }
    });

    if (!logoSettings) {
      return NextResponse.json(
        { error: 'Logo not found. Use POST to create a new logo.' },
        { status: 404 }
      );
    }

    // Create updated logo data
    const logoData = {
      url: validatedData.logo,
      updatedAt: new Date().toISOString()
    };

    // Update the logo
    await db.settings.update({
      where: { key: 'logo' },
      data: { value: JSON.stringify(logoData) }
    });

    return NextResponse.json(
      { message: 'Logo updated successfully', logo: logoData },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating logo:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update logo' },
      { status: 500 }
    );
  }
}

// DELETE - Remove the logo
export async function DELETE() {
  try {
    // Check if logo exists
    const logoSettings = await db.settings.findUnique({
      where: { key: 'logo' }
    });

    if (!logoSettings) {
      return NextResponse.json({ error: 'Logo not found' }, { status: 404 });
    }

    // Delete the logo setting
    await db.settings.delete({
      where: { key: 'logo' }
    });

    return NextResponse.json(
      { message: 'Logo deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting logo:', error);
    return NextResponse.json(
      { error: 'Failed to delete logo' },
      { status: 500 }
    );
  }
}
