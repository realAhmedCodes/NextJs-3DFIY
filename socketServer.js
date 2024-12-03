// socketServer.js
require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { Pool } = require("pg");
const axios = require("axios");

// Initialize PostgreSQL Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false, // Use SSL in production
});

// Initialize Express App
const app = express();
const server = http.createServer(app);

// CORS setup for Express
app.use(
  cors({
    origin: process.env.API_URL, // Use the frontend URL from the environment
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Middleware to parse JSON
app.use(express.json());

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.API_URL, // Use the frontend URL from the environment
    methods: ["GET", "POST"],
  },
});

// Handle Socket.io Connections
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Handle joining a chat room
  socket.on("join_room", async (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);

    // Fetch previous messages
    try {
      const result = await pool.query(
        'SELECT * FROM "Chats" WHERE room_id = $1 ORDER BY createdat ASC',
        [room]
      );
      socket.emit("previous_messages", result.rows);
    } catch (error) {
      console.error("Error fetching messages:", error);
      socket.emit("error_message", {
        error: "Failed to fetch previous messages.",
      });
    }
  });

  // Handle leaving a chat room
  socket.on("leave_room", (room) => {
    socket.leave(room);
    console.log(`Socket ${socket.id} left room ${room}`);
  });

  // Handle sending a chat message
  socket.on("send_message", async (data) => {
    const { sender_id, receiver_id, room, message, time } = data;
    console.log("Sender ID:", sender_id);
    console.log("Receiver ID:", receiver_id);
    console.log("Room ID:", room);

    try {
      // Validate sender and receiver
      const senderCheck = await pool.query(
        'SELECT user_id FROM "Users" WHERE user_id = $1',
        [sender_id]
      );
      const receiverCheck = await pool.query(
        'SELECT user_id FROM "Users" WHERE user_id = $1',
        [receiver_id]
      );

      if (senderCheck.rows.length === 0) {
        console.log("Sender does not exist:", sender_id);
        return socket.emit("error_message", {
          error: "Sender does not exist.",
        });
      }
      if (receiverCheck.rows.length === 0) {
        console.log("Receiver does not exist:", receiver_id);
        return socket.emit("error_message", {
          error: "Receiver does not exist.",
        });
      }

      // Insert message into the database
      await pool.query(
        'INSERT INTO "Chats" (room_id, sender_id, receiver_id, message, createdat) VALUES ($1, $2, $3, $4, $5)',
        [room, sender_id, receiver_id, message, time]
      );

      // Emit the message to the room
      socket.to(room).emit("receive_message", data);

      // Optionally, emit an update to all clients
      io.emit("update_chat_list");
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error_message", { error: "Failed to send message." });
    }
  });

  // Handle notifications (optional, if needed here)
  // Notifications are handled via the /notify endpoint below

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Notification Endpoint
app.post("/notify", async (req, res) => {
  const { recipientId, notification } = req.body;
  console.log("Received notification data:", recipientId, notification);

  if (!recipientId || !notification) {
    return res.status(400).json({ message: "Invalid notification data." });
  }

  try {
    // Emit the notification to the recipient's room
    io.to(`user_${recipientId}`).emit("notification", notification);
    res.status(200).json({ message: "Notification emitted successfully." });
  } catch (error) {
    console.error("Error emitting notification:", error);
    res.status(500).json({ message: "Failed to emit notification." });
  }
});

// Start the Server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
