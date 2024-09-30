
/*
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
*/

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { printerId } = params;
  console.log(printerId); // For debugging

  try {
    // Fetch printer details with related user and printer owner details
    const printer = await prisma.printers.findUnique({
      where: {
        printer_id: parseInt(printerId, 10), // Convert printerId to integer
      },
      select: {
        name: true, // Printer details
        description: true,
        price: true,
        image: true,
        materials: true,
        Printer_Owners: {
          select: {
            Users: {
              // User details related to the printer owner
              select: {
                name: true,
                location: true,
                profile_pic: true,
              },
            },
          },
        },
      },
    });

    if (!printer) {
      return new Response(JSON.stringify({ error: "Printer not found" }), {
        status: 404,
      });
    }

    // Structure the response to match the original SQL query result
    const response = {
      user_name: printer.Printer_Owners.Users.name,
      user_location: printer.Printer_Owners.Users.location,
      profile_pic: printer.Printer_Owners.Users.profile_pic,
      printer_name: printer.name,
      description: printer.description,
      price: printer.price,
      image: printer.image,
      materials: printer.materials,
    };

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("Error fetching printer details:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch printer" }), {
      status: 500,
    });
  }
}
