import { channelConfig } from '@/assets/video';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return the base channel configuration without durations
    // The client will fetch actual durations dynamically using the videoDuration utility
    return NextResponse.json(channelConfig, { status: 200 });
  } catch (error) {
    console.error('Error fetching channel data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch channel data' },
      { status: 500 }
    );
  }
}
