// app/api/models/[modelId]/route.js

/*
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { modelId } = params;
  console.log(modelId); // For debugging

  try {
    // Fetch the model along with the designer and user details using Prisma
    const model = await prisma.models.findUnique({
      where: {
        model_id: parseInt(modelId, 10),
      },
      include: {
        Designers: {
          include: {
            Users: true, // Include user details from Designers relation
          },
        },
      },
    });

    // Check if the model is not found
    if (!model) {
      return new Response(JSON.stringify({ error: "Model not found" }), {
        status: 404,
      });
    }

    // Extract relevant data to match the expected response structure
    const responseData = {
      user_name: model.Designers.Users.name,
      user_location: model.Designers.Users.location,
      model_id: model.model_id,
      profile_pic: model.Designers.Users.profile_pic,
      model_name: model.name,
      description: model.description,
      price: model.price,
      is_Free: model.is_free,
      tags: model.tags,
      image: model.image,
    };

    // Return the extracted data as a JSON response
    return new Response(JSON.stringify(responseData), { status: 200 });
  } catch (error) {
    console.error("Error fetching model details:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch model" }), {
      status: 500,
    });
  }
}

*/

// app/api/models/[modelId]/route.js

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { modelId } = params;
  console.log(`Fetching model with ID: ${modelId}`); // For debugging

  try {
    const parsedModelId = parseInt(modelId, 10);
    if (isNaN(parsedModelId)) {
      return NextResponse.json(
        { error: "Invalid model ID format" },
        { status: 400 }
      );
    }

    // 1. Try to fetch from 'models' table (Designer Models)
    const designerModel = await prisma.models.findUnique({
      where: {
        model_id: parsedModelId,
      },
      include: {
        Designers: {
          include: {
            Users: true, // Include user details from Designers relation
          },
        },
      },
    });

    if (designerModel) {
      // Extract relevant data for designer model
      const responseData = {
        type: "designer", // Indicator for model type
        model_id: designerModel.model_id,
        model_name: designerModel.name,
        description: designerModel.description,
        price: designerModel.price,
        is_free: designerModel.is_free,
        tags: designerModel.tags,
        image_url: designerModel.image
          ? `/uploads/${designerModel.image}` // Relative path
          : null,
        user: {
          name: designerModel.Designers.Users.name,
          location: designerModel.Designers.Users.location,
          profile_pic: designerModel.Designers.Users.profile_pic
            ? `${designerModel.Designers.Users.profile_pic}` // Relative path
            : null,
        },
        downloadLink: null, // Designer models do not have external download links
      };

      return NextResponse.json(responseData, { status: 200 });
    }

    // 2. If not found in 'models', try to fetch from 'scraped_models' table
    const scrapedModel = await prisma.scraped_models.findUnique({
      where: {
        id: parsedModelId,
      },
    });

    if (scrapedModel) {
      // Extract relevant data for scraped model
      const responseData = {
        type: "scraped", // Indicator for model type
        model_id: scrapedModel.id,
        model_name: scrapedModel.name,
        description: scrapedModel.description,
        price: scrapedModel.price || 0,
        is_free: scrapedModel.price === 0,
        tags: scrapedModel.tags ? scrapedModel.tags.split(",") : [], // Split tags into an array
        image_url: scrapedModel.image_url, // Absolute external URL
        user: null, // No associated user for scraped models
        downloadLink: scrapedModel.download_link,
        specifications: scrapedModel.specifications || "Not available", // New field
        formats: scrapedModel.formats || "Not available", // New field
      };

      return NextResponse.json(responseData, { status: 200 });
    }

    // 3. If not found in either table, return 404
    return NextResponse.json({ error: "Model not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching model details:", error);
    return NextResponse.json(
      { error: "Failed to fetch model details" },
      { status: 500 }
    );
  }
}
