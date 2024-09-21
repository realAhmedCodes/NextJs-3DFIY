import pool from "@/app/lib/db";

export async function GET(req, { params }) {
  const { printerId } = params;
  console.log(printerId); // For debugging

  try {
    const result = await pool.query(
      `
      SELECT 
        printer_owner_id
      FROM 
        "printers"
      
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
