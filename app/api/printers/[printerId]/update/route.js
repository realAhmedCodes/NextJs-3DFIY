// /app/api/printers/[printerId]/update/route.js
// /app/api/printers/[printerId]/update/route.js

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
  const { printerId } = params;

  console.log("Received printerId:", printerId);

  try {
    // Parse the incoming multipart/form-data
    const formData = await req.formData();

    // Extract fields from the form data
    const printer_owner_id = formData.get("printer_owner_id")
      ? parseInt(formData.get("printer_owner_id"), 10)
      : null;
    const name = formData.get("name");
    const description = formData.get("description");
    const printerType = formData.get("printerType");
    const materials = formData.get("materials")
      ? JSON.parse(formData.get("materials"))
      : [];
    const location = formData.get("location");
    const price = formData.get("price")
      ? parseFloat(formData.get("price"))
      : null;
    const printVolumeWidth = formData.get("printVolumeWidth")
      ? parseFloat(formData.get("printVolumeWidth"))
      : null;
    const printVolumeDepth = formData.get("printVolumeDepth")
      ? parseFloat(formData.get("printVolumeDepth"))
      : null;
    const printVolumeHeight = formData.get("printVolumeHeight")
      ? parseFloat(formData.get("printVolumeHeight"))
      : null;
    const layerResolutionMin = formData.get("layerResolutionMin")
      ? parseFloat(formData.get("layerResolutionMin"))
      : null;
    const layerResolutionMax = formData.get("layerResolutionMax")
      ? parseFloat(formData.get("layerResolutionMax"))
      : null;
    const printSpeedMax = formData.get("printSpeedMax")
      ? parseFloat(formData.get("printSpeedMax"))
      : null;
    const nozzleDiameter = formData.get("nozzleDiameter")
      ? parseFloat(formData.get("nozzleDiameter"))
      : null;
    const filamentDiameter = formData.get("filamentDiameter")
      ? parseFloat(formData.get("filamentDiameter"))
      : null;
    const image = formData.get("image"); // File

    // Log parsed form data for debugging
    console.log("Parsed Form Data:", {
      printer_owner_id,
      name,
      description,
      printerType,
      materials,
      location,
      price,
      printVolumeWidth,
      printVolumeDepth,
      printVolumeHeight,
      layerResolutionMin,
      layerResolutionMax,
      printSpeedMax,
      nozzleDiameter,
      filamentDiameter,
      image: image ? image.name : "No new image uploaded",
    });

    // Validate mandatory fields (adjust as per your requirements)
    if (
      !printer_owner_id ||
      !name ||
      !description ||
      !printerType ||
      !materials ||
      !location ||
      !price ||
      !printVolumeWidth ||
      !printVolumeDepth ||
      !printVolumeHeight ||
      !layerResolutionMin ||
      !layerResolutionMax ||
      !printSpeedMax ||
      !nozzleDiameter ||
      !filamentDiameter
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch existing printer from the database
    const existingPrinter = await prisma.printers.findUnique({
      where: { printer_id: parseInt(printerId, 10) },
    });

    if (!existingPrinter) {
      return NextResponse.json({ error: "Printer not found" }, { status: 404 });
    }

    // Sanitize the 'name' to ensure filenames are safe
    const sanitizedName = sanitizeFilename(name);

    // Initialize variables for new file paths
    let newImageFilename = existingPrinter.image;

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
      newImageFilename = `${sanitizedName}_image_${timestamp}.${imageExt}`;
      const imageFilePath = path.join(uploadDir, newImageFilename);
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      await fs.writeFile(imageFilePath, imageBuffer);
      console.log("New image file saved:", imageFilePath);

      // Delete old image file if it exists
      if (existingPrinter.image && existingPrinter.image !== "default.png") {
        const oldImagePath = path.join(uploadDir, existingPrinter.image);
        try {
          await fs.unlink(oldImagePath);
          console.log("Old image file deleted:", oldImagePath);
        } catch (err) {
          console.warn("Failed to delete old image file:", oldImagePath);
        }
      }
    }

    // Update printer record using Prisma
    const updatedPrinter = await prisma.printers.update({
      where: { printer_id: parseInt(printerId, 10) },
      data: {
        printer_owner_id: printer_owner_id || existingPrinter.printer_owner_id,
        name: name || existingPrinter.name,
        description: description || existingPrinter.description,
        printer_type: printerType || existingPrinter.printer_type,
        materials: materials.length > 0 ? materials : existingPrinter.materials,
        location: location || existingPrinter.location,
        price: price || existingPrinter.price,
        image: newImageFilename,
        // Technical Specifications
        printVolumeWidth: printVolumeWidth || existingPrinter.printVolumeWidth,
        printVolumeDepth: printVolumeDepth || existingPrinter.printVolumeDepth,
        printVolumeHeight:
          printVolumeHeight || existingPrinter.printVolumeHeight,
        layerResolutionMin:
          layerResolutionMin || existingPrinter.layerResolutionMin,
        layerResolutionMax:
          layerResolutionMax || existingPrinter.layerResolutionMax,
        printSpeedMax: printSpeedMax || existingPrinter.printSpeedMax,
        nozzleDiameter: nozzleDiameter || existingPrinter.nozzleDiameter,
        filamentDiameter: filamentDiameter || existingPrinter.filamentDiameter,
      },
    });

    return NextResponse.json(updatedPrinter, { status: 200 });
  } catch (error) {
    console.error("Error updating printer:", error);
    return NextResponse.json(
      { error: "Failed to update printer" },
      { status: 500 }
    );
  }
}
