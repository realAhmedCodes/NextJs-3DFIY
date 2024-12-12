// /app/api/printers/[printerId]/printerDetail/route.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { printerId } = params;
  console.log(`Fetching details for printer ID: ${printerId}`); // For debugging

  try {
    // Fetch printer details with related user and printer owner details
    const printer = await prisma.printers.findUnique({
      where: {
        printer_id: parseInt(printerId, 10), // Convert printerId to integer
      },
      select: {
        name: true, // Printer details
        description: true,
        price: true,
        image: true,
        materials: true,
        services: true, // Include services
        printVolumeWidth: true,
        printVolumeDepth: true,
        printVolumeHeight: true,
        layerResolutionMin: true,
        layerResolutionMax: true,
        printSpeedMax: true,
        nozzleDiameter: true,
        filamentDiameter: true,
        Printer_Owners: {
          select: {
            Users: {
              // User details related to the printer owner
              select: {
                name: true,
                location: true,
                profile_pic: true,
              },
            },
          },
        },
      },
    });

    if (!printer) {
      return new Response(JSON.stringify({ error: "Printer not found" }), {
        status: 404,
      });
    }

    // Structure the response to include specifications and services
    const response = {
      user_name: printer.Printer_Owners.Users.name,
      user_location: printer.Printer_Owners.Users.location,
      profile_pic: printer.Printer_Owners.Users.profile_pic,
      printer_name: printer.name,
      description: printer.description,
      price: printer.price,
      image: printer.image,
      materials: printer.materials,
      services: printer.services,
      specifications: {
        printVolume: `${printer.printVolumeWidth} x ${printer.printVolumeDepth} x ${printer.printVolumeHeight} mm`,
        layerResolution: `${printer.layerResolutionMin} - ${printer.layerResolutionMax} microns`,
        printSpeed: `${printer.printSpeedMax} mm/s`,
        nozzleDiameter: `${printer.nozzleDiameter} mm`,
        filamentDiameter: `${printer.filamentDiameter} mm`,
      },
    };

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("Error fetching printer details:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch printer details" }),
      {
        status: 500,
      }
    );
  }
}
