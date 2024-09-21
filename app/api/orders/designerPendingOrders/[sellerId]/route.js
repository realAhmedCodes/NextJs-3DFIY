import pool from "@/app/lib/db";
// seller ke pending orders
export async function GET(req, { params }) {
  const { sellerId } = params; // Extract the designer_id from the request params
console.log(sellerId)
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
        mo.designer_id = $1 AND (mo.status=$2 OR mo.status=$3)
      ORDER BY 
        mo.created_at DESC
      `,
      [sellerId, "pending", "denied"]
    );

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "No orders found for this designer" }),
        {
          status: 404,
        }
      );
    }

    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch orders for designer:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
      status: 500,
    });
  }
}
