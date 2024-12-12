// /app/api/designers/[designerId]/recent-sales/route.js

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { designerId } = params;

  console.log("Fetching recent sales for designerId:", designerId);

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

    // Fetch total sales this month
    const totalSales = await prisma.model_purchase.count({
      where: {
        model: {
          designer_id: designerIdInt,
        },
        purchasedAt: {
          gte: firstDayOfMonth,
        },
      },
    });

    // Fetch recent sales (e.g., last 5)
    const recentSales = await prisma.model_purchase.findMany({
      where: {
        model: {
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
      
      take: 5, // Number of recent sales to fetch
    });

    // Format the sales data
    const formattedSales = recentSales.map((sale) => ({
      buyerName: sale.user.name,
      buyerEmail: sale.user.email,
      buyerProfilePic: sale.user.profile_pic || "default.png", // Fallback to default image
      price: sale.price,
    }));

    return NextResponse.json(
      {
        totalSales,
        recentSales: formattedSales,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching recent sales:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent sales." },
      { status: 500 }
    );
  }
}
