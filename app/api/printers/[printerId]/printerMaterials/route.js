
/*
import pool from "@/app/lib/db";

export async function GET(req, { params }) {
  const { printerId } = params;
  console.log(printerId); // For debugging

  try {
    const result = await pool.query(
      `
      SELECT 
        materials
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
*/

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { printerId } = params;
  console.log(printerId); // For debugging

  try {
    // Fetch the materials of the specific printer by ID
    const printer = await prisma.printers.findUnique({
      where: {
        printer_id: parseInt(printerId, 10), // Convert printerId to integer
      },
      select: {
        materials: true, // Only select the materials field
      },
    });

    if (!printer) {
      return new Response(JSON.stringify({ error: "Printer not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(printer), { status: 200 });
  } catch (error) {
    console.error("Error fetching printer materials:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch printer" }), {
      status: 500,
    });
  }
}
