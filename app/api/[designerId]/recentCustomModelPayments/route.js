// /app/api/designers/[designerId]/recent-model-order-payments/route.js

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { designerId } = params;

  console.log(
    "Fetching recent model order payments for designerId:",
    designerId
  );

  try {
    // Validate designerId
    const designerIdInt = parseInt(designerId, 10);
    if (isNaN(designerIdInt)) {
      return NextResponse.json(
        { error: "Invalid designer ID provided." },
        { status: 400 }
      );
    }

    // Get the first day of the current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch total purchases this month
    const totalPurchases = await prisma.model_order_purchases.count({
      where: {
        model_order: {
          designer_id: designerIdInt,
        },
        purchased_at: {
          gte: firstDayOfMonth,
        },
      },
    });

    // Fetch recent purchases (e.g., last 5)
    const recentPurchases = await prisma.model_order_purchases.findMany({
      where: {
        model_order: {
          designer_id: designerIdInt,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            profile_pic: true,
          },
        },
      },
      orderBy: {
        purchased_at: "desc",
      },
      take: 5, // Number of recent purchases to fetch
    });

    // Format the purchases data
    const formattedPurchases = recentPurchases.map((purchase) => ({
      buyerName: purchase.user.name,
      buyerEmail: purchase.user.email,
      buyerProfilePic: purchase.user.profile_pic || "default.png", // Fallback to default image
      price: purchase.price,
    }));

    return NextResponse.json(
      {
        totalPurchases,
        recentPurchases: formattedPurchases,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching recent model order payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent model order payments." },
      { status: 500 }
    );
  }
}
