import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const userId = request.headers.get('user-id');
  const orderId = request.headers.get('order-id');

  console.log(`Checking if user ${userId} and order ${orderId} exists`);

  try {

    const purchase = await prisma.model_order_purchases.findFirstOrThrow({
      where: {
        user_id: parseInt(userId),
        order_id: parseInt(orderId),
      },
    });

    if (!purchase) {
      return NextResponse.json({ error: "User has not purchased this model" }, { status: 403 });
    }

    const model = await prisma.model_orders.findUnique({
      where: {
        user_id: parseInt(userId),
        order_id: parseInt(orderId)
      },
    });

    if (!model || !model.order_file) {
      return NextResponse.json({ error: "Model file not found" }, { status: 404 });
    }

    if (model.order_file_status !== "Paid") {
      return NextResponse.json({ error: "Model file not found" }, { status: 404 });
    }

    const filePath = path.resolve(process.env.APP_PUBLIC_DIR + model.order_file);

    console.log("File path:", filePath);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found on the server" }, { status: 404 });
    }


    const file = fs.createReadStream(filePath);
    const stat = fs.statSync(filePath);

    return new NextResponse(file, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': stat.size,
        'Content-Disposition': `attachment; filename="${path.basename(filePath)}"`,
      },
    });

  } catch (error) {
    console.error("Error downloading model:", error);
    return NextResponse.json({ error: "Failed to process the request" }, { status: 500 });
  }
}
