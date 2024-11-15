

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
