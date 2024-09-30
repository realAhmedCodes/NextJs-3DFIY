
/*
import pool from "@/app/lib/db";

export async function GET(request, { params }) {
  const userId = parseInt(params.userId);

  try {
    const chatListQuery = `
      WITH LastMessage AS (
  SELECT
    room_id,
    MAX(createdat) AS last_message_time
  FROM
    "Chats"
  WHERE
    sender_id = $1 OR receiver_id = $1
  GROUP BY
    room_id
)
SELECT
  c.room_id,
  c.message AS last_message,
  c.createdat AS last_message_time,
  CASE
    WHEN c.sender_id = $1 THEN c.receiver_id
    ELSE c.sender_id
  END AS other_user_id,
  u.name AS other_user_name
FROM
  "Chats" c
JOIN
  LastMessage lm ON c.room_id = lm.room_id AND c.createdat = lm.last_message_time
JOIN
  "Users" u ON u.user_id = CASE
                            WHEN c.sender_id = $1 THEN c.receiver_id
                            ELSE c.sender_id
                          END
ORDER BY
  c.createdat DESC;

    `;

    const { rows } = await pool.query(chatListQuery, [userId]);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "No chat history found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch chat list" }),
      { status: 500 }
    );
  }
}
*/


import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const userId = parseInt(params.userId);

  try {
    // Fetch the last message for each room where the user is involved
    const chatList = await prisma.$queryRaw`
      WITH LastMessage AS (
        SELECT
          room_id,
          MAX(createdat) AS last_message_time
        FROM
          "Chats"
        WHERE
          sender_id = ${userId} OR receiver_id = ${userId}
        GROUP BY
          room_id
      )
      SELECT
        c.room_id,
        c.message AS last_message,
        c.createdat AS last_message_time,
        CASE
          WHEN c.sender_id = ${userId} THEN c.receiver_id
          ELSE c.sender_id
        END AS other_user_id,
        u.name AS other_user_name
      FROM
        "Chats" c
      JOIN
        LastMessage lm ON c.room_id = lm.room_id AND c.createdat = lm.last_message_time
      JOIN
        "Users" u ON u.user_id = CASE
                                  WHEN c.sender_id = ${userId} THEN c.receiver_id
                                  ELSE c.sender_id
                                END
      ORDER BY
        c.createdat DESC;
    `;

    if (chatList.length === 0) {
      return new Response(JSON.stringify({ error: "No chat history found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(chatList), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch chat list:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch chat list" }),
      { status: 500 }
    );
  }
}
