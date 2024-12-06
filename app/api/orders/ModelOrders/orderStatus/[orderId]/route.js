// pages/api/orders/ModelOrders/[orderId]/notification.js

import { PrismaClient, NotificationType } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  const { orderId } = params;
  console.log(orderId, "order Id")
 let parsedId = parseInt(orderId);
  try {
    // Fetch the order to get the relevant user and details
    const order = await prisma.printer_orders.findUnique({
      where: { pending_order_id: parsedId },
    
      include: {
        Printer_Owners: {
          include: {
            Users: true, // Include user details from Designers relation
          },
        },
      },
    });

    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
      });
    }

    // Create a notification for the user
    const notificationMessage = `Your order for model ${order.pending_order_id} has been dispatched.`;

    const newNotification = await prisma.notification.create({
      data: {
        recipientId: order.Printer_Owners.user_id, // The user who placed the order
        type: NotificationType.ORDER_STATUS_UPDATE,
        message: notificationMessage,
        relatedEntity: "order",
        relatedId: parseInt(orderId),
      },
    });

    // Emit the notification via Socket.io without API Key
    try {
      await axios.post(`${process.env.SOCKET_IO_SERVER_URL}/notify`, {
        recipientId: order.user_id,
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

    return new Response(
      JSON.stringify({
        success: true,
        message: "Notification sent successfully.",
        notification: newNotification,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to send notification",
      }),
      { status: 500 }
    );
  }
}
