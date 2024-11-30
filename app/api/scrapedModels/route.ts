// app/api/scrapedModels/route.ts

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const models = await prisma.scraped_models.findMany();
    return NextResponse.json(models, { status: 200 });
  } catch (error) {
    console.error("Error fetching scraped models:", error);
    return NextResponse.json({ error: "Failed to fetch scraped models" }, { status: 500 });
  }
}
