// /app/api/users/[userId]/update/route.js
// /app/api/users/[userId]/updateUser/route.js
// /app/api/users/[userId]/updateUser/route.js

import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"; // Correct import

// Initialize Prisma Client
const prisma = new PrismaClient();

// Define the upload directory
const uploadDir = path.join(process.cwd(), "public", "uploads", "profile_pics");

// Ensure the upload directory exists
await fs.mkdir(uploadDir, { recursive: true });

// Helper function to sanitize filenames
function sanitizeFilename(name) {
  return name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
}

// Disable Next.js default body parsing for this route
export const runtime = "nodejs";

export async function PUT(req, { params }) {
  const { userId } = params;

  console.log("Received userId:", userId);

  try {
    // Parse the incoming multipart/form-data
    const formData = await req.formData();

    // Extract fields from the form data
    const name = formData.get("name") || null;
    const username = formData.get("username") || null;
    const location = formData.get("location") || null;
    const email = formData.get("email") || null;
    const phoneNo = formData.get("phoneNo") || null;
   // const sellerType = formData.get("sellerType") || null;
    //const is_verified = formData.get("is_verified") === "true" || formData.get("is_verified") === true;
    const password = formData.get("password") || null;
    const profile_pic = formData.get("profile_pic"); // File

    // Log parsed form data for debugging
    console.log("Parsed Form Data:", {
      name,
      username,
      email,
      phoneNo,
      location,
     
      password: password ? "Provided" : "Not Provided",
      profile_pic: profile_pic ? profile_pic.name : "No new image uploaded",
    });

    
    // Additional Server-Side Validation
    // Example: Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // If password is provided, ensure it meets criteria (e.g., minimum length)
    if (password && password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Fetch existing user from the database
    const existingUser = await prisma.Users.findUnique({
      where: { user_id: parseInt(userId, 10) },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Initialize variables for new profile picture
    let newProfilePicFilename = existingUser.profile_pic || null;

    // Handle profile picture upload
    if (profile_pic && profile_pic.name) {
      const allowedImageTypes = ["jpeg", "jpg", "png"];
      const imageExt = profile_pic.name.split(".").pop().toLowerCase();
      if (!allowedImageTypes.includes(imageExt)) {
        return NextResponse.json(
          {
            error: "Invalid image file type. Only JPEG and PNG are allowed.",
          },
          { status: 400 }
        );
      }

      const sanitizedName = sanitizeFilename(name);
      const timestamp = Date.now();
      newProfilePicFilename = `${sanitizedName}_profile_${timestamp}.${imageExt}`;
      const profilePicPath = path.join(uploadDir, newProfilePicFilename);
      const profilePicBuffer = Buffer.from(await profile_pic.arrayBuffer());
      await fs.writeFile(profilePicPath, profilePicBuffer);
      console.log("New profile picture saved:", profilePicPath);

      // Delete old profile picture file if it exists and is not default
      if (existingUser.profile_pic && existingUser.profile_pic !== "default.png") {
        const oldProfilePicPath = path.join(uploadDir, existingUser.profile_pic);
        try {
          await fs.unlink(oldProfilePicPath);
          console.log("Old profile picture deleted:", oldProfilePicPath);
        } catch (err) {
          console.warn("Failed to delete old profile picture:", oldProfilePicPath);
        }
      }
    }

    // Hash the password if it's being updated
    let hashedPassword = existingUser.password;
    if (password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    // Update user record using Prisma
    const updatedUser = await prisma.Users.update({
      where: { user_id: parseInt(userId, 10) },
      data: {
        name: name || existingUser.name,
        username: username || existingUser.username,
        location: location || existingUser.location,
        email: email || existingUser.email,
        phoneNo: phoneNo || existingUser.phoneNo,
        // sellerType and is_verified are not updated as per your request
        // If needed, you can include them here without changing their values
        is_verified: existingUser.is_verified, // Ensuring it's unchanged
        password: hashedPassword,
        profile_pic: newProfilePicFilename,
      },
    });

    console.log("Updated User:", updatedUser);

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
