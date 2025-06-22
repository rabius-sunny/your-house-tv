import db from '@/config/db';
import { NextRequest, NextResponse } from 'next/server';

// DELETE - Delete a specific slider by key
export async function DELETE(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const { key } = params;
    const { searchParams } = new URL(request.url);
    const sliderCollectionKey = searchParams.get('sliderKey') || 'hero_sliders';

    // Get existing sliders
    const slidersSettings = await db.settings.findUnique({
      where: { key: sliderCollectionKey }
    });

    if (!slidersSettings) {
      return NextResponse.json({ error: 'No sliders found' }, { status: 404 });
    }

    const existingSliders = JSON.parse(slidersSettings.value);

    // Find the slider to delete
    const sliderIndex = existingSliders.findIndex(
      (slider: any) => slider.key === key
    );

    if (sliderIndex === -1) {
      return NextResponse.json({ error: 'Slider not found' }, { status: 404 });
    }

    // Remove the slider
    const updatedSliders = existingSliders.filter(
      (slider: any) => slider.key !== key
    );

    // Save back to settings
    await db.settings.update({
      where: { key: sliderCollectionKey },
      data: { value: JSON.stringify(updatedSliders) }
    });

    return NextResponse.json(
      { message: 'Slider deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting slider:', error);
    return NextResponse.json(
      { error: 'Failed to delete slider' },
      { status: 500 }
    );
  }
}

// PUT - Update a specific slider by key
export async function PUT(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const { key } = params;
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const sliderCollectionKey = searchParams.get('sliderKey') || 'hero_sliders';

    // Get existing sliders
    const slidersSettings = await db.settings.findUnique({
      where: { key: sliderCollectionKey }
    });

    if (!slidersSettings) {
      return NextResponse.json({ error: 'No sliders found' }, { status: 404 });
    }

    const existingSliders = JSON.parse(slidersSettings.value);

    // Find the slider to update
    const sliderIndex = existingSliders.findIndex(
      (slider: any) => slider.key === key
    );

    if (sliderIndex === -1) {
      return NextResponse.json({ error: 'Slider not found' }, { status: 404 });
    }

    // Update the slider
    existingSliders[sliderIndex] = {
      ...existingSliders[sliderIndex],
      ...body,
      key // Keep the original key
    };

    // Save back to settings
    await db.settings.update({
      where: { key: sliderCollectionKey },
      data: { value: JSON.stringify(existingSliders) }
    });

    return NextResponse.json(existingSliders[sliderIndex], { status: 200 });
  } catch (error) {
    console.error('Error updating slider:', error);
    return NextResponse.json(
      { error: 'Failed to update slider' },
      { status: 500 }
    );
  }
}
