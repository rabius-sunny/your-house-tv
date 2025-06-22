import db from '@/config/db';
import { NextRequest, NextResponse } from 'next/server';

// DELETE - Delete a specific sponsor by id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get existing sponsors
    const sponsorsSettings = await db.settings.findUnique({
      where: { key: 'sponsors' }
    });

    if (!sponsorsSettings) {
      return NextResponse.json({ error: 'No sponsors found' }, { status: 404 });
    }

    const existingSponsors = JSON.parse(sponsorsSettings.value as string);

    // Find the sponsor to delete
    const sponsorIndex = existingSponsors.findIndex(
      (sponsor: any) => sponsor.id === id
    );

    if (sponsorIndex === -1) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 });
    }

    // Remove the sponsor
    const updatedSponsors = existingSponsors.filter(
      (sponsor: any) => sponsor.id !== id
    );

    // Save back to settings
    await db.settings.update({
      where: { key: 'sponsors' },
      data: { value: JSON.stringify(updatedSponsors) }
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

// PUT - Update a specific sponsor by id
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Get existing sponsors
    const sponsorsSettings = await db.settings.findUnique({
      where: { key: 'sponsors' }
    });

    if (!sponsorsSettings) {
      return NextResponse.json({ error: 'No sponsors found' }, { status: 404 });
    }

    const existingSponsors = JSON.parse(sponsorsSettings.value as string);

    // Find the sponsor to update
    const sponsorIndex = existingSponsors.findIndex(
      (sponsor: any) => sponsor.id === id
    );

    if (sponsorIndex === -1) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 });
    }

    // Update the sponsor
    existingSponsors[sponsorIndex] = {
      ...existingSponsors[sponsorIndex],
      ...body,
      id // Keep the original id
    };

    // Save back to settings
    await db.settings.update({
      where: { key: 'sponsors' },
      data: { value: JSON.stringify(existingSponsors) }
    });

    return NextResponse.json(existingSponsors[sponsorIndex], { status: 200 });
  } catch (error) {
    console.error('Error updating sponsor:', error);
    return NextResponse.json(
      { error: 'Failed to update sponsor' },
      { status: 500 }
    );
  }
}
