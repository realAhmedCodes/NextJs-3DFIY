// /app/api/users/[userId]/detail/route.js

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// Initialize Prisma Client
const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { userId } = params;

  console.log("Fetching details for userId:", userId);

  try {
    const user = await prisma.Users.findUnique({
      where: { user_id: parseInt(userId, 10) },
      select: {
        user_id: true,
        name: true,
        username: true,
        email: true,
        location: true,
        phoneNo: true,
        sellerType: true,
        is_verified: true,
        profile_pic: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { error: "Failed to fetch user details" },
      { status: 500 }
    );
  }
}
