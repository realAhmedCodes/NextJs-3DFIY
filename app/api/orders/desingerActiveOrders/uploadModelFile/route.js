// File: /pages/api/orders/designerActiveOrders/uploadModelFile.js
// File: /pages/api/orders/designerActiveOrders/uploadModelFile.js

import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs/promises"; // Use the promise-based fs module for async operations
import axios from "axios";

const prisma = new PrismaClient();
const uploadDir = path.join(process.cwd(), "public", "uploads");

// Ensure the upload directory exists
const ensureUploadDir = async () => {
  try {
    await fs.access(uploadDir);
  } catch (err) {
    await fs.mkdir(uploadDir, { recursive: true });
  }
};

export const runtime = "nodejs";

export async function PUT(req, res) {
  try {
    await ensureUploadDir();

    // Parse form data
    const form = await req.formData();
    const order_file = form.get("order_file");
    const order_id = form.get("order_id");
    const price = form.get("price");
    const order_file_price = parseFloat(price);

    if (!order_file || !order_id || !order_file_price) {
      return new Response(
        JSON.stringify({ error: "Missing File or Order ID" }),
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["stl", "obj"];
    const fileExtension = order_file.name.split(".").pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      return new Response(
        JSON.stringify({
          error: "Invalid file type. Only .stl and .obj are allowed.",
        }),
        { status: 400 }
      );
    }

    // Generate a unique filename
    const filename = `order_${order_id}_${Date.now()}.${fileExtension}`;
    const filePath = path.join(uploadDir, filename);

    // Write file to disk
    const fileBuffer = Buffer.from(await order_file.arrayBuffer());
    await fs.writeFile(filePath, fileBuffer);

    // Start a transaction to ensure atomicity
    const currentTimestamp = new Date();

    const result = await prisma.$transaction(async (tx) => {
      // Update the model_orders table with the file path and order_file_status
      const updatedOrder = await tx.model_orders.update({
        where: { order_id: parseInt(order_id, 10) },
        data: {
          order_file: `/uploads/${filename}`, // Store the relative path
          order_file_status: "Submitted", // Update the order_file_status to "Submitted"
          status: "completed",
          order_file_price: order_file_price,
          updated_at: currentTimestamp, // Ensure updated_at is refreshed
        },
      });

      // Fetch the order details to identify the user (who placed the order)
      const order = await tx.model_orders.findUnique({
        where: { order_id: parseInt(order_id, 10) },
        select: { user_id: true },
      });

      if (order) {
        const userId = order.user_id; // User who made the order

        // Create a notification for the designer (sender)
        const notification = await tx.notification.create({
          data: {
            recipientId: userId, // Notify the user who placed the order
            type: "ORDER_STATUS_UPDATE",
            message: `Your 3D model file has been uploaded by the designer. Order ID: ${order_id}`,
            relatedEntity: "order",
            relatedId: parseInt(order_id),
          },
        });

        // Emit the notification via Socket.io server (or any other service you use)
        await axios.post(`${process.env.SOCKET_IO_SERVER_URL}/notify`, {
          recipientId: userId,
          notification: {
            id: notification.id,
            type: notification.type,
            message: notification.message,
            isRead: notification.isRead,
            createdAt: notification.createdAt,
            relatedEntity: notification.relatedEntity,
            relatedId: notification.relatedId,
          },
        });
      }

      return updatedOrder; // Return the updated order as a response
    });

    // Return success response with updated order details
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error uploading model file:", error);
    return new Response(
      JSON.stringify({ error: "Failed to upload model file" }),
      { status: 500 }
    );
  }
}
