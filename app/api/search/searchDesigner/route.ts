// pages/api/search/searchDesigners.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);

  // Extract query parameters
  const name = url.searchParams.get('name') || null;
  const location = url.searchParams.get('location') || null;

  // Pagination parameters
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '6', 10); // Default limit for designers
  const skip = (page - 1) * limit;

  try {
    // Construct the query dynamically based on available parameters
    const whereClause: any = {
      AND: [
        // Name filter: search in Users' name or username
        name
          ? {
              OR: [
                { Users: { name: { contains: name, mode: 'insensitive' } } },
                { Users: { username: { contains: name, mode: 'insensitive' } } },
              ],
            }
          : {},
        // Location filter: search in Users' location
        location
          ? {
              Users: {
                location: { contains: location, mode: 'insensitive' },
              },
            }
          : {},
      ],
    };

    // Optional: Sorting (e.g., by name, ratings)
    const sortBy = url.searchParams.get('sortBy') || null;
    let orderByClause = undefined;
    if (sortBy) {
      if (sortBy === 'name') {
        orderByClause = {
          Users: {
            name: 'asc',
          },
        };
      } else if (sortBy === 'ratings') {
        orderByClause = {
          ratings: 'desc',
        };
      }
      // Add more sorting options as needed
    }

    // Get total count of designers matching the filters
    const total = await prisma.designers.count({
      where: whereClause,
    });

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    // Fetch designers with pagination
    const designers = await prisma.designers.findMany({
      where: whereClause,
      orderBy: orderByClause,
      skip,
      take: limit,
      include: {
        Users: true, // Include related User data
      },
    });

    // If no designers are found, return a 404 response
    if (!designers || designers.length === 0) {
      return NextResponse.json({ message: 'No designers found' }, { status: 404 });
    }

    // Return the fetched designers along with pagination info
    return NextResponse.json(
      {
        designers,
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
    console.error('Error fetching designers:', error);
    return NextResponse.json({ error: 'Failed to fetch designers' }, { status: 500 });
  }
}
