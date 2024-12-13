// /app/api/reviews/designers/[designerId]/recent/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { designerId: string } }
) {
  const { designerId } = params;

  // Validate designerId
  const designerIdInt = parseInt(designerId, 10);
  if (isNaN(designerIdInt)) {
    return NextResponse.json(
      { error: "Invalid designer ID provided." },
      { status: 400 }
    );
  }

  try {
    // Verify designer exists
    const designer = await prisma.designers.findUnique({
      where: { designer_id: designerIdInt },
    });

    if (!designer) {
      return NextResponse.json(
        { error: "Designer not found." },
        { status: 404 }
      );
    }

    // Fetch the latest 5 reviews for the designer
    const reviews = await prisma.review.findMany({
      where: { profileId: designerIdInt },
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
    console.error("Error fetching designer reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews." },
      { status: 500 }
    );
  }
}
