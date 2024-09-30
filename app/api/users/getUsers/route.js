// app/api/models/detail/route.js
/*import pool from "@/app/lib/db";

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM "Users"');
    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Users not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch users details" }),
      { status: 500 }
    );
  }
}
*/

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all users using Prisma
    const users = await prisma.users.findMany();

    if (users.length === 0) {
      return new Response(JSON.stringify({ error: "Users not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch users details" }),
      { status: 500 }
    );
  }
}
