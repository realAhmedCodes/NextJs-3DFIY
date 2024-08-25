// app/api/models/detail/route.js
import pool from "@/app/lib/db";

export async function GET() {
  

  try {
    const result = await pool.query(
      'SELECT * FROM "Models"',
     
    );
    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Models not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(result.rows), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch model details" }),
      { status: 500 }
    );
  }
}
