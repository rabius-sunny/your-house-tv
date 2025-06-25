import db from '@/config/db';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch all settingValue
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
      return NextResponse.json(null, { status: 200 });
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

// POST - Create or update a new settingValue
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    await db.settings.upsert({
      where: { key: body.key },
      update: { value: JSON.stringify(body.value) },
      create: {
        key: body.key,
        value: JSON.stringify(body.value)
      }
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create setting' },
      { status: 500 }
    );
  }
}
