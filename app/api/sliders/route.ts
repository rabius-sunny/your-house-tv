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
    const sliders = JSON.parse(slidersSettings.value as string);
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
      existingSliders = JSON.parse(slidersSettings.value as string);
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

// DELETE - Delete a slider
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sliderKey = searchParams.get('key'); // The specific slider key to delete
    const sliderCollectionKey = searchParams.get('sliderKey') || 'hero_sliders'; // The parent settings key

    if (!sliderKey) {
      return NextResponse.json(
        { error: 'Slider key is required' },
        { status: 400 }
      );
    }

    // Get existing sliders
    const slidersSettings = await db.settings.findUnique({
      where: { key: sliderCollectionKey }
    });

    if (!slidersSettings) {
      return NextResponse.json({ error: 'No sliders found' }, { status: 404 });
    }

    let existingSliders = JSON.parse(slidersSettings.value as string);

    // Find the slider to delete
    const sliderIndex = existingSliders.findIndex(
      (slider: any) => slider.key === sliderKey
    );

    if (sliderIndex === -1) {
      return NextResponse.json({ error: 'Slider not found' }, { status: 404 });
    }

    // Remove the slider
    existingSliders.splice(sliderIndex, 1);

    // Save back to settings
    await db.settings.update({
      where: { key: sliderCollectionKey },
      data: { value: JSON.stringify(existingSliders) }
    });

    return NextResponse.json(
      { message: 'Slider deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting slider:', error);
    return NextResponse.json(
      { error: 'Failed to delete slider' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing slider
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, sliderKey, ...updateData } = body;

    if (!key) {
      return NextResponse.json(
        { error: 'Slider key is required' },
        { status: 400 }
      );
    }

    const sliderCollectionKey = sliderKey || 'hero_sliders';

    // Get existing sliders
    const slidersSettings = await db.settings.findUnique({
      where: { key: sliderCollectionKey }
    });

    if (!slidersSettings) {
      return NextResponse.json({ error: 'No sliders found' }, { status: 404 });
    }

    let existingSliders = JSON.parse(slidersSettings.value as string);

    // Find the slider to update
    const sliderIndex = existingSliders.findIndex(
      (slider: any) => slider.key === key
    );

    if (sliderIndex === -1) {
      return NextResponse.json({ error: 'Slider not found' }, { status: 404 });
    }

    // Update the slider
    const updatedSlider = {
      ...existingSliders[sliderIndex],
      ...updateData
    };

    existingSliders[sliderIndex] = updatedSlider;

    // Save back to settings
    await db.settings.update({
      where: { key: sliderCollectionKey },
      data: { value: JSON.stringify(existingSliders) }
    });

    return NextResponse.json(updatedSlider, { status: 200 });
  } catch (error: any) {
    console.error('Error updating slider:', error);
    return NextResponse.json(
      { error: 'Failed to update slider' },
      { status: 500 }
    );
  }
}
