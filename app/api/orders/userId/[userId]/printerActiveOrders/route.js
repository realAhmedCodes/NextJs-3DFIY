/*
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
*/




import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fetch user's accepted orders
export async function GET(req, { params }) {
  const { userId } = params; // Extract the user_id from the request params

  try {
    // Fetch model orders with Prisma
    const orders = await prisma.printer_orders.findMany({
      where: {
        user_id: parseInt(userId, 10), // Ensure userId is an integer
        status: "accepted", // Only select orders with "accepted" status
      },
      select: {
        pending_order_id: true,
        status: true,
        Printer_Owners: {
          select: {
            Users: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Debugging: Log fetched orders to verify the presence of order_file_status
    //console.log("Fetched Orders:", orders);

    if (orders.length === 0) {
      return new Response(JSON.stringify({ error: "No active orders found" }), {
        status: 404,
      });
    }

    // Map the response to include order_file_status
    const formattedOrders = orders.map((order) => ({
      pending_order_id: order.pending_order_id,
      status: order.status,
      priter_owner_name: order.Printer_Owners?.Users?.name || "Unknown",
    }));

    return new Response(JSON.stringify(formattedOrders), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch active orders for user:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
      status: 500,
    });
  }
}
