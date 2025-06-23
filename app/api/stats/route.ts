import db from '@/config/db';
import { NextResponse } from 'next/server';

// GET - Fetch statistics for all database tables
export async function GET() {
  try {
    // Get counts for all tables in parallel
    const [
      usersCount,
      networksCount,
      citiesCount,
      channelsCount,
      stationsCount,
      blogCategoriesCount,
      blogsCount,
      vlogCategoriesCount,
      vlogsCount
    ] = await Promise.all([
      db.user.count(),
      db.network.count(),
      db.city.count(),
      db.channel.count(),
      db.station.count(),
      db.blogCategory.count(),
      db.blog.count(),
      db.vlogCategory.count(),
      db.vlog.count()
    ]);

    // Structure the response
    const stats = {
      users: usersCount,
      networks: networksCount,
      cities: citiesCount,
      channels: channelsCount,
      stations: stationsCount,
      blogCategories: blogCategoriesCount,
      blogs: blogsCount,
      vlogCategories: vlogCategoriesCount,
      vlogs: vlogsCount
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
