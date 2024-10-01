

/*
import pool from "@/app/lib/db";

export async function GET(req, { params }) {
  const { sellerId } = params; // Extract the printer_owner_id from the request params

  try {
    const result = await pool.query(
      `
      SELECT 
        po.pending_order_id, 
        po.status, 
        po.created_at,
        u.name AS user_name
      FROM 
        "printer_orders" po
      INNER JOIN 
        "Users" u ON po.user_id = u.user_id
      WHERE 
        po.printer_owner_id = $1 AND (po.status=$2 OR po.status=$3)
      ORDER BY 
        po.created_at DESC
      `,
      [sellerId, "pending", "denied"]
    );

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "No orders found for this printer owner" }),
        {
          status: 404,
        }
      );
    }

    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch orders for printer owner:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
      status: 500,
    });
  }
}
*/

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fetch pending and denied orders for a printer owner
export async function GET(req, { params }) {
  const { sellerId } = params; // Extract the printer_owner_id from the request params

  try {
    // Fetch printer orders with Prisma
    const orders = await prisma.printer_orders.findMany({
      where: {
        printer_owner_id: parseInt(sellerId, 10), // Ensure sellerId is an integer
        status: {
          in: ["pending", "denied"], // Select orders with "pending" or "denied" status
        },
      },
      orderBy: {
        created_at: "desc", // Order by creation date in descending order
      },
      select: {
        pending_order_id: true,
        status: true,
        created_at: true,
        Users: {
          select: {
            name: true, // Get the user's name associated with the order
          },
        },
      },
    });

    if (orders.length === 0) {
      return new Response(
        JSON.stringify({ error: "No orders found for this printer owner" }),
        {
          status: 404,
        }
      );
    }

    // Map the response to match the original structure
    const formattedOrders = orders.map((order) => ({
      pending_order_id: order.pending_order_id,
      status: order.status,
      created_at: order.created_at,
      user_name: order.Users.name,
    }));

    return new Response(JSON.stringify(formattedOrders), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch orders for printer owner:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
      status: 500,
    });
  }
}
