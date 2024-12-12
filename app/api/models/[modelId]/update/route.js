// app/api/models/[modelId]/route.js

import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs/promises";
import { NextResponse } from "next/server";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Define the upload directory
const uploadDir = path.join(process.cwd(), "public", "uploads");

// Ensure the upload directory exists
await fs.mkdir(uploadDir, { recursive: true });

// Helper function to sanitize filenames
function sanitizeFilename(name) {
  return name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
}

export async function PUT(req, { params }) {
  const { modelId } = params;

  console.log("Received modelId:", modelId);

  try {
    // Parse the incoming multipart/form-data
    const formData = await req.formData();

    // Extract fields from the form data
    const category_id = formData.get("category_id")
      ? parseInt(formData.get("category_id"), 10)
      : null;
    const designer_id = formData.get("designer_id")
      ? parseInt(formData.get("designer_id"), 10)
      : null;
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price")
      ? parseFloat(formData.get("price"))
      : null;
    const is_free =
      formData.get("is_free") === "true" || formData.get("is_free") === true;
    const tags = formData.get("tags") ? JSON.parse(formData.get("tags")) : [];
    const model_file = formData.get("modelFile"); // File
    const image = formData.get("image"); // File

    // Log parsed form data for debugging
    console.log("Parsed Form Data:", {
      category_id,
      designer_id,
      name,
      description,
      price,
      is_free,
      tags,
      model_file: model_file ? model_file.name : "No new model file uploaded",
      image: image ? image.name : "No new image uploaded",
    });

    // Validate mandatory fields (adjust as per your requirements)
    if (!category_id || !designer_id || !name || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch existing model from the database
    const existingModel = await prisma.models.findUnique({
      where: { model_id: parseInt(modelId, 10) },
    });

    if (!existingModel) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 });
    }

    // Sanitize the 'name' to ensure filenames are safe
    const sanitizedName = sanitizeFilename(name);

    // Initialize variables for new file paths
    let newModelFileName = existingModel.model_file;
    let newImageFileName = existingModel.image;

    // Handle model file upload (if a new file is provided)
    if (model_file && model_file.name) {
      const allowedModelTypes = ["stl", "obj"];
      const modelFileExt = model_file.name.split(".").pop().toLowerCase();
      if (!allowedModelTypes.includes(modelFileExt)) {
        return NextResponse.json(
          {
            error: "Invalid model file type. Only .stl and .obj are allowed.",
          },
          { status: 400 }
        );
      }

      const timestamp = Date.now();
      newModelFileName = `${sanitizedName}_model_${timestamp}.${modelFileExt}`;
      const modelFilePath = path.join(uploadDir, newModelFileName);
      const modelFileBuffer = Buffer.from(await model_file.arrayBuffer());
      await fs.writeFile(modelFilePath, modelFileBuffer);
      console.log("New model file saved:", modelFilePath);

      // Delete old model file if it exists
      if (existingModel.model_file) {
        const oldModelFilePath = path.join(uploadDir, existingModel.model_file);
        try {
          await fs.unlink(oldModelFilePath);
          console.log("Old model file deleted:", oldModelFilePath);
        } catch (err) {
          console.warn("Failed to delete old model file:", oldModelFilePath);
        }
      }
    }

    // Handle image upload (if a new image is provided)
    if (image && image.name) {
      const allowedImageTypes = ["jpeg", "jpg", "png"];
      const imageExt = image.name.split(".").pop().toLowerCase();
      if (!allowedImageTypes.includes(imageExt)) {
        return NextResponse.json(
          {
            error: "Invalid image file type. Only JPEG and PNG are allowed.",
          },
          { status: 400 }
        );
      }

      const timestamp = Date.now();
      newImageFileName = `${sanitizedName}_image_${timestamp}.${imageExt}`;
      const imageFilePath = path.join(uploadDir, newImageFileName);
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      await fs.writeFile(imageFilePath, imageBuffer);
      console.log("New image file saved:", imageFilePath);

      // Delete old image file if it exists
      if (existingModel.image) {
        const oldImageFilePath = path.join(uploadDir, existingModel.image);
        try {
          await fs.unlink(oldImageFilePath);
          console.log("Old image file deleted:", oldImageFilePath);
        } catch (err) {
          console.warn("Failed to delete old image file:", oldImageFilePath);
        }
      }
    }

    // Update the model in the database
    const updatedModel = await prisma.models.update({
      where: { model_id: parseInt(modelId, 10) },
      data: {
        category_id: category_id || existingModel.category_id,
        designer_id: designer_id || existingModel.designer_id,
        name: name || existingModel.name,
        description: description || existingModel.description,
        price: is_free ? null : price,
        is_free: is_free !== undefined ? is_free : existingModel.is_free,
        tags: tags.length > 0 ? tags : existingModel.tags,
        model_file: newModelFileName,
        image: newImageFileName,
        updatedAt: new Date(),
      },
    });

    console.log("Updated Model:", updatedModel);

    // If a new image was uploaded, send it to FastAPI for embedding
    if (image && image.name) {
      const indexingResponse = await sendImageToFastAPI(
        existingModel.model_id,
        path.join(uploadDir, newImageFileName)
      );

      if (!indexingResponse.ok) {
        const errorData = await indexingResponse.json();
        console.error("Error indexing image:", errorData);
        return NextResponse.json(
          { error: "Failed to index image in Pinecone" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(updatedModel, { status: 200 });
  } catch (error) {
    console.error("Error during model update:", error);
    return NextResponse.json(
      { error: "Failed to update model" },
      { status: 500 }
    );
  }
}

// Helper function to send image to FastAPI
async function sendImageToFastAPI(model_id, imagePath) {
  console.log(
    `Sending image to FastAPI: model_id=${model_id}, imagePath=${imagePath}`
  );
  const form = new FormData();
  const fileBuffer = await fs.readFile(imagePath);
  const mimeTypes = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
  };
  const ext = path.extname(imagePath).substring(1).toLowerCase();
  const mimeType = mimeTypes[ext] || "application/octet-stream";
  const blob = new Blob([fileBuffer], { type: mimeType });
  form.append("file", blob, path.basename(imagePath));

  // Use environment variable for FastAPI URL
  const fastApiUrl = process.env.FASTAPI_URL || "http://localhost:8000";

  return fetch(`${fastApiUrl}/index_image/?model_id=${model_id}`, {
    method: "POST",
    body: form,
    // Do NOT set 'Content-Type' header manually
  });
}
