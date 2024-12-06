//api/notifications/getNotifications/route.js
// app/api/notifications/getNotifications/route.js

import { PrismaClient, NotificationType } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(req.url);
   
    const userId = parseInt(searchParams.get("userId"), 10)

    // Validate parameters
    if (!userId ) {
      return NextResponse.json(
        { error: " userId are required." },
        { status: 400 }
      );
    }

    console.log(userId);
    

      

    // Fetch notifications for the mapped recipientId
    const notifications = await prisma.notification.findMany({
      where: { userId },
      where: { recipientId: parseInt(userId) },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ notifications }, { status: 200 });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
/*
export async function PATCH(req) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const sellerType = searchParams.get("sellerType");
    const userId = parseInt(searchParams.get("userId"), 10);
    const sellerId = parseInt(searchParams.get("sellerId"), 10);

    // Validate parameters
    if (isNaN(userId) || isNaN(sellerId) || !sellerType) {
      return NextResponse.json(
        { error: "sellerType, userId, and sellerId are required." },
        { status: 400 }
      );
    }

    // Parse the request body
    const body = await req.json();
    const { notificationIds } = body;

    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      return NextResponse.json(
        { error: "notificationIds must be a non-empty array." },
        { status: 400 }
      );
    }

    let recipientId;

    switch (sellerType) {
      case "Regular":
        // For regular users, recipientId is userId
        recipientId = userId;
        break;
      case "Designer":
        // For designers, recipientId is the associated Users.user_id
        const designer = await prisma.designers.findUnique({
          where: { designer_id: sellerId },
          include: { Users: true },
        });
        if (!designer) {
          return NextResponse.json(
            { error: "Designer not found." },
            { status: 404 }
          );
        }
        recipientId = designer.Users.user_id;
        break;
      case "Printer Owner":
        // For printer owners, recipientId is the associated Users.user_id
        const printerOwner = await prisma.printer_Owners.findUnique({
          where: { printer_owner_id: sellerId },
          include: { Users: true },
        });
        if (!printerOwner) {
          return NextResponse.json(
            { error: "Printer Owner not found." },
            { status: 404 }
          );
        }
        recipientId = printerOwner.Users.user_id;
        break;
      default:
        return NextResponse.json(
          { error: "Invalid sellerType provided." },
          { status: 400 }
        );
    }

    // Update notifications to mark them as read
    const updatedNotifications = await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        recipientId,
        isRead: false,
      },
      data: { isRead: true },
    });

    return NextResponse.json(
      {
        message: "Notifications marked as read.",
        count: updatedNotifications.count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
*/