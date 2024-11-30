

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // Fetching categories with no parent category (parent_category_id is NULL)
    const categories = await prisma.category.findMany({

      orderBy: {
        createdAt: "desc",
      },
    });

    // Returning the fetched categories as JSON
    return NextResponse.json(categories);
  } catch (err) {
    console.error("Database query error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); 
  }
}
