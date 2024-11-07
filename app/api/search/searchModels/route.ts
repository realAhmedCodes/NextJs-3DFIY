// pages/api/search/searchModels.ts

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

  // Pagination parameters
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '9', 10);
  const skip = (page - 1) * limit;

  try {
    // Construct the query dynamically based on available parameters
    const whereClause: any = {
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
                gte: parseFloat(minPrice),
              },
            }
          : {},
        maxPrice
          ? {
              price: {
                lte: parseFloat(maxPrice),
              },
            }
          : {},
        // Tags filter
        tags
          ? {
              tags: {
                hasSome: tags.split(',').map(tag => tag.trim()),
              },
            }
          : {},
      ],
    };

    // Get total count of models matching the filters
    const total = await prisma.models.count({
      where: whereClause,
    });

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    // Fetch models with pagination
    const models = await prisma.models.findMany({
      where: whereClause,
      orderBy: sortBy
        ? {
            [sortBy]: 'asc',
          }
        : undefined,
      skip,
      take: limit,
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

    // Return the fetched models along with pagination info
    return NextResponse.json(
      {
        models,
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
  }
}
