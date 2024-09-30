/*
import pool from "@/app/lib/db";

export async function POST(req,{params}){
    const {modelId}= params
    let body;
    try{
        body= await req.json()

    }
    catch(error){
        return new Response(JSON.stringify({error:"Invalid request body"}),{
            status:400
        })
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
    const saveResult = await pool.query(
      'SELECT "saved" FROM "SavedModels" WHERE model_id = $1 AND user_id = $2',
      [modelId, userId]
    );

    if (saveResult.rows.length === 0) {
      // Create a new like if it doesn't exist
      await pool.query(
        'INSERT INTO "SavedModels" (model_id, user_id, saved, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5)',
        [modelId, userId, true, currentTimestamp, currentTimestamp]
      );

     
    } else {
      const savedStatus = saveResult.rows[0].saved;
      if (!savedStatus) {
        
        await pool.query(
          'UPDATE "SavedModels" SET saved = $1, "updatedAt" = $2 WHERE model_id = $3 AND user_id = $4',
          [true, currentTimestamp, modelId, userId]
        );

        // Increment the like_count in the Models table
       
      } else {
        return new Response(
          JSON.stringify({ message: "Model can't be saved" }),
          { status: 200 }
        );
      }
    }

    return new Response(
      JSON.stringify({ message: "Model saved successfully" }),
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
    const savedResult = await pool.query(
      'SELECT saved FROM "SavedModels" WHERE model_id = $1 AND user_id = $2',
      [modelId, userId]
    );

    if (savedResult.rows.length > 0) {
      return new Response(JSON.stringify({ saved: savedResult.rows[0].saved }), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ saved: false }), { status: 200 });
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
    // Check if the model is already saved using the compound key
    const saveResult = await prisma.savedModels.findUnique({
      where: {
        model_id_user_id: {
          model_id: parseInt(modelId),
          user_id: parseInt(userId),
        },
      },
    });

    if (!saveResult) {
      // If the model is not saved, create a new saved record
      await prisma.savedModels.create({
        data: {
          model_id: parseInt(modelId),
          user_id: parseInt(userId),
          saved: true,
          createdAt: currentTimestamp,
          updatedAt: currentTimestamp,
        },
      });

      return new Response(
        JSON.stringify({ message: "Model saved successfully" }),
        { status: 200 }
      );
    } else if (!saveResult.saved) {
      // If the model was previously unsaved, update it
      await prisma.savedModels.update({
        where: {
          model_id_user_id: {
            model_id: parseInt(modelId),
            user_id: parseInt(userId),
          },
        },
        data: {
          saved: true,
          updatedAt: currentTimestamp,
        },
      });

      return new Response(
        JSON.stringify({ message: "Model saved successfully" }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ message: "Model is already saved" }),
        { status: 200 }
      );
    }
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
    const savedResult = await prisma.savedModels.findUnique({
      where: {
        model_id_user_id: {
          model_id: parseInt(modelId),
          user_id: parseInt(userId),
        },
      },
    });

    if (savedResult) {
      return new Response(JSON.stringify({ saved: savedResult.saved }), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ saved: false }), { status: 200 });
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
