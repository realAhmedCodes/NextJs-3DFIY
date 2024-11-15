// app/api/update-purchase/route.js

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { modelId, userId, price } = await req.json();

    // Validate inputs
    if (!modelId || !userId || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const parsedModelId = parseInt(modelId);
    const parsedUserId = parseInt(userId);
    const parsedPrice = parseFloat(price);

    // Record the purchase in model_purchase table
    await prisma.model_purchase.create({
      data: {
        user_id: parsedUserId,
        model_id: parsedModelId,
        price: parsedPrice,
      },
    });

    // Increase the designer's balance
    const model = await prisma.models.findUnique({
      where: { model_id: parsedModelId },
    });

    if (!model) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 });
    }

    await prisma.designers.update({
      where: { designer_id: model.designer_id },
      data: {
        balance: {
          increment: parsedPrice,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating purchase:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
