/*import bcrypt from "bcrypt";
import pool from "../../lib/db";
import multer from "multer";
import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";

const upload = multer({ storage: multer.memoryStorage() });

const saveFileLocally = (buffer, filename) => {
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);
  return filePath;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const data = await req.formData();
  const files = {};
  data.forEach((value, key) => {
    if (value instanceof File) {
      files[key] = value;
    }
  });

  const {
    name,
    username,
    email,
    password,
    location,
    phoneNo,
    cnic_number,
    sellerType,
    bio,
  } = Object.fromEntries(data.entries());
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
  profile_pic
);
  if (
    !name ||
    !username ||
    !email ||
    !password ||
    !location ||
    !phoneNo ||
    !sellerType
  ) {
    return NextResponse.json(
      { error: "All fields are required except bio and cnic_pic" },
      { status: 400 }
    );
  }

  if (
    (sellerType === "Designer" || sellerType === "Printer Owner") &&
    (!files.profile_pic || !files.cnic_pic)
  ) {
    return NextResponse.json(
      {
        error:
          "Profile picture and CNIC picture are required for Designer and Printer Owner.",
      },
      { status: 400 }
    );
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const currentTimestamp = new Date();

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const userInsertText =
        'INSERT INTO "Users"(name, username, email, password, location, "phoneNo", "sellerType", "createdAt", "updatedAt") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING user_id';

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

      const cnic_pic_path = files.cnic_pic
        ? saveFileLocally(
            Buffer.from(await files.cnic_pic.arrayBuffer()),
            `cnic_${newUserId}.jpg`
          )
        : null;
      const profile_pic_path = files.profile_pic
        ? saveFileLocally(
            Buffer.from(await files.profile_pic.arrayBuffer()),
            `profile_${newUserId}.jpg`
          )
        : null;

      if (profile_pic_path) {
        const updateUserText =
          'UPDATE "Users" SET profile_pic = $1, "updatedAt" = $2 WHERE user_id = $3';
        await client.query(updateUserText, [
          profile_pic_path,
          currentTimestamp,
          newUserId,
        ]);
      }

      let sellerInsertText, sellerInsertValues;
      if (sellerType === "Designer") {
        sellerInsertText =
          "INSERT INTO designers(user_id, cnic_number, cnic_pic, bio) VALUES($1, $2, $3, $4)";
        sellerInsertValues = [newUserId, cnic_number, cnic_pic_path, bio];
      } else if (sellerType === "Printer Owner") {
        sellerInsertText =
          "INSERT INTO printer_owners(user_id, cnic_number, cnic_pic, bio) VALUES($1, $2, $3, $4)";
        sellerInsertValues = [newUserId, cnic_number, cnic_pic_path, bio];
      }

      if (sellerInsertText) {
        await client.query(sellerInsertText, sellerInsertValues);
      }

      await client.query("COMMIT");

      return NextResponse.json(
        {
          message: "User and Seller created successfully",
          data: { user_id: newUserId, sellerType },
        },
        { status: 201 }
      );
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error executing query", error.stack);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
*/


//part of code
/*const saveFileLocally = (buffer, filename) => {
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);
  return filePath;
};*/



