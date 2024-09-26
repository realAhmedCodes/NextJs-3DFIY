import pool from "@/app/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT u."user_id", u."name", u."location", u."profile_pic", u."phoneNo", u."is_verified", p."cnic_number", p."ratings" 
       FROM "Users" u
       JOIN "Printer_Owners" p ON u."user_id" = p."user_id"
       WHERE u."sellerType" = $1`,
      ["Printer Owner"]
    );

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "Printer owners not found" }),
        {
          status: 404,
        }
      );
    }

    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch printer owners" }),
      { status: 500 }
    );
  }
}
