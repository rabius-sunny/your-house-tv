import db from '@/config/db';
import { NextResponse } from 'next/server';

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
