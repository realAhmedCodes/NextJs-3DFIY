// app/api/models/modelUpload/route.js
/*

import path from "path";
import fs from "fs";
import pool from "@/app/lib/db"; 

const uploadDir = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req) {
  try {
    const form = await req.formData();

    const category_id = parseInt(form.get("category_id"), 10);
    const designer_id = parseInt(form.get("designer_id"), 10);
    const name = form.get("name");
    const description = form.get("description");
    const price = parseFloat(form.get("price"));
    const is_free = form.get("is_free") === "true";
    const tags = JSON.parse(form.get("tags"));
    const model_file = form.get("modelFile");
    const image = form.get("image");

    // Validate mandatory fields
    if (!category_id || !designer_id || !name || !model_file || !image) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
        }
      );
    }

    // Prepare filenames for storage
    const filename = `${name}_model_${Date.now()}.${model_file.name
      .split(".")
      .pop()}`;
    const filePath = path.join(uploadDir, filename);

    const imageFilename = `${name}_image_${Date.now()}.${image.name
      .split(".")
      .pop()}`;
    const imagePath = path.join(uploadDir, imageFilename);

    // Write files to disk
    const fileBuffer = Buffer.from(await model_file.arrayBuffer());
    fs.writeFileSync(filePath, fileBuffer);

    const imageBuffer = Buffer.from(await image.arrayBuffer());
    fs.writeFileSync(imagePath, imageBuffer);

    // Get the current timestamp for createdAt and updatedAt
    const now = new Date().toISOString();

    // Format the tags array for PostgreSQL
    const formattedTags = `{${tags.map((tag) => `"${tag}"`).join(",")}}`;

    // Database insertion
    const result = await pool.query(
      'INSERT INTO "Models" (category_id, designer_id, name, description, price, is_free, tags, model_file, image, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [
        category_id,
        designer_id,
        name,
        description,
        price,
        is_free,
        formattedTags,
        filename,
        imageFilename,
        now,
        now,
      ]
    );

    return new Response(JSON.stringify(result.rows[0]), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to upload model" }), {
      status: 500,
    });
  }
}*/
import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const uploadDir = path.join(process.cwd(), "public", "uploads");

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req) {
  try {
    const form = await req.formData();

    const category_id = parseInt(form.get("category_id"), 10);
    const designer_id = parseInt(form.get("designer_id"), 10);
    const name = form.get("name");
    const description = form.get("description");
    const price = parseFloat(form.get("price"));
    const is_free = form.get("is_free") === "true";
    const tags = JSON.parse(form.get("tags"));
    const model_file = form.get("modelFile");
    const image = form.get("image");

    // Validate mandatory fields
    if (!category_id || !designer_id || !name || !model_file || !image) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
        }
      );
    }

    // Prepare filenames for storage
    const filename = `${name}_model_${Date.now()}.${model_file.name
      .split(".")
      .pop()}`;
    const filePath = path.join(uploadDir, filename);

    const imageFilename = `${name}_image_${Date.now()}.${image.name
      .split(".")
      .pop()}`;
    const imagePath = path.join(uploadDir, imageFilename);

    // Write files to disk
    const fileBuffer = Buffer.from(await model_file.arrayBuffer());
    fs.writeFileSync(filePath, fileBuffer);

    const imageBuffer = Buffer.from(await image.arrayBuffer());
    fs.writeFileSync(imagePath, imageBuffer);

    // Insert model data into the database using Prisma
    const newModel = await prisma.models.create({
      data: {
        category_id,
        designer_id,
        name,
        description,
        price: is_free ? null : price, // If it's free, price can be null
        is_free,
        tags, // Prisma handles array types, no need to format manually
        model_file: filename, // File name is stored in the DB, actual file is on disk
        image: imageFilename, // Same for image
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return new Response(JSON.stringify(newModel), { status: 201 });
  } catch (error) {
    console.error("Error during model upload:", error);
    return new Response(JSON.stringify({ error: "Failed to upload model" }), {
      status: 500,
    });
  }
}
