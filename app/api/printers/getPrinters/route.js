// app/api/models/detail/route.js
/*import pool from "@/app/lib/db";

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM "printers"');
    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Printers not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch Printers" }),
      { status: 500 }
    );
  }
}
*/


import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all printers using Prisma
    const printers = await prisma.printers.findMany();

    if (printers.length === 0) {
      return new Response(JSON.stringify({ error: "Printers not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(printers), { status: 200 });
  } catch (error) {
    console.error("Error fetching printers:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch Printers" }), {
      status: 500,
    });
  }
}
