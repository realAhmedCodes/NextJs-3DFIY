/*require("dotenv").config({ path: ".env.local" }); // Load environment variables from .env.local

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { Pool } = require("pg");

// Create a new pool using the environment variables
const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const app = express();
const server = http.createServer(app);

// CORS setup for Express
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// CORS setup for Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", async (room) => {
    socket.join(room);
    try {
      const result = await pool.query(
        'SELECT * FROM "Chats" WHERE room_id = $1 ORDER BY createdAt ASC',
        [room]
      );
      socket.emit("previous_messages", result.rows);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  });
socket.on("send_message", async (data) => {
  const currentTime = new Date(); // Get the current time

  try {
    await pool.query(
      'INSERT INTO "Chats" (room_id, sender_id, receiver_id, message, createdat) VALUES ($1, $2, $3, $4, $5)',
      [data.room, data.sender_id, data.receiver_id, data.message, currentTime]
    );
    socket
      .to(data.room)
      .emit("receive_message", { ...data, createdat: currentTime });
  } catch (error) {
    console.error("Error sending message:", error);
  }
});


  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
*/


/*

*/


require("dotenv").config(); // Load environment variables from .env

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { Pool } = require("pg");

// Use the DATABASE_URL from the .env file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false, // Use SSL in production
});

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

// CORS setup for Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.API_URL, // Use the frontend URL from the environment
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Handle joining a room and fetching previous messages
  socket.on("join_room", async (room) => {
    socket.join(room);
    try {
      const result = await pool.query(
        'SELECT * FROM "Chats" WHERE room_id = $1 ORDER BY createdat ASC',
        [room]
      );
      socket.emit("previous_messages", result.rows);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  });

  // Handle sending a message
socket.on("send_message", async (data) => {
  console.log("Sender ID:", data.sender_id);
  console.log("Receiver ID:", data.receiver_id);
  console.log("Room ID:", data.room);

  try {
    // Existing checks for sender and receiver
    const senderCheck = await pool.query(
      'SELECT user_id FROM "Users" WHERE user_id = $1',
      [data.sender_id]
    );
    const receiverCheck = await pool.query(
      'SELECT user_id FROM "Users" WHERE user_id = $1',
      [data.receiver_id]
    );

    // If either sender or receiver does not exist, log an error
    if (senderCheck.rows.length === 0) {
      console.log("Sender does not exist:", data.sender_id);
      return socket.emit("error_message", { error: "Sender does not exist" });
    }
    if (receiverCheck.rows.length === 0) {
      console.log("Receiver does not exist:", data.receiver_id);
      return socket.emit("error_message", { error: "Receiver does not exist" });
    }

    // Insert message into the database
    await pool.query(
      'INSERT INTO "Chats" (room_id, sender_id, receiver_id, message, createdat) VALUES ($1, $2, $3, $4, $5)',
      [data.room, data.sender_id, data.receiver_id, data.message, data.time]
    );

    socket.to(data.room).emit("receive_message", data);
    io.emit("update_chat_list");
  } catch (error) {
    console.error("Error sending message:", error);
    socket.emit("error_message", { error: "Failed to send message" });
  }
});


  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
