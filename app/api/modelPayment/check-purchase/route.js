import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const modelId = url.searchParams.get("modelId");
    const userId = url.searchParams.get("userId");

    if (!modelId || !userId) {
      return NextResponse.json(
        { error: "Missing modelId or userId" },
        { status: 400 }
      );
    }

    const parsedModelId = parseInt(modelId);
    const parsedUserId = parseInt(userId);

    const purchase = await prisma.model_purchase.findFirst({
      where: {
        model_id: parsedModelId,
        user_id: parsedUserId,
      },
    });

    return NextResponse.json({ purchased: !!purchase });
  } catch (error) {
    console.error("Error checking purchase status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
