

/*
import pool from "@/app/lib/db";

export async function POST(req) {
  try {
    const { order_id, action, reason } = await req.json();

    // Validate the inputs
    if (!order_id || !["accepted", "denied"].includes(action)) {
      return new Response(
        JSON.stringify({ error: "Invalid order ID or action" }),
        { status: 400 }
      );
    }

    // If the action is "denied", ensure that a reason is provided
    if (action === "denied" && !reason) {
      return new Response(
        JSON.stringify({ error: "Reason is required when denying an order" }),
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      UPDATE "model_orders"
      SET status = $1, updated_at = CURRENT_TIMESTAMP, reasons = $3
      WHERE order_id = $2
      RETURNING *;
      `,
      [action, order_id, action === "denied" ? reason : null]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(result.rows[0]), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to update order status" }),
      { status: 500 }
    );
  }
}
*/

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { order_id, action, reason } = await req.json();

    // Validate the inputs
    if (!order_id || !["accepted", "denied"].includes(action)) {
      return new Response(
        JSON.stringify({ error: "Invalid order ID or action" }),
        { status: 400 }
      );
    }

    // If the action is "denied", ensure that a reason is provided
    if (action === "denied" && !reason) {
      return new Response(
        JSON.stringify({ error: "Reason is required when denying an order" }),
        { status: 400 }
      );
    }

    // Update the order status using Prisma
    const updatedOrder = await prisma.model_orders.update({
      where: {
        order_id: parseInt(order_id, 10), // Ensure order_id is an integer
      },
      data: {
        status: action,
        updated_at: new Date(),
        reasons: action === "denied" ? reason : null,
      },
    });

    if (!updatedOrder) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedOrder), { status: 200 });
  } catch (error) {
    console.error("Failed to update order status:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update order status" }),
      { status: 500 }
    );
  }
}
