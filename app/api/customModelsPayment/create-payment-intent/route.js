//api/customModelPayment/create-payment-intent/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { orderId, userId } = await req.json();

    console.log("Received orderId:", orderId, "userId:", userId);

    const parsedOrderId = parseInt(orderId);
    const parsedUserId = parseInt(userId);

    if (isNaN(parsedOrderId) || isNaN(parsedUserId)) {
      console.error("Invalid modelId or orderId:", orderId, userId);
      return NextResponse.json(
        { error: "Invalid modelId or orderId" },
        { status: 400 }
      );
    }

    // Fetch the model price from your database
    const model_order = await prisma.model_orders.findUnique({
      where: { order_id: parsedOrderId },
    });

    if (!model_order) {
      console.error(`Model Orderwith ID ${parsedOrderId} not found.`);
      return NextResponse.json({ error: "Model Order not found" }, { status: 404 });
    }

    if (
      model_order.order_file_price == null ||
      isNaN(model_order.order_file_price)
    ) {
      console.error("Invalid model order price:", model_order.order_file_price);
      return NextResponse.json(
        { error: "Invalid model price" },
        { status: 400 }
      );
    }

    const amount = Math.round(model_order.order_file_price * 100); 

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
      metadata: {
        orderId: parsedOrderId.toString(),
        userId: parsedUserId.toString(),
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
