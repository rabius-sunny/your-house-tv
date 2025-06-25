import db from '@/config/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    if (!key) {
      return NextResponse.json(
        { error: 'setting key is required' },
        { status: 400 }
      );
    }

    // Get settingValue from settings table
    const settings = await db.settings.findUnique({
      where: { key }
    });

    if (!settings) {
      return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
    }

    // Parse the JSON value
    const settingValue = JSON.parse(settings.value as string);
    return NextResponse.json(settingValue, { status: 200 });
  } catch (error) {
    console.error('Error fetching settingValue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settingValue' },
      { status: 500 }
    );
  }
}
