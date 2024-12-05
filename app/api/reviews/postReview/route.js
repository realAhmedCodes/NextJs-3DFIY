// app/api/reviews/route.js
// app/api/reviews/route.js

import { NextResponse } from "next/server";
import { PrismaClient, NotificationType } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { userId, profileId, printerId, reviewText, email } = await req.json();
    console.log("Received Data - profileId:", profileId, "userId:", userId, "printerId:", printerId);

    // Validate inputs: Either profileId or printerId must be provided, not both
    if ((profileId && printerId) || (!profileId && !printerId)) {
      return NextResponse.json(
        { error: "Provide either profileId or printerId, but not both." },
        { status: 400 }
      );
    }

    if (!userId || !reviewText) {
      return NextResponse.json(
        { error: "Missing required fields: userId and reviewText." },
        { status: 400 }
      );
    }

    // Prepare review data
    const reviewData = {
      userId,
      reviewText,
      createdAt: new Date(),
    };

    let notificationType, recipientId, relatedEntity, relatedId;

    if (profileId) {
      // Review for Designer (profileId is interpreted as user_id)
      const designer = await prisma.designers.findUnique({
        where: { user_id: profileId }, // Changed from designer_id to user_id
        include: { Users: true },
      });

      console.log("Fetched Designer:", designer); // Added detailed logging

      if (!designer) {
        return NextResponse.json(
          { error: "Designer not found." },
          { status: 404 }
        );
      }

      reviewData.profileId = designer.designer_id; // Set profileId to designer_id

      recipientId = designer.user_id; // recipientId is the user_id of the designer
      notificationType = NotificationType.COMMENT;
      relatedEntity = "review";
    } else if (printerId) {
      // Review for Printer
      const printer = await prisma.printers.findUnique({
        where: { printer_id: printerId },
        include: { Printer_Owners: true },
      });

      console.log("Fetched Printer:", printer); // Added detailed logging

      if (!printer) {
        return NextResponse.json(
          { error: "Printer not found." },
          { status: 404 }
        );
      }

      reviewData.printerId = printerId;

      recipientId = printer.Printer_Owners.user_id;
      notificationType = NotificationType.COMMENT;
      relatedEntity = "review";
    }

    // Create the review
    const newReview = await prisma.review.create({
      data: reviewData,
    });

    relatedId = newReview.id;

    // Create a notification
    const notificationMessage = `You have a new review from ${email}.`; // Fixed string interpolation

    const newNotification = await prisma.notification.create({
      data: {
        recipientId,
        type: notificationType,
        message: notificationMessage,
        isRead: false,
        createdAt: new Date(),
        relatedEntity,
        relatedId,
      },
    });

    // Emit the notification via Socket.io
    try {
      await axios.post(`${process.env.SOCKET_IO_SERVER_URL}/notify`, {
        recipientId,
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

    return NextResponse.json(
      { success: true, review: newReview },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting review or notification:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
