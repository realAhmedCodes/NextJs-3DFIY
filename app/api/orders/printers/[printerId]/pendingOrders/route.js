// app/api/orders/printers/[printerId]/pendingOrders/route.js

// app/api/orders/printers/[printerId]/pendingOrders/route.js

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
  const { printerId } = params;
  console.log(`Processing order for Printer ID: ${printerId}`); // For debugging

  try {
    const form = await req.formData();

    const user_id = parseInt(form.get("userId"), 10);
    const printer_owner_id = parseInt(form.get("printer_Owner_id"), 10);
    const material = form.get("material");
    const color = form.get("color");
    const resolution = form.get("resolution");
    const resistance = form.get("resistance");
    const model_file = form.get("file");
    const instructions = form.get("instructions");
    
    // New fields from form data
    const name = form.get("name");
    const address = form.get("address");
    const phone_number = form.get("phoneNumber");

    console.log({
      user_id,
      printerId,
      material,
      color,
      resolution,
      resistance,
      model_file,
      printer_owner_id,
      instructions,
      name,
      address,
      phone_number,
    });

    // Validate required fields
    if (
      !user_id ||
      !printerId ||
      !material ||
      !color ||
      !resolution ||
      !resistance ||
      !model_file ||
      !printer_owner_id ||
      !instructions ||
      !name ||
      !address ||
      !phone_number
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Handle file upload
    const fileExtension = model_file.name.split(".").pop();
    const filename = `${printerId}_${Date.now()}.${fileExtension}`;
    const filePath = path.join(uploadDir, filename);

    // Write file to disk
    const fileBuffer = Buffer.from(await model_file.arrayBuffer());
    fs.writeFileSync(filePath, fileBuffer);
    console.log(`File uploaded to ${filePath}`);

    // Insert order using Prisma
    const newOrder = await prisma.printer_orders.create({
      data: {
        user_id: user_id,
        printerid: parseInt(printerId, 10),
        printer_owner_id: printer_owner_id,
        material: material,
        color: color,
        resolution: resolution,
        resistance: resistance,
        model_file: filename, // Save the filename in the database
        instructions: instructions,
        name: name,
        address: address,
        phone_number: phone_number,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    console.log(`New order created with ID: ${newOrder.pending_order_id}`);

    // Fetch user's email and name based on user_id
    const user = await prisma.users.findUnique({
      where: { user_id: user_id },
      select: { email: true, name: true },
    });

    if (!user) {
      console.error(`User with ID ${user_id} not found.`);
      return new Response(
        JSON.stringify({ error: "User not found for the order." }),
        { status: 404 }
      );
    }

    // Create notification for the printer owner
    const notificationMessage = `You have a new custom order from ${user.name} (${user.email}).`;

    const newNotification = await prisma.notification.create({
      data: {
        recipientId: printer_owner_id,
        type: NotificationType.CUSTOM_ORDER, // Use the new enum value
        message: notificationMessage,
        isRead: false,
        createdAt: new Date(),
        relatedEntity: "printer_order",
        relatedId: newOrder.pending_order_id, // Assuming 'pending_order_id' is the primary key
      },
    });

    console.log(
      `Notification created with ID: ${newNotification.id} for Printer Owner ID: ${printer_owner_id}`
    );

    // Emit the notification via Socket.io
    try {
      await axios.post(`${process.env.SOCKET_IO_SERVER_URL}/notify`, {
        recipientId: printer_owner_id,
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
      console.log("Notification emitted via Socket.io");
    } catch (emitError) {
      console.error("Error emitting notification via Socket.io:", emitError);
      // Optionally, handle emission error (e.g., retry, alert admin)
    }

    return new Response(JSON.stringify(newOrder), { status: 201 });
  } catch (error) {
    console.error("Error placing order:", error);
    return new Response(JSON.stringify({ error: "Failed to place order" }), {
      status: 500,
    });
  }
}
