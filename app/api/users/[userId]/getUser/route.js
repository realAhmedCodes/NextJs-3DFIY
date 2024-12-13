

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { userId } = params;

  try {
    // Fetch user details
    const userDetails = await prisma.users.findUnique({
      where: { user_id: parseInt(userId) },
    });

    if (!userDetails) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const sellerType = userDetails.sellerType;
    let additionalDetails = {};
    let models = [];
    let printer=[]
    let sellerId = null; // Initialize sellerId

    if (sellerType === "Designer") {
      // Fetch designer details using findFirst since user_id is not unique
      const designerDetails = await prisma.designers.findFirst({
        where: { user_id: parseInt(userId) },
        select: {
          bio: true,
          ratings: true,
          designer_id: true,
        },
      });

      if (designerDetails) {
        additionalDetails = designerDetails;
        sellerId = designerDetails.designer_id; // Set sellerId for Designer

        // Fetch designer models
        models = await prisma.models.findMany({
          where: { designer_id: sellerId },
        });
      }
    } else if (sellerType === "Printer Owner") {
      // Fetch printer owner details using findFirst
      const printerOwnerDetails = await prisma.printer_Owners.findFirst({
        where: { user_id: parseInt(userId) },
        select: {
          bio: true,
          ratings: true,
          printer_owner_id: true,
        },
      });

      if (printerOwnerDetails) {
        additionalDetails = printerOwnerDetails;
        sellerId = printerOwnerDetails.printer_owner_id; 

        printer = await prisma.printers.findMany({
          where: { printer_owner_id: sellerId },
        });
      }
    }

    // Construct the response object
    const response = {
      ...userDetails,
      ...additionalDetails,
      models,
      printer,
      sellerId,
    };

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch User details" }),
      { status: 500 }
    );
  }
}
