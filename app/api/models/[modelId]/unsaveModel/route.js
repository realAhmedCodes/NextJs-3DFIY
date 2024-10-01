
/*
import pool from "@/app/lib/db";
export async function DELETE(req, { params }) {
  const { modelId } = params;
  const url = new URL(req.url);
  const userId = url.searchParams.get("user_id");

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
    });
  }



  const currentTimestamp = new Date();

  try {
    // Check if the like exists
    const savedResult = await pool.query(
      'SELECT "saved" FROM "SavedModels" WHERE model_id = $1 AND user_id = $2',
      [modelId, userId]
    );

    if (savedResult.rows.length > 0) {
      // Remove the like and decrement like_count
      await pool.query(
        'DELETE FROM "SavedModels" WHERE model_id = $1 AND user_id = $2',
        [modelId, userId]
      );

      

      return new Response(
        JSON.stringify({ message: "Model unsaved successfully" }),
        { status: 200 }
      );
    } else {
      return new Response(JSON.stringify({ message: "No model found" }), {
        status: 404,
      });
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
*/


import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req, { params }) {
  const { modelId } = params;
  const url = new URL(req.url);
  const userId = url.searchParams.get("user_id");

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
    });
  }

  try {
    // Check if the saved model exists
    const savedResult = await prisma.savedModels.findUnique({
      where: {
        model_id_user_id: {
          model_id: parseInt(modelId),
          user_id: parseInt(userId),
        },
      },
    });

    if (savedResult) {
      // Delete the saved model entry
      await prisma.savedModels.delete({
        where: {
          model_id_user_id: {
            model_id: parseInt(modelId),
            user_id: parseInt(userId),
          },
        },
      });

      return new Response(
        JSON.stringify({ message: "Model unsaved successfully" }),
        { status: 200 }
      );
    } else {
      return new Response(JSON.stringify({ message: "No model found" }), {
        status: 404,
      });
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
