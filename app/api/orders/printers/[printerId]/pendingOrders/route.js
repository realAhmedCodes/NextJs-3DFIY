
/*
import pool from "@/app/lib/db";
import path from "path";
import fs from "fs";


const uploadDir = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
export async function POST(req, { params }) {
  const { printerId } = params;
  console.log(printerId); // For debugging

  try {
    const form = await req.formData();

    const user_id = parseInt(form.get("userId"), 10);
    const printer_Owner_id = parseInt(form.get("printer_Owner_id"), 10);
    const material = form.get("material");
    const color = form.get("color");
    const resolution = form.get("resolution");
    const resistance = form.get("resistance");
    const model_file = form.get("file");
    const instructions = form.get("instructions");
    console.log(
      user_id,
      printerId,
      printer_Owner_id,
      material,
      color,
      resolution,
      resistance,
      model_file,
      instructions
    );
    if (
      !user_id ||
      !printerId ||
      !material ||
      !color ||
      !resolution ||
      !resistance ||
      !model_file ||
      !printer_Owner_id ||
      !instructions
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
        }
      );
    }
 const filename = `${printerId}_${Date.now()}.${model_file.name
   .split(".")
   .pop()}`;
 const filePath = path.join(uploadDir, filename);

 // Write file to disk
 const fileBuffer = Buffer.from(await model_file.arrayBuffer());
 fs.writeFileSync(filePath, fileBuffer);
    const now = new Date().toISOString();

    const result = await pool.query(
      `INSERT INTO "printer_orders" 
        (user_id, printerid,printer_Owner_id, material, color, resolution, resistance, model_file, instructions, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11) RETURNING *`,
      [
        user_id,
        printerId,
        printer_Owner_id,
        material,
        color,
        resolution,
        resistance,
        filename,
        instructions,
        now,
        now,
      ]
    );

    return new Response(JSON.stringify(result.rows[0]), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to place order" }), {
      status: 500,
    });
  }
}
*/

import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();
const uploadDir = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req, { params }) {
  const { printerId } = params;
  console.log(printerId); // For debugging

  try {
    const form = await req.formData();

    const user_id = parseInt(form.get("userId"), 10);
    const printer_owner_id = parseInt(form.get("printer_Owner_id"), 10);
    const material = form.get("material");
    const color = form.get("color");
    const resolution = form.get("resolution");
    const resistance = form.get("resistance");
    const model_file = form.get("file");
    const instructions = form.get("instructions");
console.log(
user_id ,
  printerId ,
  material ,
  color ,
  resistance ,
  model_file ,
  printer_owner_id ,
  instructions,
);
    if (
      !user_id ||
      !printerId ||
      !material ||
      !color ||
      !resolution ||
      !resistance ||
      !model_file ||
      !printer_owner_id ||
      !instructions
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Handle file upload
    const filename = `${printerId}_${Date.now()}.${model_file.name
      .split(".")
      .pop()}`;
    const filePath = path.join(uploadDir, filename);

    // Write file to disk
    const fileBuffer = Buffer.from(await model_file.arrayBuffer());
    fs.writeFileSync(filePath, fileBuffer);

    // Insert order using Prisma
    const newOrder = await prisma.printer_orders.create({
      data: {
        user_id: user_id,
        printerid: parseInt(printerId, 10),
        printer_owner_id: printer_owner_id,
        material: material,
        color: color,
        resolution: resolution,
        resistance: resistance,
        model_file: filename, // Save the filename in the database
        instructions: instructions,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return new Response(JSON.stringify(newOrder), { status: 201 });
  } catch (error) {
    console.error("Error placing order:", error);
    return new Response(JSON.stringify({ error: "Failed to place order" }), {
      status: 500,
    });
  }
}
