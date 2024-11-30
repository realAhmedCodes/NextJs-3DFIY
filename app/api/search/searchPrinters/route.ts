// pages/api/search/searchPrinters.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);

  // Extract query parameters
  const location = url.searchParams.get('location') || null;
  const printer_type = url.searchParams.get('printer_type') || null;
  const materials = url.searchParams.get('materials') || null;
  const minPrice = url.searchParams.get('minPrice') || null;
  const maxPrice = url.searchParams.get('maxPrice') || null;
  const sortBy = url.searchParams.get('sortBy') || null;

  // Pagination parameters
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '6', 10); // Default limit for printers
  const skip = (page - 1) * limit;

  try {
    // Construct the where clause based on filters
    const whereClause: any = {
      AND: [
        // Location filter: contains (case-insensitive)
        location
          ? {
              location: {
                contains: location,
                mode: 'insensitive',
              },
            }
          : {},
        // Printer Type filter: equals or contains (case-insensitive)
        printer_type
          ? {
              printer_type: {
                contains: printer_type,
                mode: 'insensitive',
              },
            }
          : {},
        // Materials filter: hasSome (array contains at least one of the specified materials)
        materials
          ? {
              materials: {
                hasSome: materials.split(',').map((mat) => mat.trim()),
              },
            }
          : {},
        // Price range filters
        minPrice
          ? {
              price: {
                gte: parseInt(minPrice, 10),
              },
            }
          : {},
        maxPrice
          ? {
              price: {
                lte: parseInt(maxPrice, 10),
              },
            }
          : {},
      ],
    };

    // Optional: Sorting
    let orderByClause = undefined;
    if (sortBy) {
      switch (sortBy) {
        case 'price':
          orderByClause = { price: 'asc' };
          break;
        case 'createdAt':
          orderByClause = { created_at: 'desc' };
          break;
        case 'rating':
          orderByClause = { rating: 'desc' };
          break;
        // Add more sorting options as needed
        default:
          orderByClause = undefined;
      }
    }

    // Get total count of printers matching the filters
    const total = await prisma.printers.count({
      where: whereClause,
    });

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    // Fetch printers with pagination and filters
    const printers = await prisma.printers.findMany({
      where: whereClause,
      orderBy: orderByClause,
      skip,
      take: limit,
      // Include any related models if necessary
      // For example, if printers are related to Printer_Owners
      include: {
        Printer_Owners: true, // Adjust based on your requirements
      },
    });

    // If no printers are found, return a 404 response
    if (!printers || printers.length === 0) {
      return NextResponse.json({ message: 'No printers found' }, { status: 404 });
    }

    // Return the fetched printers along with pagination info
    return NextResponse.json(
      {
        printers,
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
    console.error('Error fetching printers:', error);
    return NextResponse.json({ error: 'Failed to fetch printers' }, { status: 500 });
  }
}
