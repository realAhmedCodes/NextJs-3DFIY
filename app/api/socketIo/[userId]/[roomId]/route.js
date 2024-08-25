import pool from "@/app/lib/db";

export async function GET(request, { params }) {
  const { userId, roomId } = params;

  try {
    const chatHistoryQuery = `
      SELECT * FROM "Chats"
      WHERE room_id = $1
      ORDER BY createdat ASC;
    `;

    const { rows } = await pool.query(chatHistoryQuery, [roomId]);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "No chat history found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch chat history" }),
      { status: 500 }
    );
  }
}