/*
import bcrypt from "bcrypt";
import pool from "../../lib/db";
import multer from "multer";
import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";

const upload = multer({ storage: multer.memoryStorage() });



const saveFileLocally = (buffer, filename) => {
  const uploadsDir = path.join(process.cwd(), "public", "uploads"); // Updated path
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);
  return filePath;
};


export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const data = await req.formData();
    const files = {};
    data.forEach((value, key) => {
      if (value instanceof File) {
        files[key] = value;
      }
    });

    const {
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
    } = Object.fromEntries(data.entries());

    console.log("Received data:", {
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
      profile_pic: files.profile_pic,
    });

    if (
      !name ||
      !username ||
      !email ||
      !password ||
      !location ||
      !phoneNo ||
      !sellerType
    ) {
      return NextResponse.json(
        { error: "All fields are required except bio and cnic_pic" },
        { status: 400 }
      );
    }

    if (
      (sellerType === "Designer" || sellerType === "Printer Owner") &&
      !files.profile_pic
    ) {
      return NextResponse.json(
        {
          error:
            "Profile picture and CNIC picture are required for Designer and Printer Owner.",
        },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const currentTimestamp = new Date();

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const userInsertText =
        'INSERT INTO "Users"(name, username, email, password, location, "phoneNo", "sellerType", "createdAt", "updatedAt") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING user_id';

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

      const profile_pic_path = files.profile_pic
        ? saveFileLocally(
            Buffer.from(await files.profile_pic.arrayBuffer()),
            `profile_${newUserId}.jpg`
          )
        : null;

      if (profile_pic_path) {
        const updateUserText =
          'UPDATE "Users" SET profile_pic = $1, "updatedAt" = $2 WHERE user_id = $3';
        await client.query(updateUserText, [
          profile_pic_path,
          currentTimestamp,
          newUserId,
        ]);
      }

      let sellerInsertText, sellerInsertValues;
      if (sellerType === "Designer") {
        sellerInsertText =
          'INSERT INTO "Designers"(user_id, cnic_number, bio, "createdAt", "updatedAt") VALUES($1, $2, $3, $4, $5)';
        sellerInsertValues = [
          newUserId,
          cnic_number,
          bio,
          currentTimestamp,
          currentTimestamp,
        ];
      } else if (sellerType === "Printer Owner") {
        sellerInsertText =
          'INSERT INTO "Printer_Owners"(user_id, cnic_number, bio, "createdAt", "updatedAt") VALUES($1, $2, $3, $4, $5)';
          
        sellerInsertValues = [
          newUserId,
          cnic_number,
          bio,
          currentTimestamp,
          currentTimestamp,
        ];
      }

      if (sellerInsertText) {
        await client.query(sellerInsertText, sellerInsertValues);
      }

      await client.query("COMMIT");

      return NextResponse.json(
        {
          message: "User and Seller created successfully",
          data: { user_id: newUserId, sellerType },
        },
        { status: 201 }
      );
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error executing query", error.stack);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
*/
/*

import bcrypt from "bcrypt";
import pool from "../../lib/db";
import multer from "multer";
import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";
import crypto from "crypto";

const upload = multer({ storage: multer.memoryStorage() });

const saveFileLocally = (buffer, filename) => {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);
  return filePath;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const data = await req.formData();
    const files = {};
    data.forEach((value, key) => {
      if (value instanceof File) {
        files[key] = value;
      }
    });

    const {
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
    } = Object.fromEntries(data.entries());

    if (
      !name ||
      !username ||
      !email ||
      !password ||
      !location ||
      !phoneNo ||
      !sellerType
    ) {
      return NextResponse.json(
        { error: "All fields are required except bio and cnic_pic" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      // Generate OTP and save it to the otp table with expiry
      const otp = crypto.randomInt(100000, 999999).toString();
      const expiry = new Date();
      expiry.setMinutes(expiry.getMinutes() + 10); // OTP expiry set to 10 minutes

      await client.query(
        'INSERT INTO "otp"(email, otp, expiry) VALUES($1, $2, $3)',
        [email, otp, expiry]
      );

      await client.query("COMMIT");

      // Send OTP to user (Placeholder logic, implement email/SMS sending)
      console.log(`OTP for ${email}: ${otp}`);

      return NextResponse.json(
        { message: "OTP sent to your email." },
        { status: 200 }
      );
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error executing query", error.stack);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
*/


/*

import bcrypt from "bcrypt";
import pool from "../../lib/db";
import multer from "multer";
import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";

const upload = multer({ storage: multer.memoryStorage() });


const saveFileLocally = (buffer, filename) => {
  const uploadsDir = path.join(process.cwd(), "public", "uploads"); // Updated path
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);
  return filePath;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const data = await req.formData();
    const files = {};
    data.forEach((value, key) => {
      if (value instanceof File) {
        files[key] = value;
      }
    });

    const {
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
    } = Object.fromEntries(data.entries());

    console.log("Received data:", {
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
      profile_pic: files.profile_pic,
    });

    if (
      !name ||
      !username ||
      !email ||
      !password ||
      !location ||
      !phoneNo ||
      !sellerType
    ) {
      return NextResponse.json(
        { error: "All fields are required except bio and cnic_pic" },
        { status: 400 }
      );
    }

    if (
      (sellerType === "Designer" || sellerType === "Printer Owner") &&
      !files.profile_pic
    ) {
      return NextResponse.json(
        {
          error:
            "Profile picture and CNIC picture are required for Designer and Printer Owner.",
        },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const currentTimestamp = new Date();

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const userInsertText =
        'INSERT INTO "Users"(name, username, email, password, location, "phoneNo", "sellerType", "createdAt", "updatedAt") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING user_id';

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

      const profile_pic_path = files.profile_pic
        ? saveFileLocally(
            Buffer.from(await files.profile_pic.arrayBuffer()),
            `profile_${newUserId}.jpg`
          )
        : null;

      if (profile_pic_path) {
        const updateUserText =
          'UPDATE "Users" SET profile_pic = $1, "updatedAt" = $2 WHERE user_id = $3';
        await client.query(updateUserText, [
          profile_pic_path,
          currentTimestamp,
          newUserId,
        ]);
      }

      let sellerInsertText, sellerInsertValues;
      if (sellerType === "Designer") {
        sellerInsertText =
          'INSERT INTO "Designers"(user_id, cnic_number, bio, "createdAt", "updatedAt") VALUES($1, $2, $3, $4, $5)';
        sellerInsertValues = [
          newUserId,
          cnic_number,
          bio,
          currentTimestamp,
          currentTimestamp,
        ];
      } else if (sellerType === "Printer Owner") {
        sellerInsertText =
          'INSERT INTO "Printer_Owners"(user_id, cnic_number, bio, "createdAt", "updatedAt") VALUES($1, $2, $3, $4, $5)';

        sellerInsertValues = [
          newUserId,
          cnic_number,
          bio,
          currentTimestamp,
          currentTimestamp,
        ];
      }

      if (sellerInsertText) {
        await client.query(sellerInsertText, sellerInsertValues);
      }

      await client.query("COMMIT");

      return NextResponse.json(
        {
          message: "User and Seller created successfully",
          data: { user_id: newUserId, sellerType },
        },
        { status: 201 }
      );
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error executing query", error.stack);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

*/


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
