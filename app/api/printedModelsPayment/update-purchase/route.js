// app/api/printedModelsPayment/update-purchase/route.js

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { items, totalAmount, paymentIntentId } = await req.json();
console.log(items, totalAmount, paymentIntentId);
    if (!items || !totalAmount || !paymentIntentId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

   
    // Record the purchase in printed_model_purchases table (you'll need to create this table)
    for (const item of items) {
      await prisma.printed_model_purchases.create({
        data: {
          user_id: item.user_id,
          printed_model_id: item.printed_model_id,
          quantity: item.quantity,
          price: item.price,
          total_price: item.price * item.quantity,
          payment_intent_id: paymentIntentId,
        },
      });

      // Optionally, update inventory or status of the printed model
      // e.g., decrease available quantity
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating purchase:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
