import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fetch user's accepted orders
export async function GET(req, { params }) {
  const { userId } = params; // Extract the user_id from the request params

  try {
    // Fetch model orders with Prisma
    const orders = await prisma.model_orders.findMany({
      where: {
        user_id: parseInt(userId, 10), // Ensure userId is an integer
        status: "completed", // Only select orders with "accepted" status
      },
      select: {
        order_id: true,
        status: true,
        order_file_status: true, 
        order_file_price: true,
        Designers: {
          select: {
            Users: {
              select: {
                name: true, // Get the designer's name associated with the order
              },
            },
          },
        },
      },
    });

    console.log("Fetched Orders:", orders);

    if (orders.length === 0) {
      return new Response(JSON.stringify({ error: "No active orders found" }), {
        status: 404,
      });
    }

    const formattedOrders = orders.map((order) => ({
      order_id: order.order_id,
      status: order.status,
      designer_name: order.Designers?.Users?.name || "Unknown",
      order_file_status: order.order_file_status || "Submitted", 
      order_file_price: order.order_file_price
    }));

    return new Response(JSON.stringify(formattedOrders), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch active orders for user:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
      status: 500,
    });
  }
}
