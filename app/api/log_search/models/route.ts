// app/api/log_search/models/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
interface ModelsSearchLogRequestBody {
  user_id: number;
  tags: string[]; // Tags from the Model search bar
}

export async function POST(request: Request) {
  try {
    const { user_id, tags } = (await request.json()) as ModelsSearchLogRequestBody;

    // Validate input
    if (!user_id || !tags || !Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Create a new ModelsSearchLog entry
    await prisma.modelsSearchLog.create({
      data: {
        user_id,
        tags,
      },
    });

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Error logging Models search:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
