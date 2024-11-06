
/*
import pool from "@/app/lib/db";
export async function GET(req, { params }) {
  const { userId } = params;

  try {
    const result = await pool.query(
      `
      SELECT 
        po.pending_order_id,
        po.status,
        u.name AS printer_owner_name
      FROM 
        "printer_orders" po
      JOIN 
        "Printer_Owners" po_own ON po.printer_owner_id = po_own.printer_owner_id
      JOIN 
        "Users" u ON po_own.user_id = u.user_id
      WHERE 
        po.user_id = $1 AND (po.status=$2 OR po.status=$3)
      `,
      [userId, "denied", "pending"]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "No orders found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
      status: 500,
    });
  }
}
*/

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fetch user's pending and denied printer orders
export async function GET(req, { params }) {
  const { userId } = params; // Extract the user_id from the request params

  try {
    // Fetch printer orders with Prisma
    const orders = await prisma.printer_orders.findMany({
      where: {
        user_id: parseInt(userId, 10), // Ensure userId is an integer
        status: {
          in: ["denied", "pending"], // Select orders with "denied" or "pending" status
        },
      },
      select: {
        pending_order_id: true,
        status: true,
        Printer_Owners: {
          select: {
            Users: {
              select: {
                name: true, // Get the printer owner's name
              },
            },
          },
        },
      },
    });

    if (orders.length === 0) {
      return new Response(JSON.stringify({ error: "No orders found" }), {
        status: 404,
      });
    }

    // Map the response to match the original structure
    const formattedOrders = orders.map((order) => ({
      pending_order_id: order.pending_order_id,
      status: order.status,
      printer_owner_name: order.Printer_Owners.Users.name,
    }));

    return new Response(JSON.stringify(formattedOrders), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
      status: 500,
    });
  }
}
