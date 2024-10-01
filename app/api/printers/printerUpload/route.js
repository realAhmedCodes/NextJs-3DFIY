/*import path from "path";
import fs from "fs";
import pool from "@/app/lib/db";

const uploadDir = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req) {
  try {
    const form = await req.formData();

    const printer_owner_id = parseInt(form.get("printer_owner_id"), 10);
    const name = form.get("name");
    const description = form.get("description");
    const printerType = form.get("printerType");
    const materials = JSON.parse(form.get("materials"));
    const colors = JSON.parse(form.get("colors"));
    const services = JSON.parse(form.get("services"));
    const price = parseFloat(form.get("price"));
    const location = form.get("location");
    const image = form.get("image");

    if (
      !printer_owner_id ||
      !name ||
      !printerType ||
      !materials.length ||
      !colors.length ||
      !services.length ||
      !image
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
        }
      );
    }

    const imageFilename = `${name}_image_${Date.now()}.${image.name
      .split(".")
      .pop()}`;
    const imagePath = path.join(uploadDir, imageFilename);

    const imageBuffer = Buffer.from(await image.arrayBuffer());
    fs.writeFileSync(imagePath, imageBuffer);

    const now = new Date().toISOString();

    const result = await pool.query(
      `INSERT INTO "printers" (printer_owner_id, name, description, printer_type, materials, colors, services, price, location, image, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5::text[], $6::text[], $7::text[], $8, $9, $10, $11, $12) RETURNING *`,
      [
        printer_owner_id,
        name,
        description,
        printerType,
        materials,
        colors,
        services,
        price,
        location,
        imageFilename,
        now,
        now,
      ]
    );

    return new Response(JSON.stringify(result.rows[0]), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to upload printer" }), {
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

export async function POST(req) {
  try {
    const form = await req.formData();

    // Parse form fields
    const printer_owner_id = parseInt(form.get("printer_owner_id"), 10);
    const name = form.get("name");
    const description = form.get("description");
    const printerType = form.get("printerType");
    const materials = JSON.parse(form.get("materials"));
    const colors = JSON.parse(form.get("colors"));
    const services = JSON.parse(form.get("services"));
    const price = parseFloat(form.get("price"));
    const location = form.get("location");
    const image = form.get("image");

   console.log(
     printer_owner_id ,
       name,
       printerType,
       materials,
       colors,
       services,
       image
   );
    if (
      !printer_owner_id ||
      !name ||
      !printerType ||
      !materials.length ||
      !colors.length ||
      !services.length ||
      !image
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
        }
      );
    }

    // Handle image upload
    const imageFilename = `${name}_image_${Date.now()}.${image.name
      .split(".")
      .pop()}`;
    const imagePath = path.join(uploadDir, imageFilename);
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    fs.writeFileSync(imagePath, imageBuffer);

    // Create printer record using Prisma
    const newPrinter = await prisma.printers.create({
      data: {
        printer_owner_id: printer_owner_id,
        name: name,
        description: description,
        printer_type: printerType,
        materials: materials, // Array of text (text[])
        colors: colors, // Array of text (text[])
        services: services, // Array of text (text[])
        price: price,
        location: location,
        image: imageFilename,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return new Response(JSON.stringify(newPrinter), { status: 201 });
  } catch (error) {
    console.error("Error uploading printer:", error);
    return new Response(JSON.stringify({ error: "Failed to upload printer" }), {
      status: 500,
    });
  }
}
