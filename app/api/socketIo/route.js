/*import { Server } from "socket.io";
import pool from "@/app/lib/db";

export default function handler(req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("join_room", async (room) => {
        socket.join(room);
        const result = await pool.query(
          'SELECT * FROM "Chats" WHERE room_id = $1 ORDER BY createdAt ASC',
          [room]
        );
        socket.emit("previous_messages", result.rows);
      });

      socket.on("send_message", async (data) => {
        await pool.query(
          'INSERT INTO "Chats" (room_id, sender_id, receiver_id, message, createdAt) VALUES ($1, $2, $3, $4, $5)',
          [data.room, data.sender_id, data.receiver_id, data.message, data.time]
        );
        socket.to(data.room).emit("receive_message", data);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    console.log("Socket.io server initialized");
  }
  res.end();
}
*/

import { Server } from "socket.io";
import pool from "@/app/lib/db";

export default function handler(req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("join_room", async (room) => {
        socket.join(room);
        const result = await pool.query(
          'SELECT * FROM "Chats" WHERE room_id = $1 ORDER BY createdAt ASC',
          [room]
        );
        socket.emit("previous_messages", result.rows);
      });

      socket.on("send_message", async (data) => {
        await pool.query(
          'INSERT INTO "Chats" (room_id, sender_id, receiver_id, message, createdAt) VALUES ($1, $2, $3, $4, $5)',
          [data.room, data.sender_id, data.receiver_id, data.message, data.time]
        );
        socket.to(data.room).emit("receive_message", data);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    console.log("Socket.io server initialized");
  }
  res.end();
}