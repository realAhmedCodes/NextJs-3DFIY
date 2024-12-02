import { NextRequest, NextResponse } from 'next/server'
import pool from "@/app/lib/db";

export interface ChatRoom {
  room_id: string;
  other_user_id: string;
  user_name: string;
  user_pic: string;
  message: string;
  createdAt: Date;
}

export async function GET(
  request: NextRequest, 
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  // Validate userId
  if (!userId) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `SELECT DISTINCT ON (room_id) room_id,
              CASE
                WHEN sender_id != $1 THEN sender_id
                ELSE receiver_id
              END AS other_user_id,
              (SELECT name FROM "Users" WHERE user_id = CASE WHEN sender_id != $1 THEN sender_id ELSE receiver_id END) as user_name,
              (SELECT profile_pic FROM "Users" WHERE user_id = CASE WHEN sender_id != $1 THEN sender_id ELSE receiver_id END) as user_pic,
              message, createdAt
       FROM "Chats"
       WHERE sender_id = $1 OR receiver_id = $1
       ORDER BY room_id, createdAt DESC`,
      [userId]
    );
   
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Optional: Add dynamic routing configuration
export const dynamic = 'force-dynamic'