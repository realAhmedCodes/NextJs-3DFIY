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


require("dotenv").config({ path: ".env.local" }); // Load environment variables from .env.local

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
   try {
     // Insert the message into the database
     await pool.query(
       'INSERT INTO "Chats" (room_id, sender_id, receiver_id, message, createdAt) VALUES ($1, $2, $3, $4, $5)',
       [data.room, data.sender_id, data.receiver_id, data.message, data.time]
     );

     // Emit to everyone in the room except the sender
     socket.to(data.room).emit("receive_message", data);

     // Emit an event to update the chat list for everyone
     io.emit("update_chat_list");
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