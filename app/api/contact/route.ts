'use server';

import db from '@/config/db';
import { createContactSchema } from '@/helper/schema/contact';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch all contacts (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [contacts, total] = await Promise.all([
      db.contact.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      db.contact.count()
    ]);

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

// POST - Create a new contact message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = createContactSchema.parse(body);

    // Create contact in database
    const contact = await db.contact.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        message: validatedData.message,
        meta: null
      }
    });

    return NextResponse.json(
      {
        message: 'Contact message sent successfully!',
        contact: {
          id: contact.id,
          name: contact.name,
          email: contact.email,
          createdAt: contact.createdAt
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating contact:', error);

    // Handle validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    // Handle database errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A contact with this information already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send contact message' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a contact message (for admin)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    await db.contact.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Contact deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting contact:', error);

    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}
