// /pages/api/category.js

/*
import pool from "../../lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const client = await pool.connect();
    const categoryQuery = `
      SELECT * FROM "Category"
      WHERE parent_category_id IS NULL
      ORDER BY "createdAt" DESC
    `;
    const result = await client.query(categoryQuery);
    client.release();
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("Database query error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
*/

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // Fetching categories with no parent category (parent_category_id is NULL)
    const categories = await prisma.category.findMany({
      where: {
        parent_category_id: null,
      },
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
    await prisma.$disconnect(); // Ensure the Prisma client is disconnected after the query
  }
}
