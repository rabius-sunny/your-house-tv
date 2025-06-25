'use server';

import db from '@/config/db';
import { SessionData, signToken } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

type LoginInput = {
  email: string;
  password: string;
};

/**
 * Register a new user
 */
export async function register(userData: LoginInput) {
  try {
    // Check if user with this email already exists
    const existingUser = await db.user.findUnique({
      where: { email: userData.email }
    });
    if (existingUser) {
      return { error: 'User with this email already exists' };
    }

    // Create new user
    await db.user.create({
      data: {
        email: userData.email,
        password: userData.password
      }
    });

    return { success: true };
  } catch (error: any) {
    return {
      error: error.message || 'Failed to register user'
    };
  }
}

/**
 * User login
 */
export async function login({ email, password }: LoginInput) {
  try {
    // Find the user
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return { error: 'Invalid email or password' };
    }

    // Verify password
    const isPasswordValid = password === user.password;
    if (!isPasswordValid) {
      return { error: 'Invalid email or password' };
    }

    // Set session cookie
    const session: SessionData = {
      user: {
        id: user.id,
        email: user.email
      }
    };
    const encryptedSession = await signToken(session);
    (await cookies()).set('session', encryptedSession, {
      httpOnly: true,
      // secure: true,
      sameSite: 'lax'
    });

    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Failed to login' };
  }
}

/**
 * User logout
 */
export async function logout() {
  try {
    // Clear the session cookie
    const cookieStore = await cookies();
    cookieStore.delete('session');

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Failed to logout' };
  }
}

/**
 * Change password
 */
export async function changePassword(
  email: string,
  currentPassword: string,
  newPassword: string
) {
  try {
    // Find the user
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return { error: 'User not found' };
    }

    // Verify current password
    const isPasswordValid = currentPassword === user.password;
    if (!isPasswordValid) {
      return { error: 'Current password is incorrect' };
    }

    await db.user.update({
      where: { email },
      data: { password: newPassword }
    });

    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Failed to change password' };
  }
}
