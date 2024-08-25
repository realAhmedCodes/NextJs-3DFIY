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

import bcrypt from "bcrypt";
import pool from "../../lib/db";
import multer from "multer";
import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";

const upload = multer({ storage: multer.memoryStorage() });
/*const saveFileLocally = (buffer, filename) => {
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);
  return filePath;
};*/
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
