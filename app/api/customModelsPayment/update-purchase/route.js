// app/api/update-purchase/route.js

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { orderId, userId, price } = await req.json();

    // Validate inputs
    if (!orderId || !userId || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const parsedOrderId = parseInt(orderId);
    const parsedUserId = parseInt(userId);
    const parsedPrice = parseFloat(price);
/*
    // Record the purchase in model_purchase table
    await prisma.model_purchase.create({
      data: {
        user_id: parsedUserId,
        order_id: parsedOrderId,
        price: parsedPrice,
      },
    });
*/
    // Increase the designer's balance
    const modelOrder = await prisma.model_orders.findUnique({
      where: { order_id: parsedOrderId },
    });

    if (!modelOrder) {
      return NextResponse.json(
        { error: "Model order not found" },
        { status: 404 }
      );
    }

    await prisma.model_order_purchases.create({
      data: {
        user_id: parsedUserId,
        order_id: parsedOrderId,
        price: price,
      },
    });

    // Update the order_file_status to 'Paid' or 'Completed'
    await prisma.model_orders.update({
      where: { order_id: parsedOrderId },
      data: {
        order_file_status: "Paid",
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