/*
import pool from "@/app/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT u."user_id", u."name", u."location", u."profile_pic", u."phoneNo", u."is_verified", d."cnic_number", d."ratings"
       FROM "Users" u
       JOIN "Designers" d ON u."user_id" = d."user_id"
       WHERE u."sellerType" = $1`,
      ["Designer"]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Designers not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch designer details" }),
      { status: 500 }
    );
  }
}



*/

/*
import pool from "@/app/lib/db";
export async function GET() {
  try {
    const result = await pool.query(
      `SELECT u."user_id", u."name", u."location", u."profile_pic", u."phoneNo", u."is_verified", d."cnic_number", d."ratings"
       FROM "Users" u
       JOIN "Designers" d ON u."user_id" = d."user_id"
       WHERE u."sellerType" = $1`,
      ["Designer"]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Designers not found" }), {
        status: 404,
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate", // Cache for 60 seconds
        },
      });
    }

    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate", // Cache for 60 seconds
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch designer details" }),
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
        sellerType: "Designer", // Filter by sellerType
      },
      select: {
        user_id: true,
        name: true,
        location: true,
        profile_pic: true,
        phoneNo: true,
        is_verified: true,
        designers: {
          // This should be lowercase "designers"
          select: {
            cnic_number: true,
            ratings: true,
          },
        },
      },
    });

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: "Designers not found" }), {
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
      JSON.stringify({ error: "Failed to fetch designer details" }),
      { status: 500 }
    );
  }
}
