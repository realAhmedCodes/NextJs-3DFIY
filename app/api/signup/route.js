

// app/api/signup/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient(); // Initialize Prisma client

// Function to save the file locally
const saveFileLocally = async (file, userId) => {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const extension = file.name.split(".").pop();
  const filename = `profile_${userId}.${extension}`;
  const filePath = path.join(uploadsDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);
  return `/uploads/${filename}`; // Return the public path to the file
};

export async function POST(req) {
  try {
    const data = await req.formData();

    // Extract fields from FormData
    const name = data.get("name");
    const username = data.get("username");
    const email = data.get("email");
    const password = data.get("password");
    const location = data.get("location");
    const phoneNo = data.get("phoneNo");
    const cnic_number = data.get("cnic_number");
    const sellerType = data.get("sellerType");
    const bio = data.get("bio");
    const profile_pic = data.get("profile_pic"); 

   console.log(
  name,
      username,
    email,
      password,
      location,
       phoneNo,
        cnic_number,
       sellerType,
bio,
       profile_pic,
   )
    if (
      !name ||
      !username ||
      !email ||
      !password ||
      !sellerType
    ) {
      return NextResponse.json(
        { error: "Required fields are missing." },
        { status: 400 }
      );
    }

    if (
      (sellerType === "Designer" || sellerType === "Printer Owner") &&
      !profile_pic
    ) {
      return NextResponse.json(
        {
          error:
            "Profile picture is required for Designer and Printer Owner.",
        },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists." },
        { status: 400 }
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const currentTimestamp = new Date();

    // Create user
    const newUser = await prisma.users.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        location,
        phoneNo,
        sellerType,
        createdAt: currentTimestamp,
        updatedAt: currentTimestamp,
      },
    });

    // Save profile picture if provided
    let profilePicPath = null;
    if (profile_pic && profile_pic.size > 0) {
      profilePicPath = await saveFileLocally(profile_pic, newUser.user_id);

      // Update user with profile picture path
      await prisma.users.update({
        where: { user_id: newUser.user_id },
        data: { profile_pic: profilePicPath },
      });
    }

    // Insert into Designers or Printer_Owners based on sellerType
    if (sellerType === "Designer") {
      await prisma.designers.create({
        data: {
          user_id: newUser.user_id,
          cnic_number,
          bio,
          createdAt: currentTimestamp,
          updatedAt: currentTimestamp,
        },
      });
    } else if (sellerType === "Printer Owner") {
      await prisma.printer_Owners.create({
        data: {
          user_id: newUser.user_id,
          cnic_number,
          bio,
          createdAt: currentTimestamp,
          updatedAt: currentTimestamp,
        },
      });
    }

    return NextResponse.json(
      {
        message: "User registered successfully. Please verify your email.",
        data: { user_id: newUser.user_id, sellerType },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
