import pool from "@/app/lib/db";

export async function GET(req, { params }) {
  const { printerId } = params;
  console.log(printerId); // For debugging

  try {
    const result = await pool.query(
      `
      SELECT 
        "Users".name AS user_name,
        "Users".location AS user_location,
        "Users".profile_pic AS profile_pic,
        "printers".name AS printer_name,
        "printers".description,
        "printers".price,
        "printers".image,
        "printers".materials
      FROM 
        "printers"
      JOIN 
        "Printer_Owners" ON "printers".printer_owner_id = "Printer_Owners".printer_owner_id
      JOIN 
        "Users" ON "Printer_Owners".user_id = "Users".user_id
      WHERE 
        "printers".printer_id = $1
      `,
      [printerId]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Printer not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(result.rows[0]), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch printer" }), {
      status: 500,
    });
  }
}
