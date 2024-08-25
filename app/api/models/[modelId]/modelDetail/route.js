import pool from "@/app/lib/db";

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
