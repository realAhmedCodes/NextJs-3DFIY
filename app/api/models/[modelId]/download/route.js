import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { modelId } = params;
  const userId = request.headers.get('user-id');  // Get user ID from the request headers
  
  console.log(`Checking if user ${userId} has purchased model ${modelId}`);

  try {
    // Validate modelId
    const parsedModelId = parseInt(modelId, 10);
    if (isNaN(parsedModelId)) {
      return NextResponse.json({ error: "Invalid model ID format" }, { status: 400 });
    }

    // 1. Check if the user has purchased the model from the 'model_purchase' table
    const purchase = await prisma.model_purchase.findUnique({
      where: {
        user_id_model_id: {
          user_id: parseInt(userId),  // Use the authenticated user's ID
          model_id: parsedModelId,
        },
      },
    });

    if (!purchase) {
      return NextResponse.json({ error: "User has not purchased this model" }, { status: 403 });
    }

    // 2. Retrieve the model file path from the 'models' table
    const model = await prisma.models.findUnique({
      where: { model_id: parsedModelId },
    });

    if (!model || !model.model_file) {
      return NextResponse.json({ error: "Model file not found" }, { status: 404 });
    }

    // 3. Generate the full file path securely (avoid exposing the path directly to the client)
    const filePath = path.resolve('./public/uploads/', model.model_file);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found on the server" }, { status: 404 });
    }

    // 4. Serve the file with proper headers
    const file = fs.createReadStream(filePath);
    const fileName = path.basename(filePath);

    return new NextResponse(file, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });

  } catch (error) {
    console.error("Error downloading model:", error);
    return NextResponse.json({ error: "Failed to process the request" }, { status: 500 });
  }
}
