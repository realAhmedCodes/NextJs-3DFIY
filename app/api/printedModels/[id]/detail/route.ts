// /app/api/printedModels/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const modelId = parseInt(id, 10);
    if (isNaN(modelId)) {
      return NextResponse.json({ error: 'Invalid model ID' }, { status: 400 });
    }

    const printedModel = await prisma.printed_models.findUnique({
      where: { printed_model_id: modelId },
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
    });

    if (!printedModel) {
      return NextResponse.json({ error: 'Printed model not found' }, { status: 404 });
    }

    return NextResponse.json(printedModel, { status: 200 });
  } catch (error) {
    console.error('Error fetching printed model:', error);
    return NextResponse.json(
      { error: 'Failed to fetch printed model' },
      { status: 500 }
    );
  }
}
