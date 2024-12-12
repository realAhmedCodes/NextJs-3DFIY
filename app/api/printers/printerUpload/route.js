// /app/api/printers/printerUpload/route.js
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

    // Parse technical specifications
    const printVolumeWidth = parseFloat(form.get("printVolumeWidth"));
    const printVolumeDepth = parseFloat(form.get("printVolumeDepth"));
    const printVolumeHeight = parseFloat(form.get("printVolumeHeight"));
    const layerResolutionMin = parseFloat(form.get("layerResolutionMin"));
    const layerResolutionMax = parseFloat(form.get("layerResolutionMax"));
    const printSpeedMax = parseFloat(form.get("printSpeedMax"));
    const nozzleDiameter = parseFloat(form.get("nozzleDiameter"));
    const filamentDiameter = parseFloat(form.get("filamentDiameter"));

    // Check for missing required fields
    if (
      !printer_owner_id ||
      !name ||
      !printerType ||
      !materials.length ||
      !colors.length ||
      !services.length ||
      !image ||
      isNaN(printVolumeWidth) ||
      isNaN(printVolumeDepth) ||
      isNaN(printVolumeHeight) ||
      isNaN(layerResolutionMin) ||
      isNaN(layerResolutionMax) ||
      isNaN(printSpeedMax) ||
      isNaN(nozzleDiameter) ||
      isNaN(filamentDiameter)
    ) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid required fields" }),
        {
          status: 400,
        }
      );
    }

    // Optional: Server-side validation (ensure values are positive)
    if (
      printVolumeWidth <= 0 ||
      printVolumeDepth <= 0 ||
      printVolumeHeight <= 0 ||
      layerResolutionMin <= 0 ||
      layerResolutionMax <= 0 ||
      printSpeedMax <= 0 ||
      nozzleDiameter <= 0 ||
      filamentDiameter <= 0 ||
      layerResolutionMin > layerResolutionMax
    ) {
      return new Response(
        JSON.stringify({
          error: "Invalid values for technical specifications",
        }),
        {
          status: 400,
        }
      );
    }

    // Handle image upload
    const imageExtension = image.name.split(".").pop();
    const imageFilename = `${name}_image_${Date.now()}.${imageExtension}`;
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
        // Technical Specifications as Numbers
        printVolumeWidth: printVolumeWidth,
        printVolumeDepth: printVolumeDepth,
        printVolumeHeight: printVolumeHeight,
        layerResolutionMin: layerResolutionMin,
        layerResolutionMax: layerResolutionMax,
        printSpeedMax: printSpeedMax,
        nozzleDiameter: nozzleDiameter,
        filamentDiameter: filamentDiameter,
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
