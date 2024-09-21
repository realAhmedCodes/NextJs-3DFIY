import pool from "@/app/lib/db";

export async function GET(req, { params }) {
  const { orderId } = params;

  try {
    const result = await pool.query(
      `
      SELECT 
        po.*, 
        u.name as user_name
      FROM 
        "printer_orders" po
      JOIN 
        "Users" u 
      ON 
        po.user_id = u.user_id
      WHERE 
        po.pending_order_id = $1
      `,
      [orderId]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(result.rows[0]), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch order" }), {
      status: 500,
    });
  }
}
