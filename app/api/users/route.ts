import db from '@/config/db';
import { handleError } from '@/helper/errorHandler';
import { NextRequest, NextResponse } from 'next/server';

// GET - Get all users or a specific user by id
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (userId) {
      // Get specific user by id
      const user = await db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json(user);
    } else {
      // Get all users
      const users = await db.user.findMany({
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return NextResponse.json(users);
    }
  } catch (error) {
    return handleError(error);
  }
}

// POST - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email is already taken' },
        { status: 409 }
      );
    }

    // Create the user
    const newUser = await db.user.create({
      data: {
        email,
        password
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

// PUT - Update a user
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, email, password } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if email is already taken by another user
    const emailExists = await db.user.findUnique({
      where: { email }
    });

    if (emailExists && emailExists.id !== id) {
      return NextResponse.json(
        { error: 'Email is already taken' },
        { status: 409 }
      );
    }

    // Prepare update data
    const updateData: any = { email };

    // Only update password if provided (no hashing)
    if (password && password.trim() !== '') {
      updateData.password = password;
    }

    // Update the user
    const updatedUser = await db.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return handleError(error);
  }
}

// DELETE - Delete a user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if this is the last user
    const userCount = await db.user.count();
    if (userCount <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete the last user in the system' },
        { status: 400 }
      );
    }

    // Delete the user
    await db.user.delete({
      where: { id: userId }
    });

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
