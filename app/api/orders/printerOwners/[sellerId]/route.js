import pool from "@/app/lib/db";

export async function GET(req, { params }) {
  const { sellerId } = params; // Extract the printer_owner_id from the request params

  try {
    const result = await pool.query(
      `
      SELECT 
        po.pending_order_id, 
        po.status, 
        po.created_at,
        u.name AS user_name
      FROM 
        "printer_orders" po
      INNER JOIN 
        "Users" u ON po.user_id = u.user_id
      WHERE 
        po.printer_owner_id = $1 AND (po.status=$2 OR po.status=$3)
      ORDER BY 
        po.created_at DESC
      `,
      [sellerId, "pending", "denied"]
    );

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "No orders found for this printer owner" }),
        {
          status: 404,
        }
      );
    }

    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch orders for printer owner:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
      status: 500,
    });
  }
}
