// app/api/getModelsByIds/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Models } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic'; // Ensures the route is treated as dynamic

interface ModelsRequestBody {
  model_ids: number[];
}

interface ModelResponse {
  model_id: number;
  category_id: number;
  designer_id: number;
  name: string;
  description: string;
  is_free: boolean;
  image: string;
  model_file: string;
  likes_count: number;
  download_count?: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  price?: number;
}

interface ModelsResponse {
  models: ModelResponse[];
}

export async function POST(req: NextRequest) {
  try {
    const body: ModelsRequestBody = await req.json();

    const { model_ids } = body;
    console.log(model_ids, "jjjj")

    if (!model_ids || !Array.isArray(model_ids) || model_ids.length === 0) {
      return NextResponse.json({ error: 'No model_ids provided' }, { status: 400 });
    }

    // Fetch models from the database using Prisma
    const models: Models[] = await prisma.models.findMany({
      where: {
        model_id: {
          in: model_ids,
        },
      },
    });

    if (models.length === 0) {
      return NextResponse.json({ error: 'No models found for the provided IDs' }, { status: 404 });
    }

    // Transform models data to match the response interface
    const responseModels: ModelResponse[] = models.map((model) => ({
      model_id: model.model_id,
      category_id: model.category_id,
      designer_id: model.designer_id,
      name: model.name,
      description: model.description,
      is_free: model.is_free,
      image: model.image,
      model_file: model.model_file,
      likes_count: model.likes_count,
      download_count: model.download_count,
      createdAt: model.createdAt.toISOString(),
      updatedAt: model.updatedAt.toISOString(),
      tags: model.tags, // Assuming Prisma handles tags as string arrays
      price: model.price,
    }));

    return NextResponse.json(
      {
        models: responseModels,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching models' },
      { status: 500 }
    );
  }
}
