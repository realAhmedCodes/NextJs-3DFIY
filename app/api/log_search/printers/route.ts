// app/api/log_search/printers/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface PrintersSearchLogRequestBody {
  user_id: number;
  location: string; // Location from the Printer search bar
  materials: string[]; // Materials from the Printer search bar
}

export async function POST(request: Request) {
  try {
    const { user_id, location, materials } = (await request.json()) as PrintersSearchLogRequestBody;

    // Validate input
    if (
      !user_id ||
      !location ||
      typeof location !== 'string' ||
      location.trim() === '' ||
      !materials ||
      !Array.isArray(materials) ||
      materials.length === 0
    ) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Create a new PrintersSearchLog entry
    await prisma.printersSearchLog.create({
      data: {
        user_id,
        location: location.trim(),
        materials,
      },
    });

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Error logging Printers search:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
