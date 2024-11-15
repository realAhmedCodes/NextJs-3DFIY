// app/api/webhooksStripe/route.js

import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma"; // Adjust the import path as needed
import { buffer } from "micro";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, so we can access the raw body
  },
};

export async function POST(req) {
  const buf = await req.text();
  const sig = req.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      await handlePaymentIntentSucceeded(paymentIntent);
      break;
    // ... handle other event types
    default:
      console.warn(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return new Response(JSON.stringify({ received: true }), { status: 200 });
}

// Function to handle successful payments
async function handlePaymentIntentSucceeded(paymentIntent) {
  // Extract metadata
  const { modelId, userId } = paymentIntent.metadata;

  // Fetch the model and designer info
  const model = await prisma.models.findUnique({
    where: { model_id: parseInt(modelId) },
  });

  if (!model) {
    console.error(`Model with ID ${modelId} not found.`);
    return;
  }

  // Record the purchase in model_purchase table
  await prisma.model_purchase.create({
    data: {
      user_id: parseInt(userId),
      model_id: model.model_id,
      price: model.price,
    },
  });

  // Increase the designer's balance
  await prisma.designers.update({
    where: { designer_id: model.designer_id },
    data: {
      balance: {
        increment: model.price,
      },
    },
  });

  console.log(
    `User ${userId} purchased model ${modelId} for $${model.price}. Designer ${model.designer_id} balance updated.`
  );
}
