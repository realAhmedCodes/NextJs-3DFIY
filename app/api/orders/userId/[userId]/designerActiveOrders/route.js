import pool from "@/app/lib/db";
// model user ke accpted orders
export async function GET(req, { params }) {
  const { userId } = params; // Extract the user_id from the request params

  try {
    const result = await pool.query(
      `
      SELECT 
        mo.order_id, 
        mo.status, 
        u.name AS designer_name
      FROM 
        "model_orders" mo
      JOIN 
        "Designers" d ON mo.designer_id = d.designer_id
      JOIN 
        "Users" u ON d.user_id = u.user_id
      WHERE 
        mo.user_id = $1 AND mo.status = $2
      `,
      [userId, "accepted"]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "No active orders found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch active orders for user:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
      status: 500,
    });
  }
}
