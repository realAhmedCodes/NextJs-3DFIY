// app/api/update-purchase/route.js
// app/api/modelPayment/update-purchase/route.js

import { NextResponse } from "next/server";
import { PrismaClient, NotificationType } from "@prisma/client";
import axios from "axios";

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

    // Validate parsed values
    if (isNaN(parsedModelId) || isNaN(parsedUserId) || isNaN(parsedPrice)) {
      return NextResponse.json(
        { error: "Invalid modelId, userId, or price" },
        { status: 400 }
      );
    }

    // Record the purchase in model_purchase table
    const newPurchase = await prisma.model_purchase.create({
      data: {
        user_id: parsedUserId,
        model_id: parsedModelId,
        price: parsedPrice,
        purchasedAt: new Date(),
      },
    });

    // Fetch the model to get designer_id
    const model = await prisma.models.findUnique({
      where: { model_id: parsedModelId },
    });

    if (!model) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 });
    }



 const designerModel = await prisma.models.findUnique({
   where: {
     model_id: parsedModelId,
   },
   include: {
     Designers: {
       include: {
         Users: true, 
       },
     },
   },
 });


    // Update the designer's balance
    await prisma.designers.update({
      where: { designer_id: model.designer_id },
      data: {
        balance: {
          increment: parsedPrice,
        },
      },
    });

    // Create a notification for the designer
    const notificationMessage = `You have a new purchase for your model "${model.name}" by User ${parsedUserId}.`;

    const newNotification = await prisma.notification.create({
      data: {
        recipientId: designerModel.Designers.Users.user_id,
        type: NotificationType.NEW_PURCHASE,
        message: notificationMessage,
        relatedEntity: "model_purchase",
        relatedId: newPurchase.model_purchase_id,
      },
    });

    // Emit the notification via Socket.io
    try {
      await axios.post(`${process.env.SOCKET_IO_SERVER_URL}/notify`, {
        recipientId: model.designer_id,
        notification: {
          id: newNotification.id,
          type: newNotification.type,
          message: newNotification.message,
          isRead: newNotification.isRead,
          createdAt: newNotification.createdAt,
          relatedEntity: newNotification.relatedEntity,
          relatedId: newNotification.relatedId,
        },
      });
    } catch (emitError) {
      console.error("Error emitting notification via Socket.io:", emitError);
      // Optionally, handle emission error (e.g., retry, alert admin)
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating purchase:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
