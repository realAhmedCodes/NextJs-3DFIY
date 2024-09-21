import pool from "@/app/lib/db";
// Designer ke active accepted orders + folder ka name change karna hai
export async function GET(req, { params }) {
  const { sellerId } = params; // Extract the designer_id from the request params

  try {
    const result = await pool.query(
      `
      SELECT 
        mo.order_id, 
        mo.status, 
        mo.created_at,
        u.name AS user_name
      FROM 
        "model_orders" mo
      INNER JOIN 
        "Users" u ON mo.user_id = u.user_id
      WHERE 
        mo.designer_id = $1 AND mo.status=$2 
      ORDER BY 
        mo.created_at DESC
      `,
      [sellerId, "accepted"]
    );

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "No active orders found for this designer" }),
        {
          status: 404,
        }
      );
    }

    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch active orders for designer:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
      status: 500,
    });
  }
}





