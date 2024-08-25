// app/api/subcategories/[selectedCategory]/route.js
import pool from "@/app/lib/db"; // Adjust the path if needed
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { selectedCategory } = params;

  try {
    const client = await pool.connect();
    const subCategoryQuery = `
      SELECT * FROM "Category"
      WHERE parent_category_id = $1
      ORDER BY "createdAt" DESC
    `;
    const result = await client.query(subCategoryQuery, [selectedCategory]);
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "No subcategories found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("Database query error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
