// /app/api/reviews/printers/[printerId]/recent/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { printerId: string } }
) {
  const { printerId } = params;

  // Validate printerId
  const printerIdInt = parseInt(printerId, 10);
  if (isNaN(printerIdInt)) {
    return NextResponse.json(
      { error: "Invalid printer ID provided." },
      { status: 400 }
    );
  }

  try {
    // Verify printer exists
    const printer = await prisma.printers.findUnique({
      where: { printer_id: printerIdInt },
      include: { Printer_Owners: true },
    });

    if (!printer) {
      return NextResponse.json(
        { error: "Printer not found." },
        { status: 404 }
      );
    }

    // Fetch the latest 5 reviews for the printer
    const reviews = await prisma.review.findMany({
      where: { printerId: printerIdInt },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            profile_pic: true,
          },
        },
      },
    });

    // Format the reviews
    const formattedReviews = reviews.map((review) => ({
      id: review.id,
      reviewText: review.reviewText,
      createdAt: review.createdAt,
      reviewer: {
        name: review.user.name,
        email: review.user.email,
        profilePic: review.user.profile_pic || "/default.png",
      },
    }));

    return NextResponse.json({ reviews: formattedReviews }, { status: 200 });
  } catch (error) {
    console.error("Error fetching printer reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews." },
      { status: 500 }
    );
  }
}
