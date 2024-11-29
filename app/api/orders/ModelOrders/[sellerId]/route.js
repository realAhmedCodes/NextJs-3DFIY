// api/orders/ModelOrders/[sellerId]/route.js

import { PrismaClient, NotificationType } from "@prisma/client";
import path from "path";
import fs from "fs";
import axios from "axios";

const prisma = new PrismaClient();
const uploadDir = path.join(process.cwd(), "public", "uploads");

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req, { params }) {
  const { sellerId } = params;

  try {
    // Parse form data
    const form = await req.formData();
    const modelName = form.get("modelName");
    const description = form.get("description");
    const dimensions = JSON.parse(form.get("dimensions"));
    const fileFormat = form.get("fileFormat");
    const referenceFile = form.get("referenceFile");
    const additionalNotes = form.get("additionalNotes");
    const userId = parseInt(form.get("userId"), 10);

    console.log(
      modelName,
      description,
      dimensions,
      fileFormat,
      sellerId,
      userId
    );

    // Validate required fields
    if (
      !modelName ||
      !description ||
      !dimensions ||
      !fileFormat ||
      !sellerId ||
      !userId
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Handle file upload
    let filename = null;
    if (referenceFile && referenceFile.name) {
      const allowedExtensions = ["stl", "obj"];
      const fileExtension = referenceFile.name.split(".").pop().toLowerCase();

      // Validate file type
      if (!allowedExtensions.includes(fileExtension)) {
        return new Response(
          JSON.stringify({
            error: "Invalid file format. Only STL and OBJ are allowed.",
          }),
          { status: 400 }
        );
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (referenceFile.size > maxSize) {
        return new Response(
          JSON.stringify({ error: "File size exceeds the 5MB limit." }),
          { status: 400 }
        );
      }

      // Generate unique filename
      filename = `${sellerId}_${Date.now()}.${fileExtension}`;
      const filePath = path.join(uploadDir, filename);

      // Write file to disk
      const fileBuffer = Buffer.from(await referenceFile.arrayBuffer());
      fs.writeFileSync(filePath, fileBuffer);
    }

    // Get current timestamp
    const now = new Date();

    // Create a new order using Prisma
    const newOrder = await prisma.model_orders.create({
      data: {
        user_id: userId,
        model_name: modelName,
        description: description,
        dimensions: dimensions,
        file_format: fileFormat,
        reference_file: filename,
        additional_notes: additionalNotes,
        designer_id: parseInt(sellerId, 10),
        created_at: now,
        updated_at: now,
      },
    });

    // Create a notification for the designer
    const notificationMessage = `You have received a new custom order (#${newOrder.order_id}) from User ${userId}.`;

    const newNotification = await prisma.notification.create({
      data: {
        recipientId: parseInt(sellerId, 10),
        type: NotificationType.CUSTOM_ORDER,
        message: notificationMessage,
        relatedEntity: "order",
        relatedId: newOrder.order_id,
      },
    });

    // Emit the notification via Socket.io without API Key
    try {
      await axios.post(`${process.env.SOCKET_IO_SERVER_URL}/notify`, {
        recipientId: parseInt(sellerId, 10),
        notification: {
          id: newNotification.id,
          type: newNotification.type,
          message: newNotification.message,
          isRead: newNotification.isRead,
          createdAt: newNotification.createdAt,
          relatedEntity: newNotification.relatedEntity,
          relatedId: newNotification.relatedId,
        },
      });
    } catch (emitError) {
      console.error("Error emitting notification via Socket.io:", emitError);
      // Optionally, handle emission error (e.g., retry, alert admin)
    }

    // Return success response
    return new Response(JSON.stringify(newOrder), { status: 201 });
  } catch (error) {
    console.error("Error placing order:", error);
    return new Response(JSON.stringify({ error: "Failed to place order" }), {
      status: 500,
    });
  }
}
