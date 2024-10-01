/*import pool from "@/app/lib/db";

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
*/




import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Query to fetch designer details
    const result = await prisma.users.findMany({
      where: {
        sellerType: "Printer Owner", // Filter by sellerType
      },
      select: {
        user_id: true,
        name: true,
        location: true,
        profile_pic: true,
        phoneNo: true,
        is_verified: true,
        printer_owners: {
          // This should be lowercase "designers"
          select: {
            cnic_number: true,
            ratings: true,
          },
        },
      },
    });

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: "Printer Owners not found" }), {
        status: 404,
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate", // Cache for 60 seconds
        },
      });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate", // Cache for 60 seconds
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch Printer Owners Data" }),
      { status: 500 }
    );
  }
}
