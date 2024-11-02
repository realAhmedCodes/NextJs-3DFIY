/*import { NextResponse } from "next/server";

// OTP store (in-memory, but should be in a database for production)
const otpStore = {}; // This should be moved to a shared file or database

// Handle OTP verification
export async function POST(req) {
  const { email, otp } = await req.json();
  console.log(otp, email)

  const storedData = otpStore[email];

  if (!storedData) {
    return NextResponse.json(
      { message: "No OTP found for this email" },
      { status: 401 }
    );
  }

  if (Date.now() > storedData.expiry) {
    return NextResponse.json({ message: "OTP expired" }, { status: 401 });
  }

  if (storedData.otp === otp) {
    delete otpStore[email]; // Remove the OTP after successful verification
    return NextResponse.json({
      message: "OTP verified, authentication successful",
    });
  } else {
    return NextResponse.json({ message: "Invalid OTP" }, { status: 401 });
  }
}
*/
/*
import { NextResponse } from "next/server";
import { storeOTP, deleteOTP, retrieveOTP } from "@/app/utlits/otpstore";// Import from the shared module

export async function POST(req) {
  const { email, otp } = await req.json();
  console.log(otp, email);


const storedData = retrieveOTP(email);
console.log("Retrieved OTP data for email:", email, storedData);


  if (!storedData) {
    return NextResponse.json(
      { message: "No OTP found for this email" },
      { status: 401 }
    );
  }

  if (Date.now() > storedData.expiry) {
    return NextResponse.json({ message: "OTP expired" }, { status: 401 });
  }

  if (storedData.otp === otp) {
    deleteOTP(email); // Remove the OTP after successful verification
    return NextResponse.json({
      message: "OTP verified, authentication successful",
    });
  } else {
    return NextResponse.json({ message: "Invalid OTP" }, { status: 401 });
  }
}
*/





/*

import { NextResponse } from "next/server";
//import { retrieveOTP, deleteOTP } from "@/app/utils/otpStore";
import { storeOTP, deleteOTP, retrieveOTP } from "@/app/utlits/otpstore"; // Adjust the path if necessary

export async function POST(req) {
  const { email, otp } = await req.json();
  console.log("Received OTP and email:", otp, email);

  const storedData = await retrieveOTP(email);

  if (!storedData) {
    return NextResponse.json(
      { message: "No OTP found for this email" },
      { status: 401 }
    );
  }

  if (Date.now() > new Date(storedData.expiry).getTime()) {
    return NextResponse.json({ message: "OTP expired" }, { status: 401 });
  }

  if (storedData.otp === otp) {
    await deleteOTP(email); // Remove the OTP after successful verification
    return NextResponse.json({
      message: "OTP verified, authentication successful",
    });
  } else {
    return NextResponse.json({ message: "Invalid OTP" }, { status: 401 });
  }
}
*/

/*
import pool from "../../lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const saveFileLocally = (buffer, filename) => {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);
  return filePath;
};

export async function POST(req) {
  try {
    const { email, otp, name, username, password, location, phoneNo, cnic_number, sellerType, bio, profile_pic } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "OTP and email are required" }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      // Check OTP validity
      const otpQuery = await client.query('SELECT * FROM "otp" WHERE email = $1 AND otp = $2', [email, otp]);
      if (otpQuery.rowCount === 0 || otpQuery.rows[0].expiry < new Date()) {
        return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
      }

      // Hash password and insert user data into Users table
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const currentTimestamp = new Date();

      await client.query("BEGIN");

      const userInsertText =
        'INSERT INTO "Users"(name, username, email, password, location, "phoneNo", "sellerType", "createdAt", "updatedAt", is_verified) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, true) RETURNING user_id';
      const userInsertValues = [
        name,
        username,
        email,
        hashedPassword,
        location,
        phoneNo,
        sellerType,
        currentTimestamp,
        currentTimestamp,
      ];
      const result = await client.query(userInsertText, userInsertValues);
      const newUserId = result.rows[0].user_id;

      const profile_pic_path = profile_pic
        ? saveFileLocally(Buffer.from(profile_pic), `profile_${newUserId}.jpg`)
        : null;

      if (profile_pic_path) {
        const updateUserText = 'UPDATE "Users" SET profile_pic = $1, "updatedAt" = $2 WHERE user_id = $3';
        await client.query(updateUserText, [profile_pic_path, currentTimestamp, newUserId]);
      }

      let sellerInsertText, sellerInsertValues;
      if (sellerType === "Designer") {
        sellerInsertText = 'INSERT INTO "Designers"(user_id, cnic_number, bio, "createdAt", "updatedAt") VALUES($1, $2, $3, $4, $5)';
        sellerInsertValues = [newUserId, cnic_number, bio, currentTimestamp, currentTimestamp];
      } else if (sellerType === "Printer Owner") {
        sellerInsertText = 'INSERT INTO "Printer_Owners"(user_id, cnic_number, bio, "createdAt", "updatedAt") VALUES($1, $2, $3, $4, $5)';
        sellerInsertValues = [newUserId, cnic_number, bio, currentTimestamp, currentTimestamp];
      }

      if (sellerInsertText) {
        await client.query(sellerInsertText, sellerInsertValues);
      }

      await client.query("COMMIT");

      return NextResponse.json({ message: "User and Seller created successfully", data: { user_id: newUserId, sellerType } }, { status: 201 });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error executing query", error.stack);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

*/
// app/api/otp/verify/route.js

import { NextResponse } from 'next/server';
import { retrieveOTP, deleteOTP } from '@/app/utlits/otpstore';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    // Retrieve the stored OTP for the email
    const storedOTPRecord = await retrieveOTP(email);

    if (!storedOTPRecord) {
      return NextResponse.json(
        { error: 'No OTP found for this email.' },
        { status: 400 }
      );
    }

    // Check if the OTP has expired
    if (storedOTPRecord.expiry < new Date()) {
      // Delete the expired OTP
      await deleteOTP(email);
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check if the OTP matches
    if (storedOTPRecord.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP. Please try again.' },
        { status: 400 }
      );
    }

    // OTP is valid, delete it
    await deleteOTP(email);

    // Mark the user as verified in the database
    await prisma.users.update({
      where: { email },
      data: { is_verified: true },
    });

    return NextResponse.json(
      { message: 'OTP verified successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during OTP verification:', error);
    return NextResponse.json({ error: 'Failed to verify OTP.' }, { status: 500 });
  }
}
