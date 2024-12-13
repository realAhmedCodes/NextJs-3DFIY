// /app/api/printer-owners/[printerOwnerId]/recent-printed-model-sales/route.js

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { printerOwnerId } = params;

  console.log(
    "Fetching recent printed models sales for printerOwnerId:",
    printerOwnerId
  );

  try {
    // Validate printerOwnerId
    const printerOwnerIdInt = parseInt(printerOwnerId, 10);
    if (isNaN(printerOwnerIdInt)) {
      return NextResponse.json(
        { error: "Invalid printer owner ID provided." },
        { status: 400 }
      );
    }

    // Get the first day of the current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch total printed model sales this month
    const totalSales = await prisma.printed_model_purchases.count({
      where: {
        printed_model: {
          printer_owner_id: printerOwnerIdInt,
        },
        purchase_date: {
          gte: firstDayOfMonth,
        },
      },
    });

    // Fetch recent printed model sales (e.g., last 5)
    const recentSales = await prisma.printed_model_purchases.findMany({
      where: {
        printed_model: {
          printer_owner_id: printerOwnerIdInt,
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
        purchase_date: "desc",
      },
      take: 5, // Number of recent sales to fetch
    });

    // Format the sales data
    const formattedSales = recentSales.map((sale) => ({
      buyerName: sale.user.name,
      buyerEmail: sale.user.email,
      buyerProfilePic: sale.user.profile_pic || "default.png", // Fallback to default image
      quantity: sale.quantity,
      totalPrice: sale.total_price,
    }));

    return NextResponse.json(
      {
        totalSales,
        recentSales: formattedSales,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching recent printed models sales:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent printed models sales." },
      { status: 500 }
    );
  }
}
