/*import pool from "@/app/lib/db";

export async function GET(req, { params }) {
  const { modelId } = params;
  console.log(modelId); // For debugging

  try {
    const result = await pool.query(
      `
      SELECT 
        "Users".name AS user_name,
        "Users".location AS user_location,
        "Users".profile_pic AS profile_pic,
        "Models".name AS model_name,
        "Models".description,
        "Models".price,
        "Models".is_Free,
        "Models".tags,
        "Models".image
      FROM 
        "Models"
      JOIN 
        "Designers" ON "Models".designer_id = "Designers".designer_id
      JOIN 
        "Users" ON "Designers".user_id = "Users".user_id
      WHERE 
        "Models".model_id = $1
      `,
      [modelId]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Model not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(result.rows[0]), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch model" }), {
      status: 500,
    });
  }
}
*/

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
