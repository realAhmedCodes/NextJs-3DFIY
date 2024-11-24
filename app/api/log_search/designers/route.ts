// app/api/log_search/designers/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface DesignersSearchLogRequestBody {
  user_id: number;
  location: string; // Location from the Designer search bar
}

export async function POST(request: Request) {
  try {
    const { user_id, location } = (await request.json()) as DesignersSearchLogRequestBody;

    // Validate input
    if (!user_id || !location || typeof location !== 'string' || location.trim() === '') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Create a new DesignersSearchLog entry
    await prisma.designersSearchLog.create({
      data: {
        user_id,
        location: location.trim(),
      },
    });

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Error logging Designers search:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
