// pages/api/orders/ModelOrders/[orderId]/status.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  const { orderId } = params;
  console.log(orderId, "order Id");
  let parsedId= parseInt(orderId)

  try {
    // Update order status to "Dispatched"
    const updatedOrder = await prisma.printer_orders.update({
      where: { pending_order_id: parsedId }, // Adjust based on your schema
      data: {
        status: "Dispatched", // Updating the status field
        updated_at: new Date(),
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Order status updated to Dispatched",
        updatedOrder,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order status:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to update order status",
      }),
      { status: 500 }
    );
  }
}
