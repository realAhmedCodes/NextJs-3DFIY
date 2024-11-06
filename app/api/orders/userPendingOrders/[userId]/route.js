import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function GET(req, { params }) {
  const { userId } = params;

  try {
  
    const orders = await prisma.model_orders.findMany({
      where: {
        user_id: parseInt(userId, 10), 
        status: {
          in: ["denied", "pending"], 
        },
      },
      select: {
        order_id: true,
        status: true,
        model_name: true, 
        file_format: true, 
        Designers: {
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

    if (orders.length === 0) {
      return new Response(JSON.stringify({ error: "No orders found" }), {
        status: 404,
      });
    }

    
    const formattedOrders = orders.map((order) => ({
      pending_order_id: order.order_id,
      status: order.status,
      model_name: order.model_name,
      file_format: order.file_format, 
      designer_name: order.Designers.Users.name,
    }));

    return new Response(JSON.stringify(formattedOrders), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
      status: 500,
    });
  }
}
