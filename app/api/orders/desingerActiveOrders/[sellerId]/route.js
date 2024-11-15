

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
        user_id: true,
        Users: {
          select: {
            name: true, 
            user_id: true,
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





