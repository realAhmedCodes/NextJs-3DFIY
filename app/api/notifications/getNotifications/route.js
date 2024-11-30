//api/notifications/getNotifications/route.js
// api/notifications/getNotifications/route.js
// api/notifications/getNotifications/route.js
// api/notifications/getNotifications/route.js
// api/notifications/getNotifications/route.js

// api/notifications/getNotifications/route.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const userId = parseInt(searchParams.get("user_id"));
    if (isNaN(userId)) {
      return new Response(
        JSON.stringify({ error: "User ID is required and must be an integer" }),
        { status: 400 }
      );
    }

    // Pagination parameters
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // Filtering parameters
    const isReadParam = searchParams.get("isRead");
    const typeParam = searchParams.get("type");

    // Build the 'where' condition
    const whereCondition = { recipientId: userId };
    if (isReadParam !== null) {
      // Convert 'isRead' to boolean
      if (isReadParam.toLowerCase() === "true") {
        whereCondition.isRead = true;
      } else if (isReadParam.toLowerCase() === "false") {
        whereCondition.isRead = false;
      }
    }
    if (typeParam) {
      whereCondition.type = typeParam.toUpperCase();
    }

    // Fetch total count for pagination
    const totalCount = await prisma.notification.count({
      where: whereCondition,
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch notifications with pagination and filtering
    const notifications = await prisma.notification.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: limit,
      include: {
        // Include related data if needed, e.g., related model
        // Uncomment and adjust the following lines based on your schema
        // Models: {
        //   select: {
        //     name: true,
        //     // Add other fields as needed
        //   },
        // },
      },
    });

    // Return paginated response
    return new Response(
      JSON.stringify({
        page,
        limit,
        totalPages,
        totalCount,
        notifications,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function PATCH(req) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const userId = parseInt(searchParams.get("user_id"));

    if (isNaN(userId)) {
      return new Response(
        JSON.stringify({ error: "User ID is required and must be an integer" }),
        { status: 400 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch (error) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
      });
    }

    const { notificationIds } = body;

    if (!Array.isArray(notificationIds)) {
      return new Response(
        JSON.stringify({ error: "notificationIds must be an array of integers" }),
        { status: 400 }
      );
    }

    // Validate that all elements in notificationIds are integers
    const invalidIds = notificationIds.filter(
      (id) => typeof id !== "number" || !Number.isInteger(id)
    );
    if (invalidIds.length > 0) {
      return new Response(
        JSON.stringify({
          error: "All notificationIds must be integers",
          invalidIds,
        }),
        { status: 400 }
      );
    }

    const updateResult = await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        recipientId: userId,
      },
      data: { isRead: true },
    });

    return new Response(
      JSON.stringify({
        message: "Notifications marked as read.",
        count: updateResult.count,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("Error updating notifications:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
