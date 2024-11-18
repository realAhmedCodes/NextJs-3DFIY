// File: /app/api/models/modelUpload/route.js or route.ts
// File: /app/api/models/modelUpload/route.js

import path from "path";
import fs from "fs/promises";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const uploadDir = path.join(process.cwd(), "public", "uploads");

// Ensure the upload directory exists
fs.access(uploadDir).catch(async () => {
  await fs.mkdir(uploadDir, { recursive: true });
});

export async function POST(req) {
  try {
    const formData = await req.formData();

    const category_id = parseInt(formData.get("category_id"), 10);
    const designer_id = parseInt(formData.get("designer_id"), 10);
    const name = formData.get("name");
    const description = formData.get("description");
    const price = parseFloat(formData.get("price"));
    const is_free = formData.get("is_free") === "true";
    const tags = JSON.parse(formData.get("tags"));
    const model_file = formData.get("modelFile");
    const image = formData.get("image");

    // Validate mandatory fields
    if (!category_id || !designer_id || !name || !model_file || !image) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate file types
    const allowedModelTypes = ["stl", "obj"];
    const modelFileExt = model_file.name.split(".").pop().toLowerCase();
    if (!allowedModelTypes.includes(modelFileExt)) {
      return new Response(
        JSON.stringify({
          error: "Invalid model file type. Only .stl and .obj are allowed.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const allowedImageTypes = ["jpeg", "jpg", "png"];
    const imageExt = image.name.split(".").pop().toLowerCase();
    if (!allowedImageTypes.includes(imageExt)) {
      return new Response(
        JSON.stringify({
          error: "Invalid image file type. Only JPEG and PNG are allowed.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Prepare filenames for storage
    const timestamp = Date.now();
    const modelFileName = `${name}_model_${timestamp}.${modelFileExt}`;
    const modelFilePath = path.join(uploadDir, modelFileName);

    const imageFileName = `${name}_image_${timestamp}.${imageExt}`;
    const imageFilePath = path.join(uploadDir, imageFileName);

    // Write files to disk asynchronously
    const modelFileBuffer = Buffer.from(await model_file.arrayBuffer());
    await fs.writeFile(modelFilePath, modelFileBuffer);

    const imageBuffer = Buffer.from(await image.arrayBuffer());
    await fs.writeFile(imageFilePath, imageBuffer);

    // Insert model data into the database using Prisma
    const newModel = await prisma.models.create({
      data: {
        category_id,
        designer_id,
        name,
        description,
        price: is_free ? null : price,
        is_free,
        tags,
        model_file: modelFileName,
        image: imageFileName,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Send the image for indexing to FastAPI
    const indexingResponse = await sendImageToFastAPI(
      newModel.model_id,
      imageFilePath
    );

    if (!indexingResponse.ok) {
      const errorData = await indexingResponse.json();
      console.error("Error indexing image:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to index image in Pinecone" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(newModel), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error during model upload:", error);
    return new Response(JSON.stringify({ error: "Failed to upload model" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Helper function to send image to FastAPI
async function sendImageToFastAPI(model_id, imagePath) {
  console.log(`Sending image to FastAPI: model_id=${model_id}, imagePath=${imagePath}`);
  const form = new FormData();
  const fileBuffer = await fs.readFile(imagePath);

  // Determine MIME type based on file extension
  const mimeTypes = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
  };
  const ext = path.extname(imagePath).substring(1).toLowerCase();
  const mimeType = mimeTypes[ext] || "application/octet-stream";

  // Create a Blob from the file buffer
  const blob = new Blob([fileBuffer], { type: mimeType });

  form.append("file", blob, path.basename(imagePath));

  return fetch(`http://localhost:8000/index_image/?model_id=${model_id}`, {
    method: "POST",
    body: form,
    // No need to set headers manually; Fetch will handle it with the native FormData
  });
}
