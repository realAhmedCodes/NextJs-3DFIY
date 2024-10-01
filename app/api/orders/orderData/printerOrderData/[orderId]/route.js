
/*
import pool from "@/app/lib/db";

export async function GET(req, { params }) {
  const { orderId } = params;

  try {
    const result = await pool.query(
      `
      SELECT 
        po.*, 
        u.name as user_name
      FROM 
        "printer_orders" po
      JOIN 
        "Users" u 
      ON 
        po.user_id = u.user_id
      WHERE 
        po.pending_order_id = $1
      `,
      [orderId]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(result.rows[0]), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch order" }), {
      status: 500,
    });
  }
}
*/


import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fetch specific printer order by orderId
export async function GET(req, { params }) {
  const { orderId } = params;

  try {
    // Fetch the specific printer order using Prisma
    const order = await prisma.printer_orders.findUnique({
      where: {
        pending_order_id: parseInt(orderId, 10), // Ensure orderId is an integer
      },
      include: {
        Users: {
          select: {
            name: true, // Fetch the user's name associated with the order
          },
        },
      },
    });

    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
      });
    }

    // Format the response to match the original structure
    const response = {
      ...order,
      user_name: order.Users.name,
    };

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch order" }), {
      status: 500,
    });
  }
}
