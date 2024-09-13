/*import path from "path";
import fs from "fs";
import pool from "@/app/lib/db";

const uploadDir = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req, { params }) {
  const { printerId } = params;
  try {
    const form = await req.formData();

    const user_id = parseInt(form.get("user_id"), 10);

    const printer_owner_id = parseInt(form.get("printer_owner_id"), 10);
    const instructions = form.get("instructions");
    const material = form.get("material");
    const color = form.get("color");
    const resolution = form.get("resolution");
    const resistance = form.get("resistance");
    const model_file = form.get("modelFile");

    console.log(
      user_id,
      printerId,
      printer_owner_id,
      material,
      color,
      resolution,
      resistance,
      model_file,
      instructions
    );
    if (!user_id || !printerId || !printer_owner_id || !model_file) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
        }
      );
    }

    // Prepare filename for storage
    const filename = `${printerId}_${Date.now()}.${model_file.name
      .split(".")
      .pop()}`;
    const filePath = path.join(uploadDir, filename);

    // Write file to disk
    const fileBuffer = Buffer.from(await model_file.arrayBuffer());
    fs.writeFileSync(filePath, fileBuffer);

    // Get the current timestamp for created_at and updated_at
    const now = new Date().toISOString();

    // Database insertion
    const result = await pool.query(
      `INSERT INTO "pending_printers_orders" 
       (user_id, printerid, printer_owner_id, model_file, instructions, material, color, resolution, resistance, status, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', $10, $11) RETURNING *`,
      [
        user_id,
        printerId,
        printer_owner_id,
        filename, // Store the filename instead of the file content
        instructions,
        material,
        color,
        resolution,
        resistance,
        now,
        now,
      ]
    );

    return new Response(JSON.stringify(result.rows[0]), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to process order" }), {
      status: 500,
    });
  }
}*/

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
/*
CREATE TABLE pending_printers_orders (
    pending_order_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "Users"(user_id),
  printerId INTEGER NOT NULL REFERENCES "printers"(printer_id),
    printer_owner_id INTEGER REFERENCES "Printer_Owners"(printer_owner_id),
    model_file VARCHAR NOT NULL,
    instructions TEXT NOT NULL,
    material VARCHAR NOT NULL,
    color VARCHAR NOT NULL,
    resolution VARCHAR NOT NULL,
    resistance VARCHAR NOT NULL,
    status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'denied')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

*/
