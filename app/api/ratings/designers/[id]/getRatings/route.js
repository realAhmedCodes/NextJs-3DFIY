import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  const { userId } = params;
  const { rating } = await req.json(); // Get the new rating from the request body

  try {
    // Validate rating
    if (typeof rating !== "number" || rating < 0 || rating > 5) {
      return new Response(
        JSON.stringify({ error: "Rating must be a number between 0 and 5." }),
        { status: 400 }
      );
    }

    // Check if the user is a Designer
    const designer = await prisma.designers.findUnique({
      where: { user_id: parseInt(userId) },
    });

    if (!designer) {
      return new Response(JSON.stringify({ error: "Designer not found." }), {
        status: 404,
      });
    }

    // Update the rating. For simplicity, we'll overwrite the existing rating.
    // Ideally, you'd calculate an average based on multiple reviews.
    const updatedDesigner = await prisma.designers.update({
      where: { user_id: parseInt(userId) },
      data: { ratings: rating },
    });

    return new Response(
      JSON.stringify({
        message: "Rating updated successfully!",
        rating: updatedDesigner.ratings,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to update rating." }), {
      status: 500,
    });
  }
}
