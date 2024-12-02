// pages/api/search/searchModels.ts
/*
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


*/

// pages/api/search/allModels.ts
// pages/api/search/allModels.ts
// pages/api/search/searchModels.ts

import { Models, PrismaClient } from '@prisma/client';
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
  const modelType = url.searchParams.get('modelType') || 'all'; // 'all', 'designer', 'scraped'
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '100', 10);
  const skip = (page - 1) * limit;

  try {
    let combinedModels: any[] = [];

    // Fetch Designer Models
    if (modelType === 'all' || modelType === 'designer') {
      const designerWhereClause: any = {
        AND: [
          keyword
            ? {
                OR: [
                  { name: { contains: keyword, mode: 'insensitive' } },
                  { description: { contains: keyword, mode: 'insensitive' } },
                ],
              }
            : {},
          category
            ? {
                Category: {
                  name: { equals: category, mode: 'insensitive' },
                },
              }
            : {},
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
          tags
            ? {
                tags: {
                  hasSome: tags.split(',').map(tag => tag.trim()),
                },
              }
            : {},
        ],
      };

      let designerModels: Models[] = [];
      if (url.searchParams.get('modelIds')) {
        // Image-based search for designer models
        const modelIds = url.searchParams.get('modelIds') || '';
        const modelIdArray = modelIds.split(',').map(id => parseInt(id.trim(), 10));
        designerModels = await prisma.models.findMany({
          where: {
            model_id: { in: modelIdArray },
          },
          include: {
            Category: true,
            Designers: {
              include: {
                Users: true,
              },
            },
          },
        });
      } else {
        // Filter-based search for designer models
        designerModels = await prisma.models.findMany({
          where: designerWhereClause,
          include: {
            Category: true,
            Designers: {
              include: {
                Users: true,
              },
            },
          },
        });
      }

      const formattedDesignerModels = designerModels.map(model => ({
        model_id: model.model_id,
        name: model.name,
        description: model.description,
        price: model.price,
        is_free: model.is_free,
        image: model.image,
        tags: model.tags,
        downloadLink: null, // No external download link
        isScraped: false,
        type: 'designer',
        createdAt: model.createdAt,
        likes_count: model.likes_count,
      }));

      combinedModels = combinedModels.concat(formattedDesignerModels);
    }

    // Fetch Scraped Models
    if (modelType === 'all' || modelType === 'scraped') {
      const scrapedWhereClause: any = {
        AND: [
          keyword
            ? {
                OR: [
                  { name: { contains: keyword, mode: 'insensitive' } },
                  { description: { contains: keyword, mode: 'insensitive' } },
                ],
              }
            : {},
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
        ],
      };

      const scrapedModels = await prisma.scraped_models.findMany({
        where: scrapedWhereClause,
      });

      const formattedScrapedModels = scrapedModels.map(scraped => ({
        model_id: scraped.id,
        name: scraped.name,
        description: scraped.description,
        price: scraped.price || 0,
        is_free: scraped.price === 0,
        image: scraped.image_url,
        tags: [], // Scraped models might not have tags
        downloadLink: scraped.download_link,
        isScraped: true,
        type: 'scraped',
        createdAt: scraped.created_at,
        likes_count: 0, // Scraped models may not have likes
      }));

      combinedModels = combinedModels.concat(formattedScrapedModels);
    }

    // Apply Sorting
    if (sortBy) {
      if (sortBy === 'price') {
        combinedModels.sort((a, b) => (a.price || 0) - (b.price || 0));
      } else if (sortBy === 'createdAt') {
        combinedModels.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (sortBy === 'likes_count') {
        combinedModels.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
      }
    }

    // Calculate Total and Total Pages
    const total = combinedModels.length;
    const totalPages = Math.ceil(total / limit);

    // Apply Pagination
    const paginatedModels = combinedModels.slice(skip, skip + limit);

    if (paginatedModels.length === 0) {
      return NextResponse.json({ message: 'No models found' }, { status: 404 });
    }

    // Return the Response
    return NextResponse.json(
      {
        models: paginatedModels,
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
