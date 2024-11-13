
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();
const uploadDir = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req, { params }) {
  const { sellerId } = params;

  try {
    // Parse form data
    const form = await req.formData();
    const modelName = form.get("modelName");
    const description = form.get("description");
    const dimensions = JSON.parse(form.get("dimensions"));
    const fileFormat = form.get("fileFormat");
    const referenceFile = form.get("referenceFile");
    const additionalNotes = form.get("additionalNotes");
    const userId = parseInt(form.get("userId"), 10);

  console.log(
  modelName ,
    description ,
    dimensions ,
    fileFormat ,
    sellerId ,
    userId,
  );
    if (
      !modelName ||
      !description ||
      !dimensions ||
      !fileFormat ||
      !sellerId ||
      !userId
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Handle file upload
    let filename = null;
    if (referenceFile && referenceFile.name) {
      filename = `${sellerId}_${Date.now()}.${referenceFile.name
        .split(".")
        .pop()}`;
      const filePath = path.join(uploadDir, filename);

      // Write file to disk
      const fileBuffer = Buffer.from(await referenceFile.arrayBuffer());
      fs.writeFileSync(filePath, fileBuffer);
    }

    // Get current timestamp
    const now = new Date();

    // Create a new order using Prisma
    const newOrder = await prisma.model_orders.create({
      data: {
        user_id: userId,
        model_name: modelName,
        description: description,
        dimensions: dimensions,
        file_format: fileFormat,
        reference_file: filename,
        additional_notes: additionalNotes,
        designer_id: parseInt(sellerId, 10),
        created_at: now,
        updated_at: now,
      },
    });

    // Return success response
    return new Response(JSON.stringify(newOrder), { status: 201 });
  } catch (error) {
    console.error("Error placing order:", error);
    return new Response(JSON.stringify({ error: "Failed to place order" }), {
      status: 500,
    });
  }
}

