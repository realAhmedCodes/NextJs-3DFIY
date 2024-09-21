import pool from "@/app/lib/db";
export async function GET(req, { params }) {
  const { userId } = params;

  try {
    const result = await pool.query(
      `
      SELECT 
        po.pending_order_id,
        po.status,
        u.name AS printer_owner_name
      FROM 
        "printer_orders" po
      JOIN 
        "Printer_Owners" po_own ON po.printer_owner_id = po_own.printer_owner_id
      JOIN 
        "Users" u ON po_own.user_id = u.user_id
      WHERE 
        po.user_id = $1 AND (po.status=$2 OR po.status=$3)
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
