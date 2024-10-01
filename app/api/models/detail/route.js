// app/api/models/detail/route.js

// Not using this api
import pool from "@/app/lib/db";

export async function GET({ params }) {
  const { modelId } = params;

  try {
    const result = await pool.query(
      "SELECT * FROM Models WHERE model_id = $1",
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
    return new Response(
      JSON.stringify({ error: "Failed to fetch model details" }),
      { status: 500 }
    );
  }
}
