// /app/api/printedModels/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const printedModels = await prisma.printed_models.findMany({
      include: {
        user: {
          select: {
            name: true,
            username: true,
            email: true,
            // Add other user fields if necessary
          },
        },
        printer_owner: {
          select: {
            bio: true,
            ratings: true,
            // Add other printer owner fields if necessary
          },
        },
      },
      orderBy: {
        created_at: 'desc', // Sort models by creation date
      },
    });

    return NextResponse.json(printedModels, { status: 200 });
  } catch (error) {
    console.error('Error fetching printed models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch printed models' },
      { status: 500 }
    );
  }
}
