// /app/api/printedModels/upload/route.ts

import path from "path";
import fs from "fs/promises";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const uploadDir = path.join(process.cwd(), "public", "uploads", "printedModels");

// Ensure the upload directory exists
fs.access(uploadDir).catch(async () => {
  await fs.mkdir(uploadDir, { recursive: true });
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Log all received form data
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}:`, value.name);
      } else {
        console.log(`${key}:`, value);
      }
    }

    // Retrieve form data fields
    const user_id = formData.get("user_id") ? parseInt(formData.get("user_id") as string, 10) : null;
    const printer_owner_id = formData.get("printer_owner_id") ? parseInt(formData.get("printer_owner_id") as string, 10) : null;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const material = formData.get("material") as string;
    const color = formData.get("color") as string;
    const resolution = formData.get("resolution") as string;
    const resistance = formData.get("resistance") as string;
    const dimensionsRaw = formData.get("dimensions") as string;
    const dimensions = dimensionsRaw ? JSON.parse(dimensionsRaw) : null;
    const weight = formData.get("weight") ? parseFloat(formData.get("weight") as string) : null;
    const status = formData.get("status") as string || "available";
    const priceRaw = formData.get("price") as string;
    const price = priceRaw ? parseFloat(priceRaw) : null;
    const image = formData.get("image") as File;

    // Validate required fields
    if (!name || !description || !material || !color || !resolution || !resistance || !image) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate image type
    const allowedImageTypes = ["jpeg", "jpg", "png"];
    const imageExt = image.name.split(".").pop()?.toLowerCase();
    if (!allowedImageTypes.includes(imageExt!)) {
      console.error("Invalid image type:", imageExt);
      return new Response(
        JSON.stringify({
          error: "Invalid image file type. Only JPEG and PNG are allowed.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Prepare the image filename and path
    const timestamp = Date.now();
    const imageFileName = `${name}_image_${timestamp}.${imageExt}`;
    const imageFilePath = path.join(uploadDir, imageFileName);

    // Write the image file to disk
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    await fs.writeFile(imageFilePath, imageBuffer);

    // Insert model data into the database
    const newPrintedModel = await prisma.printed_models.create({
      data: {
        user_id,
        printer_owner_id,
        name,
        description,
        material,
        color,
        resolution,
        resistance,
        dimensions,
        weight,
        image: imageFileName,
        status,
        price,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    console.log("Successfully created printed model:", newPrintedModel.printed_model_id);

    return new Response(JSON.stringify(newPrintedModel), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error during printed model upload:", error);
    return new Response(JSON.stringify({ error: "Failed to upload printed model" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
