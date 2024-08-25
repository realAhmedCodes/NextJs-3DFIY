import pool from "@/app/lib/db";

export async function POST(req, { params }) {
  const { modelId } = params;
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
    });
  }

  const userId = body.user_id;
  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
    });
  }

  const currentTimestamp = new Date();
  try {
    // Check if the like already exists
    const likeResult = await pool.query(
      'SELECT "liked" FROM "Likes" WHERE model_id = $1 AND user_id = $2',
      [modelId, userId]
    );

    if (likeResult.rows.length === 0) {
      // Create a new like if it doesn't exist
      await pool.query(
        'INSERT INTO "Likes" (model_id, user_id, liked, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5)',
        [modelId, userId, true, currentTimestamp, currentTimestamp]
      );

      // Increment the like_count in the Models table
      await pool.query(
        'UPDATE "Models" SET likes_count = likes_count + 1 WHERE model_id = $1',
        [modelId]
      );
    } else {
      const likeStatus = likeResult.rows[0].liked;
      if (!likeStatus) {
        // Update like status
        await pool.query(
          'UPDATE "Likes" SET liked = $1, "updatedAt" = $2 WHERE model_id = $3 AND user_id = $4',
          [true, currentTimestamp, modelId, userId]
        );

        // Increment the like_count in the Models table
        await pool.query(
          'UPDATE "Models" SET likes_count = likes_count + 1 WHERE model_id = $1',
          [modelId]
        );
      } else {
        return new Response(
          JSON.stringify({ message: "Model can't be liked" }),
          { status: 200 }
        );
      }
    }

    return new Response(
      JSON.stringify({ message: "Model liked successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}



export async function GET(req, { params }) {
  const { modelId } = params;
  const url = new URL(req.url);
  const userId = url.searchParams.get("user_id");

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
    });
  }

  try {
    const likeResult = await pool.query(
      'SELECT liked FROM "Likes" WHERE model_id = $1 AND user_id = $2',
      [modelId, userId]
    );

    if (likeResult.rows.length > 0) {
      return new Response(JSON.stringify({ liked: likeResult.rows[0].liked }), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ liked: false }), { status: 200 });
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
