import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch up to 3 models from the database using Prisma
    const models = await prisma.models.findMany({
      take: 3,
    });

    // If no models are found, return a 404 response
    if (models.length === 0) {
      return new Response(JSON.stringify({ error: "Models not found" }), {
        status: 404,
      });
    }

    // Return the fetched models as a JSON response with status 200
    return new Response(JSON.stringify(models), { status: 200 });
  } catch (error) {
    console.error("Error fetching models:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch model details" }),
      { status: 500 }
    );
  }
}
