/*import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../../lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    const client = await pool.connect();
    const userQuery = 'SELECT * FROM "Users" WHERE email = $1';
    const userResult = await client.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { detail: "User does not exist!" },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      let sellerId = null;
      let tokenPayload = {
        user_id: user.user_id,
        email: user.email,
        sellerType: user.sellerType,
        is_verified: user.is_verified,
      };

      if (user.sellerType === "Designer") {
        const designerQuery = 'SELECT * FROM "Designers" WHERE user_id = $1';
        const designerResult = await client.query(designerQuery, [
          user.user_id,
        ]);
        sellerId = designerResult.rows.length
          ? designerResult.rows[0].designer_id
          : null;
        tokenPayload = { ...tokenPayload, seller_id: sellerId };
      } else if (user.sellerType === "Printer Owner") {
        const printerOwnerQuery =
          'SELECT * FROM "Printer_Owners" WHERE user_id = $1';
        const printerOwnerResult = await client.query(printerOwnerQuery, [
          user.user_id,
        ]);
        sellerId = printerOwnerResult.rows.length
          ? printerOwnerResult.rows[0].printer_owner_id
          : null;
        tokenPayload = { ...tokenPayload, seller_id: sellerId };
      }

      const token = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1hr",
      });

      return NextResponse.json({
        user_id: user.user_id,
        sellerType: user.sellerType,
        seller_id: sellerId,
        email: user.email,
        is_verified: user.is_verified,
        
        token,
      });
    } else {
      return NextResponse.json({ detail: "Login failed" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error", error);
    return NextResponse.json(
      { detail: "Internal Server Error" },
      { status: 500 }
    );
  }
}*/

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    // Fetch the user from the database using Prisma
    const user = await prisma.users.findUnique({
      where: { email },
    });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { detail: "User does not exist!" },
        { status: 401 }
      );
    }

    // Compare the password
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      let sellerId = null;
      let tokenPayload = {
        user_id: user.user_id,
        email: user.email,
        sellerType: user.sellerType,
        is_verified: user.is_verified,
      };

      // If user is a designer, fetch additional details using findFirst
      if (user.sellerType === "Designer") {
        const designer = await prisma.designers.findFirst({
          where: { user_id: user.user_id },
        });
        sellerId = designer ? designer.designer_id : null;
        tokenPayload = { ...tokenPayload, seller_id: sellerId };
      }

      // If user is a printer owner, fetch additional details using findFirst
      else if (user.sellerType === "Printer Owner") {
        const printerOwner = await prisma.printer_Owners.findFirst({
          where: { user_id: user.user_id },
        });
        sellerId = printerOwner ? printerOwner.printer_owner_id : null;
        tokenPayload = { ...tokenPayload, seller_id: sellerId };
      }

      // Generate JWT token
      const token = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1hr",
      });

      return NextResponse.json({
        user_id: user.user_id,
        sellerType: user.sellerType,
        seller_id: sellerId,
        email: user.email,
        is_verified: user.is_verified,
        token,
      });
    } else {
      return NextResponse.json({ detail: "Login failed" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error during login", error);
    return NextResponse.json(
      { detail: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
