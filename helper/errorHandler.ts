import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

export const handleError = (err: any) => {
  if (err instanceof Error && err.name === 'ZodError') {
    return NextResponse.json(
      { error: 'Invalid data provided', details: err },
      { status: 400 }
    );
  }

  // Prisma error: send message to client
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint error
    if (err.code === 'P2002') {
      const field = (err.meta?.target as string[]) || ['record'];
      const fieldName = field.includes('slug') ? 'Name' : field;

      return NextResponse.json(
        { error: `A ${fieldName} with this value already exists.` },
        { status: 400 }
      );
    }

    // Foreign key constraint error
    if (err.code === 'P2003' || err.code === 'P2025') {
      return NextResponse.json(
        { error: 'Referenced record does not exist.' },
        { status: 400 }
      );
    }

    // Record not found
    if (err.code === 'P2001' || err.code === 'P2018') {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    // Invalid ID
    if (err.code === 'P2023') {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
  }

  // Operational, trusted error: send message to client
  if (err instanceof Error) {
    return NextResponse.json(
      { error: err.message || 'Failed to create city' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: err.message || 'Internal Server Error' },
    { status: 500 }
  );
};
