import pool from "@/app/lib/db";
// user ke pending orders
export async function GET(req, { params }) {
  const { userId } = params;

  try {
    const result = await pool.query(
      `
      SELECT 
        mo.order_id AS pending_order_id,
        mo.status,
        u.name AS designer_name
      FROM 
        "model_orders" mo
      JOIN 
        "Designers" d ON mo.designer_id = d.designer_id
      JOIN 
        "Users" u ON d.user_id = u.user_id
      WHERE 
        mo.user_id = $1 AND (mo.status = $2 OR mo.status = $3)
      `,
      [userId, "denied", "pending"]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "No orders found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
      status: 500,
    });
  }
}
