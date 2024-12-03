// app/api/ratings/[id]/route.ts
// app/api/ratings/[id]/route.ts
// app/api/ratings/[id]/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

declare global {
  // Prevent multiple instances of Prisma Client in development
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const body = await request.json();
    const { rating } = body;

    // Validate rating
    if (typeof rating !== "number" || rating < 0 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be a number between 0 and 5." },
        { status: 400 }
      );
    }

    // Find the user by user_id
    const user = await prisma.users.findUnique({
      where: { user_id: parseInt(id, 10) },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    // Determine sellerType
    const { sellerType } = user;

    if (sellerType === "Designer") {
      // Update ratings_sum and ratings_count in a transaction
      const updatedDesigner = await prisma.$transaction(async (tx) => {
        // Increment ratings_sum and ratings_count
        await tx.designers.update({
          where: { user_id: parseInt(id, 10) },
          data: {
            ratings_sum: {
              increment: rating,
            },
            ratings_count: {
              increment: 1,
            },
          },
        });

        // Fetch the updated ratings_sum and ratings_count
        const designer = await tx.designers.findUnique({
          where: { user_id: parseInt(id, 10) },
          select: { ratings_sum: true, ratings_count: true },
        });

        if (!designer) {
          throw new Error("Designer not found after update.");
        }

        // Calculate new average rating
        const newAverage = Math.round(designer.ratings_sum / designer.ratings_count);

        // Update the ratings field with the new average
        const designerWithNewRating = await tx.designers.update({
          where: { user_id: parseInt(id, 10) },
          data: {
            ratings: newAverage,
          },
        });

        return designerWithNewRating;
      });

      return NextResponse.json(
        { message: "Designer rating updated successfully!", rating: updatedDesigner.ratings },
        { status: 200 }
      );
    } else if (sellerType === "Printer Owner") {
      // Update ratings_sum and ratings_count in a transaction
      const updatedPrinterOwner = await prisma.$transaction(async (tx) => {
        // Increment ratings_sum and ratings_count
        await tx.printer_Owners.update({
          where: { user_id: parseInt(id, 10) },
          data: {
            ratings_sum: {
              increment: rating,
            },
            ratings_count: {
              increment: 1,
            },
          },
        });

        // Fetch the updated ratings_sum and ratings_count
        const printerOwner = await tx.printer_Owners.findUnique({
          where: { user_id: parseInt(id, 10) },
          select: { ratings_sum: true, ratings_count: true },
        });

        if (!printerOwner) {
          throw new Error("Printer Owner not found after update.");
        }

        // Calculate new average rating
        const newAverage = Math.round(printerOwner.ratings_sum / printerOwner.ratings_count);

        // Update the ratings field with the new average
        const printerOwnerWithNewRating = await tx.printer_Owners.update({
          where: { user_id: parseInt(id, 10) },
          data: {
            ratings: newAverage,
          },
        });

        return printerOwnerWithNewRating;
      });

      return NextResponse.json(
        { message: "Printer Owner rating updated successfully!", rating: updatedPrinterOwner.ratings },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Invalid seller type." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error updating rating:", error);
    return NextResponse.json(
      { error: "Failed to update rating." },
      { status: 500 }
    );
  }
}
