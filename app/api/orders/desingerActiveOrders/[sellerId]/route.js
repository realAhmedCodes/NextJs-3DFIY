
// Designer ke active accepted orders + folder ka name change karna hai

/*
import pool from "@/app/lib/db";

export async function GET(req, { params }) {
  const { sellerId } = params; // Extract the designer_id from the request params

  try {
    const result = await pool.query(
      `
      SELECT 
        mo.order_id, 
        mo.status, 
        mo.created_at,
        u.name AS user_name
      FROM 
        "model_orders" mo
      INNER JOIN 
        "Users" u ON mo.user_id = u.user_id
      WHERE 
        mo.designer_id = $1 AND mo.status=$2 
      ORDER BY 
        mo.created_at DESC
      `,
      [sellerId, "accepted"]
    );

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "No active orders found for this designer" }),
        {
          status: 404,
        }
      );
    }

    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch active orders for designer:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
      status: 500,
    });
  }
}
*/


import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fetch accepted (active) orders for a seller (designer)
export async function GET(req, { params }) {
  const { sellerId } = params; // Extract the designer_id from the request params

  try {
    // Fetch model orders with Prisma
    const orders = await prisma.model_orders.findMany({
      where: {
        designer_id: parseInt(sellerId, 10), // Ensure sellerId is an integer
        status: "accepted", // Only select orders with "accepted" status
      },
      orderBy: {
        created_at: "desc", // Order by creation date in descending order
      },
      select: {
        order_id: true,
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
        JSON.stringify({ error: "No active orders found for this designer" }),
        {
          status: 404,
        }
      );
    }

    // Map the response to match the original structure
    const formattedOrders = orders.map((order) => ({
      order_id: order.order_id,
      status: order.status,
      created_at: order.created_at,
      user_name: order.Users.name,
    }));

    return new Response(JSON.stringify(formattedOrders), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch active orders for designer:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
      status: 500,
    });
  }
}





