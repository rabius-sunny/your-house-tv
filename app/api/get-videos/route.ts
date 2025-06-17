import { channel } from '@/assets/video';
import { NextResponse } from 'next/server';

export async function GET() {
  // Getting the video array from assets/video.ts, in future this could be replaced with a database call.
  return NextResponse.json(channel, { status: 200 });
}
