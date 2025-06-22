import db from '@/config/db';
import { createSliderSchema } from '@/helper/schema/sliders';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch all sliders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sliderKey = searchParams.get('key') || 'hero_sliders';

    // Get sliders from settings table
    const slidersSettings = await db.settings.findUnique({
      where: { key: sliderKey }
    });

    if (!slidersSettings) {
      return NextResponse.json([], { status: 200 });
    }

    // Parse the JSON value
    const sliders = JSON.parse(slidersSettings.value);
    return NextResponse.json(sliders, { status: 200 });
  } catch (error) {
    console.error('Error fetching sliders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sliders' },
      { status: 500 }
    );
  }
}

// POST - Create a new slider
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = createSliderSchema.parse(body);

    // Get the slider collection key from body or default to hero_sliders
    const sliderCollectionKey = body.sliderKey || 'hero_sliders';

    // Get existing sliders
    const slidersSettings = await db.settings.findUnique({
      where: { key: sliderCollectionKey }
    });

    let existingSliders = [];
    if (slidersSettings) {
      existingSliders = JSON.parse(slidersSettings.value);
    }

    // Create new slider with a unique key
    const newSlider = {
      key: `slider_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...validatedData,
      image: body.image // Include the uploaded image URL
    };

    // Add to existing sliders
    const updatedSliders = [...existingSliders, newSlider];

    // Save back to settings
    await db.settings.upsert({
      where: { key: sliderCollectionKey },
      update: { value: JSON.stringify(updatedSliders) },
      create: {
        key: sliderCollectionKey,
        value: JSON.stringify(updatedSliders)
      }
    });

    return NextResponse.json(newSlider, { status: 201 });
  } catch (error: any) {
    console.error('Error creating slider:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create slider' },
      { status: 500 }
    );
  }
}
