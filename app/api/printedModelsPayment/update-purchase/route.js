// app/api/printedModelsPayment/update-purchase/route.js

// app/api/printedModelsPayment/update-purchase/route.js

import { NextResponse } from "next/server";
import { PrismaClient, NotificationType } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { items, totalAmount, paymentIntentId, userId, email } = await req.json();

    if (!items || !totalAmount || !paymentIntentId || !userId || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a set to track unique printer owners
    const printerOwnersSet = new Set();

    // Array to hold notifications to be created
    const notificationsToCreate = [];

    for (const item of items) {
      const { printed_model_id, quantity, price } = item;

      // Fetch the printed model to get the printer_owner_id
      const printedModel = await prisma.printed_models.findUnique({
        where: { printed_model_id },
        include: { printer_owner: true }, // Include printer_owner relation
      });

      if (!printedModel) {
        return NextResponse.json(
          { error: `Printed model with ID ${printed_model_id} not found.` },
          { status: 404 }
        );
      }

      const printerOwnerId = printedModel.printer_owner_id;

      if (!printerOwnerId) {
        return NextResponse.json(
          { error: `Printer owner for printed model ID ${printed_model_id} not found.` },
          { status: 404 }
        );
      }

      // Avoid duplicate notifications for the same printer owner
      if (!printerOwnersSet.has(printerOwnerId)) {
        printerOwnersSet.add(printerOwnerId);




      
        // Create notification message
        const notificationMessage = `New Printer Model purchased "${printedModel.name}".`;

        // Prepare notification data
        notificationsToCreate.push({
          recipientId: printedModel.printer_owner.user_id,
          type: NotificationType.NEW_PURCHASE,
          message: notificationMessage,
          isRead: false,
          createdAt: new Date(),
          relatedEntity: "printed_model_purchase",
          relatedId: printed_model_id, // You might want to associate with purchase or printed_model_id
        });
      }

      // Record the purchase in printed_model_purchases table
      await prisma.printed_model_purchases.create({
        data: {
          user_id: userId,
          printed_model_id,
          quantity,
          price,
          total_price: price * quantity,
          payment_intent_id: paymentIntentId,
          purchase_date: new Date(),
        },
      });

      // Optionally, update inventory or status of the printed model
      // Example: Decrease available quantity (if you have such a field)
      // await prisma.printed_models.update({
      //   where: { printed_model_id },
      //   data: { quantity: { decrement: quantity } },
      // });
    }

    // Create all notifications in a single transaction for efficiency
    if (notificationsToCreate.length > 0) {
      await prisma.$transaction(
        notificationsToCreate.map((notification) =>
          prisma.notification.create({ data: notification })
        )
      );

      // Emit notifications via Socket.io
      for (const notification of notificationsToCreate) {
        try {
          await axios.post(`${process.env.SOCKET_IO_SERVER_URL}/notify`, {
            recipientId: notification.recipientId,
            notification: {
              id: notification.id, // This will be undefined here since we don't have the ID yet
              type: notification.type,
              message: notification.message,
              isRead: notification.isRead,
              createdAt: notification.createdAt,
              relatedEntity: notification.relatedEntity,
              relatedId: notification.relatedId,
            },
          });
        } catch (emitError) {
          console.error(
            "Error emitting notification via Socket.io:",
            emitError
          );
          // Optionally, handle emission error (e.g., retry, alert admin)
        }
      }
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
