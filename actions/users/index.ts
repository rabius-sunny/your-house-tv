'use server';

import db from '@/config/db';
import { revalidatePath } from 'next/cache';

// Type definition for User input
type UserInput = {
  email: string;
  password: string;
};

/**
 * Get all users with pagination
 */
export async function getUsers() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return { data: JSON.parse(JSON.stringify(users)) };
  } catch (error: any) {
    return { error: error.message || 'Failed to fetch users' };
  }
}

/**
 * Update a user
 */
export async function updateUser(id: string, userData: Partial<UserInput>) {
  try {
    // Check if email is being updated and if it's already in use
    if (userData.email) {
      const existingUser = await db.user.findFirst({
        where: {
          email: userData.email,
          id: { not: id }
        }
      });

      if (existingUser) {
        return { error: 'Email already in use' };
      }
    }

    const user = await db.user.update({
      where: { id },
      data: userData,
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });

    revalidatePath('/dashboard/users');
    revalidatePath(`/dashboard/users/${id}`);
    return { success: true, data: JSON.parse(JSON.stringify(user)) };
  } catch (error: any) {
    if (error.code === 'P2025') {
      return { error: 'User not found' };
    }
    return {
      error: error.message || 'Failed to update user'
    };
  }
}

/**
 * Delete a user
 */
export async function deleteUser(id: string) {
  try {
    await db.user.delete({
      where: { id }
    });

    revalidatePath('/dashboard/users');
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2025') {
      return { error: 'User not found' };
    }
    return { error: error.message || 'Failed to delete user' };
  }
}
