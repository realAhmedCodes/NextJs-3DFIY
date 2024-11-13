//api/create-payment-intent/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { modelId, userId } = await req.json();

    console.log('Received modelId:', modelId, 'userId:', userId);

    const parsedModelId = parseInt(modelId);
    const parsedUserId = parseInt(userId);

    if (isNaN(parsedModelId) || isNaN(parsedUserId)) {
      console.error('Invalid modelId or userId:', modelId, userId);
      return NextResponse.json({ error: 'Invalid modelId or userId' }, { status: 400 });
    }

    // Fetch the model price from your database
    const model = await prisma.models.findUnique({
      where: { model_id: parsedModelId },
    });

    if (!model) {
      console.error(`Model with ID ${parsedModelId} not found.`);
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    if (model.price == null || isNaN(model.price)) {
      console.error('Invalid model price:', model.price);
      return NextResponse.json({ error: 'Invalid model price' }, { status: 400 });
    }

    const amount = Math.round(model.price * 100); // Convert dollars to cents

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        modelId: parsedModelId.toString(),
        userId: parsedUserId.toString(),
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
