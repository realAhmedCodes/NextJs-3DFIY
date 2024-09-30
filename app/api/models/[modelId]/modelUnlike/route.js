/*import pool from "@/app/lib/db";
export async function DELETE(req, { params }) {
  const { modelId } = params;
  const url = new URL(req.url);
  const userId = url.searchParams.get('user_id');

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
    });
  }

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
    });
  }

  const currentTimestamp = new Date();

  try {
    // Check if the like exists
    const likeResult = await pool.query(
      'SELECT "liked" FROM "Likes" WHERE model_id = $1 AND user_id = $2',
      [modelId, userId]
    );

    if (likeResult.rows.length > 0) {
      // Remove the like and decrement like_count
      await pool.query(
        'DELETE FROM "Likes" WHERE model_id = $1 AND user_id = $2',
        [modelId, userId]
      );

      await pool.query(
        'UPDATE "Models" SET likes_count = likes_count - 1 WHERE model_id = $1',
        [modelId]
      );

      return new Response(
        JSON.stringify({ message: "Model unliked successfully" }),
        { status: 200 }
      );
    } else {
      return new Response(JSON.stringify({ message: "No like found" }), {
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
    // Check if the like exists
    const like = await prisma.likes.findUnique({
      where: {
        model_id_user_id: {
          model_id: parseInt(modelId),
          user_id: parseInt(userId),
        },
      },
    });

    if (like) {
      // Delete the like record
      await prisma.likes.delete({
        where: {
          model_id_user_id: {
            model_id: parseInt(modelId),
            user_id: parseInt(userId),
          },
        },
      });

      // Decrement the like_count in the Models table
      await prisma.models.update({
        where: { model_id: parseInt(modelId) },
        data: { likes_count: { decrement: 1 } },
      });

      return new Response(
        JSON.stringify({ message: "Model unliked successfully" }),
        { status: 200 }
      );
    } else {
      return new Response(JSON.stringify({ message: "No like found" }), {
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
