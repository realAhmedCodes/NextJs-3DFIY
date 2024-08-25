// /pages/api/category.js
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
