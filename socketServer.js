/*
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
*/

// socketServer.js
/*
require("dotenv").config(); // Load environment variables from .env

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { Pool } = require("pg");

// Initialize PostgreSQL Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false, // Use SSL in production
});

const app = express();
const server = http.createServer(app);

// Middleware
app.use(
  cors({
    origin: process.env.API_URL, // Use the frontend URL from the environment
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json()); // To parse JSON bodies

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

  // Handle joining rooms
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Notification Endpoint
app.post("/notify", async (req, res) => {
  const { recipientId, notification } = req.body;
console.log(recipientId, notification);
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
*/

// socketServer.js
// socketServer.js

// socketServer.js
// socketServer.js

require("dotenv").config(); // Load environment variables from .env

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(
  cors({
    origin: process.env.API_URL, // Frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"], // Adjust if using API keys
  })
);
app.use(express.json()); // To parse JSON bodies

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.API_URL, // Frontend URL
    methods: ["GET", "POST"],
  },
});

// Handle Socket.io Connections
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Handle joining rooms
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  // Handle leaving rooms (optional)
  socket.on("leave_room", (room) => {
    socket.leave(room);
    console.log(`Socket ${socket.id} left room ${room}`);
  });

  // Handle disconnections
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




/*generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Category {
  category_id        Int        @id @default(autoincrement())
  parent_category_id Int?
  name               String     @db.VarChar(50)
  createdAt          DateTime   @default(now()) @db.Timestamptz(6)
  updatedAt          DateTime   @updatedAt @db.Timestamptz(6)
  parentCategory     Category?  @relation("CategoryParent", fields: [parent_category_id], references: [category_id])
  childCategories    Category[] @relation("CategoryParent")
  models             Models[]
}

model Models {
  model_id        Int              @id @default(autoincrement())
  category_id     Int
  designer_id     Int
  name            String           @db.VarChar(50)
  description     String           @db.VarChar(50)
  is_free         Boolean          @default(false)
  image           String           @db.VarChar
  model_file      String           @db.VarChar(255)
  likes_count     Int              @default(0)
  download_count  Int?
  createdAt       DateTime         @default(now()) @db.Timestamptz(6)
  updatedAt       DateTime         @updatedAt @db.Timestamptz(6)
  tags            String[]
  price           Float?
  likes           Likes[]
  Category        Category         @relation(fields: [category_id], references: [category_id])
  Designers       Designers        @relation(fields: [designer_id], references: [designer_id])
  savedModels     SavedModels[]
  model_purchases model_purchase[]
   reviews         Review[]

  @@index([category_id])
  @@index([designer_id])
}

model Likes {
  like_id   Int      @id @default(autoincrement())
  model_id  Int
  user_id   Int
  liked     Boolean  @default(false)
  createdAt DateTime @default(now()) @db.Timestamptz(6)
  updatedAt DateTime @default(now()) @db.Timestamptz(6)
  Models    Models   @relation(fields: [model_id], references: [model_id], onDelete: Cascade)
  Users     Users    @relation(fields: [user_id], references: [user_id])

  @@unique([model_id, user_id], name: "model_user_unique", map: "model_user_unique")
  @@index([model_id])
  @@index([user_id])
}

model SavedModels {
  saved_model_id Int      @id @default(autoincrement())
  model_id       Int
  user_id        Int
  createdAt      DateTime @default(now()) @db.Timestamptz(6)
  updatedAt      DateTime @default(now()) @db.Timestamptz(6)
  saved          Boolean  @default(false)
  Models         Models   @relation(fields: [model_id], references: [model_id])
  Users          Users    @relation(fields: [user_id], references: [user_id])

  @@unique([model_id, user_id])
  @@index([model_id])
  @@index([user_id])
}

model Users {
  user_id                 Int                       @id @default(autoincrement())
  name                    String                    @db.VarChar(50)
  username                String                    @unique @db.VarChar(50)
  location                String                    @db.VarChar(255)
  email                   String                    @unique @db.VarChar(100)
  profile_pic             String?                   @db.VarChar
  password                String                    @db.VarChar(255)
  phoneNo                 String                    @db.VarChar(255)
  sellerType              String                    @db.VarChar(50)
  is_verified             Boolean                   @default(false)
  createdAt               DateTime                  @default(now()) @db.Timestamptz(6)
  updatedAt               DateTime                  @updatedAt @db.Timestamptz(6)
  ChatsReceived           Chats[]                   @relation("ChatReceiver")
  ChatsSent               Chats[]                   @relation("ChatSender")
  designers               Designers[]
  designersSearchLogs     DesignersSearchLog[]
  likes                   Likes[]
  modelsSearchLogs        ModelsSearchLog[]
  notifications           Notification[]            @relation("UserNotifications")
  printer_owners          Printer_Owners[]
  printersSearchLogs      PrintersSearchLog[]
  savedModels             SavedModels[]
  model_order_purchases   model_order_purchases[]
  model_orders            model_orders[]
  model_purchases         model_purchase[]
  printed_model_purchases printed_model_purchases[]
  printed_models          printed_models[]          @relation("UserPrintedModels")
  printer_orders          printer_orders[]
   reviews                 Review[]                  // Added relation to reviews

  @@index([user_id])
}

model Designers {
  designer_id  Int            @id @default(autoincrement())
  user_id      Int
  cnic_number  String         @unique @db.VarChar(50)
  bio          String         @db.VarChar(255)
  ratings      Int?
  createdAt    DateTime       @default(now()) @db.Timestamptz(6)
  updatedAt    DateTime       @updatedAt @db.Timestamptz(6)
  balance      Float          @default(0.0)
  Users        Users          @relation(fields: [user_id], references: [user_id])
  models       Models[]
  model_orders model_orders[]

  @@index([user_id])
}

model Printer_Owners {
  printer_owner_id    Int              @id @default(autoincrement())
  user_id             Int
  cnic_number         String           @unique @db.VarChar(50)
  bio                 String           @db.VarChar(255)
  ratings             Int?
  quality_certificate Bytes?
  createdAt           DateTime         @default(now()) @db.Timestamptz(6)
  updatedAt           DateTime         @updatedAt @db.Timestamptz(6)
  Users               Users            @relation(fields: [user_id], references: [user_id])
  printers            Printers[]
  printed_models      printed_models[] @relation("PrinterOwnerPrintedModels")
  printer_orders      printer_orders[]

  @@index([user_id])
}

model Printers {
  printer_id       Int              @id @default(autoincrement())
  location         String           @db.VarChar(100)
  description      String
  name             String           @db.VarChar(50)
  printer_type     String           @db.VarChar(50)
  materials        String[]
  price            Int?
  image            String           @db.VarChar(255)
  printer_owner_id Int?
  rating           Int?
  created_at       DateTime         @default(now()) @db.Timestamptz(6)
  updated_at       DateTime         @updatedAt @db.Timestamptz(6)
  colors           String[]
  services         String[]
  Printer_Owners   Printer_Owners?  @relation(fields: [printer_owner_id], references: [printer_owner_id])
  printer_orders   printer_orders[]
  reviews         Review[]

  @@index([printer_id])
  @@index([printer_owner_id])
}

model model_orders {
  order_id              Int                     @id @default(autoincrement())
  user_id               Int
  model_name            String                  @db.VarChar(255)
  description           String
  dimensions            Json
  file_format           String                  @db.VarChar(50)
  reference_file        String?                 @db.VarChar(255)
  additional_notes      String?
  designer_id           Int
  created_at            DateTime                @default(now()) @db.Timestamptz(6)
  updated_at            DateTime                @updatedAt @db.Timestamptz(6)
  status                String?                 @default("pending") @db.VarChar
  reasons               String?
  updates               String?
  order_file            String?                 @db.VarChar(255)
  order_file_status     String?                 @default("Not Submitted") @db.VarChar
  order_file_price      Float?
  order_check           String?                 @db.VarChar(255)
  model_order_purchases model_order_purchases[]
  Designers             Designers               @relation(fields: [designer_id], references: [designer_id])
  Users                 Users                   @relation(fields: [user_id], references: [user_id])

  @@index([order_id])
  @@index([user_id])
  @@index([designer_id])
}

model printer_orders {
  pending_order_id Int             @id @default(autoincrement())
  user_id          Int
  printerid        Int
  printer_owner_id Int?
  model_file       String          @db.VarChar
  instructions     String
  material         String          @db.VarChar
  color            String          @db.VarChar
  resolution       String          @db.VarChar
  resistance       String          @db.VarChar
  status           String?         @default("pending") @db.VarChar
  created_at       DateTime        @default(now())
  updated_at       DateTime        @updatedAt @db.Timestamptz(6)
  updates          String?
  reasons          String?
  Printer_Owners   Printer_Owners? @relation(fields: [printer_owner_id], references: [printer_owner_id])
  Printers         Printers        @relation(fields: [printerid], references: [printer_id])
  Users            Users           @relation(fields: [user_id], references: [user_id])

  @@index([pending_order_id])
  @@index([user_id])
  @@index([printerid])
}

model Chats {
  chat_id     Int      @id @default(autoincrement())
  sender_id   Int
  receiver_id Int
  message     String
  createdat   DateTime @default(now()) @db.Timestamptz(6)
  room_id     String   @db.VarChar(255)
  receiver    Users    @relation("ChatReceiver", fields: [receiver_id], references: [user_id])
  sender      Users    @relation("ChatSender", fields: [sender_id], references: [user_id])

  @@index([chat_id])
  @@index([room_id])
  @@index([sender_id])
  @@index([receiver_id])
}

model otp {
  id     Int      @id @default(autoincrement())
  email  String   @unique @db.VarChar(255)
  otp    String   @db.VarChar(6)
  expiry DateTime @db.Timestamptz(6)

  @@index([id])
  @@index([email])
}

model printed_models {
  printed_model_id        Int                       @id @default(autoincrement())
  user_id                 Int?
  printer_owner_id        Int?
  name                    String                    @db.VarChar
  description             String
  material                String                    @db.VarChar
  color                   String                    @db.VarChar
  resolution              String                    @db.VarChar
  resistance              String                    @db.VarChar
  dimensions              Json?
  weight                  Float?
  image                   String?                   @db.VarChar
  status                  String                    @default("available")
  price                   Float?
  created_at              DateTime                  @default(now())
  updated_at              DateTime                  @updatedAt @db.Timestamptz(6)
  quantity                Int?
  printed_model_purchases printed_model_purchases[]
  printer_owner           Printer_Owners?           @relation("PrinterOwnerPrintedModels", fields: [printer_owner_id], references: [printer_owner_id])
  user                    Users?                    @relation("UserPrintedModels", fields: [user_id], references: [user_id])

  @@index([printed_model_id])
  @@index([user_id, status])
  @@index([printer_owner_id])
}

model model_purchase {
  model_purchase_id Int      @id @default(autoincrement())
  user_id           Int
  model_id          Int
  purchasedAt       DateTime @default(now())
  price             Float
  model             Models   @relation(fields: [model_id], references: [model_id])
  user              Users    @relation(fields: [user_id], references: [user_id])

  @@unique([user_id, model_id])
  @@index([user_id])
  @@index([model_id])
}

model printed_model_purchases {
  purchase_id       Int            @id @default(autoincrement())
  user_id           Int
  printed_model_id  Int
  quantity          Int
  price             Float
  total_price       Float
  payment_intent_id String
  purchase_date     DateTime       @default(now())
  printed_model     printed_models @relation(fields: [printed_model_id], references: [printed_model_id])
  user              Users          @relation(fields: [user_id], references: [user_id])

  @@index([user_id])
  @@index([printed_model_id])
}

model model_order_purchases {
  purchase_id  Int          @id @default(autoincrement())
  user_id      Int
  order_id     Int
  price        Float
  purchased_at DateTime     @default(now())
  model_order  model_orders @relation(fields: [order_id], references: [order_id])
  user         Users        @relation(fields: [user_id], references: [user_id])

  @@index([user_id])
  @@index([order_id])
}

model scraped_models {
  id             Int       @id @default(autoincrement())
  name           String    @db.VarChar
  description    String    @db.VarChar
  file_path      String    @unique @db.VarChar
  image_url      String    @db.VarChar
  price          Float?
  created_at     DateTime? @default(now()) @db.Timestamptz(6)
  download_link  String?   @db.VarChar
  specifications String?
  formats        String?
  tags           String?

  @@index([id], map: "ix_scraped_models_id")
}

model ModelsSearchLog {
  search_id Int      @id @default(autoincrement())
  user_id   Int
  tags      String[]
  timestamp DateTime @default(now()) @db.Timestamptz(6)
  Users     Users    @relation(fields: [user_id], references: [user_id])

  @@index([user_id])
  @@index([tags], type: Gin)
}

model DesignersSearchLog {
  search_id Int      @id @default(autoincrement())
  user_id   Int
  location  String   @db.VarChar(255)
  timestamp DateTime @default(now()) @db.Timestamptz(6)
  Users     Users    @relation(fields: [user_id], references: [user_id])

  @@index([user_id])
  @@index([location])
}

model PrintersSearchLog {
  search_id Int      @id @default(autoincrement())
  user_id   Int
  location  String   @db.VarChar(255)
  materials String[]
  timestamp DateTime @default(now()) @db.Timestamptz(6)
  Users     Users    @relation(fields: [user_id], references: [user_id])

  @@index([user_id])
  @@index([location])
  @@index([materials], type: Gin)
}

model Notification {
  id            Int              @id @default(autoincrement())
  recipientId   Int
  type          NotificationType
  message       String
  isRead        Boolean          @default(false)
  createdAt     DateTime         @default(now()) @db.Timestamptz(6)
  relatedEntity String?
  relatedId     Int?
  recipient     Users            @relation("UserNotifications", fields: [recipientId], references: [user_id])

  @@index([recipientId, isRead])
}

model alembic_version {
  version_num String @id(map: "alembic_version_pkc") @db.VarChar(32)
}

enum NotificationType {
  NEW_PURCHASE
  CUSTOM_ORDER
  LIKE
  COMMENT
  ORDER_STATUS_UPDATE
  PROMOTION
  SYSTEM_ALERT
}

model Review {
  id          Int      @id @default(autoincrement())
  profileId   Int?
  userId      Int
  printerId   Int?
  modelId     Int?
  reviewText  String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

 
  user        Users     @relation(fields: [userId], references: [user_id])
  printer     Printers? @relation(fields: [printerId], references: [printer_id], onDelete: Cascade)
  model       Models?   @relation(fields: [modelId], references: [model_id], onDelete: Cascade)
}
*/