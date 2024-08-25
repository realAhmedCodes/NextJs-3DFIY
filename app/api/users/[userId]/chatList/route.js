import pool from "@/app/lib/db";

export default async function handler(req, res) {
  const { userId } = req.query;
console.log(userId)
  if (req.method === "GET") {
    try {
      // Query to get distinct chat rooms and the last message in each
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

      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
