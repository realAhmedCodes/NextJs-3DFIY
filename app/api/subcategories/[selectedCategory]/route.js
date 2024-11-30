// api/subcategories/[selectedCategory]/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function GET(request, { params }) {
  const { selectedCategory } = params;

  try {
    const subcategories = await prisma.category.findMany({
      where: {
        parent_category_id: Number(selectedCategory),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (subcategories.length === 0) {
      return NextResponse.json(
        { message: "No subcategories found" },
        { status: 404 }
      );
    }

    return NextResponse.json(subcategories);
  } catch (err) {
    console.error("Database query error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
