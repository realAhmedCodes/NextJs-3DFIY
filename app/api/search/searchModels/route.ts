import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);

  // Extract query parameters
  const keyword = url.searchParams.get('keyword') || null;
  const category = url.searchParams.get('category') || null;
  const minPrice = url.searchParams.get('minPrice') || null;
  const maxPrice = url.searchParams.get('maxPrice') || null;
  const tags = url.searchParams.get('tags') || null;
  const sortBy = url.searchParams.get('sortBy') || null;

  try {
    // Construct the query dynamically based on available parameters
    const models = await prisma.models.findMany({
      where: {
        AND: [
          // Keyword filter
          keyword
            ? {
                OR: [
                  { name: { contains: keyword, mode: 'insensitive' } },
                  { description: { contains: keyword, mode: 'insensitive' } },
                ],
              }
            : {},
          // Category filter
          category
            ? {
                Category: {
                  name: { equals: category, mode: 'insensitive' },
                },
              }
            : {},
          // Price range filter
          minPrice
            ? {
                price: {
                  gte: parseFloat(minPrice).toString(),
                },
              }
            : {},
          maxPrice
            ? {
                price: {
                  lte: parseFloat(maxPrice).toString(),
                },
              }
            : {},
          // Tags filter
          tags
            ? {
                tags: {
                  hasSome: tags.split(','),
                },
              }
            : {},
        ],
      },
      // Sorting logic
      orderBy: sortBy
        ? {
            [sortBy]: 'asc',
          }
        : undefined, // Only apply sorting if the `sortBy` parameter is provided
      include: {
        Category: true,
        Designers: {
          include: {
            Users: true,
          },
        },
      },
    });

    // If no models are found, return a 404 response
    if (!models || models.length === 0) {
      return NextResponse.json({ message: 'No models found' }, { status: 404 });
    }

    // Return the fetched models with a 200 status
    return NextResponse.json(models, { status: 200 });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
  }
}
