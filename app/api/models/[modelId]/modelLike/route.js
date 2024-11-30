/*
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  const { modelId } = params;
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
    });
  }

  const userId = parseInt(body.user_id); // Ensure user_id is an integer
  if (isNaN(userId)) {
    return new Response(
      JSON.stringify({ error: "User ID is required and must be an integer" }),
      {
        status: 400,
      }
    );
  }

  const currentTimestamp = new Date();

  try {
    // Check if the like already exists
    const like = await prisma.likes.findUnique({
      where: {
        model_id_user_id: {
          model_id: parseInt(modelId),
          user_id: userId,
        },
      },
    });

    if (!like) {
      // Create a new like if it doesn't exist
      await prisma.likes.create({
        data: {
          model_id: parseInt(modelId),
          user_id: userId,
          liked: true,
          createdAt: currentTimestamp,
          updatedAt: currentTimestamp,
        },
      });

      // Increment the like_count in the Models table
      await prisma.models.update({
        where: { model_id: parseInt(modelId) },
        data: { likes_count: { increment: 1 } },
      });
    } else if (!like.liked) {
      // Update like status if it exists but was previously unliked
      await prisma.likes.update({
        where: {
          model_id_user_id: {
            model_id: parseInt(modelId),
            user_id: userId,
          },
        },
        data: {
          liked: true,
          updatedAt: currentTimestamp,
        },
      });

      // Increment the like_count in the Models table
      await prisma.models.update({
        where: { model_id: parseInt(modelId) },
        data: { likes_count: { increment: 1 } },
      });
    } else {
      return new Response(
        JSON.stringify({ message: "Model can't be liked again" }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Model liked successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function GET(req, { params }) {
  const { modelId } = params;
  const url = new URL(req.url);
  const userId = parseInt(url.searchParams.get("user_id")); // Ensure user_id is an integer

  if (isNaN(userId)) {
    return new Response(
      JSON.stringify({ error: "User ID is required and must be an integer" }),
      {
        status: 400,
      }
    );
  }

  try {
    const like = await prisma.likes.findUnique({
      where: {
        model_id_user_id: {
          model_id: parseInt(modelId),
          user_id: userId,
        },
      },
    });

    if (like) {
      return new Response(JSON.stringify({ liked: like.liked }), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ liked: false }), { status: 200 });
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
 */
// app/api/models/[modelId]/modelLike.js

// app/api/models/[modelId]/modelLike.js
// app/api/models/[modelId]/modelLike.js

import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  const { modelId } = params;
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
    });
  }

  const userId = parseInt(body.user_id); // Ensure user_id is an integer
  if (isNaN(userId)) {
    return new Response(
      JSON.stringify({ error: "User ID is required and must be an integer" }),
      { status: 400 }
    );
  }

  const currentTimestamp = new Date();

  try {
    // Start a transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => { // Renamed to 'tx' to avoid shadowing
      // Check if the like already exists using the named unique constraint
      const like = await tx.likes.findUnique({
        where: {
          model_user_unique: { // Updated to use the named constraint
            model_id: parseInt(modelId),
            user_id: userId,
          },
        },
      });

      if (!like) {
        // Create a new like if it doesn't exist
        await tx.likes.create({
          data: {
            model_id: parseInt(modelId),
            user_id: userId,
            liked: true,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
          },
        });

        // Increment the likes_count in the Models table
        await tx.models.update({
          where: { model_id: parseInt(modelId) },
          data: { likes_count: { increment: 1 } },
        });

        // Fetch model details to identify the designer, including the user_id
        const model = await tx.models.findUnique({
          where: { model_id: parseInt(modelId) },
          include: { Designers: { include: { Users: true } } }, // Include Users within Designers
        });

        if (!model) {
          throw new Error("Model not found.");
        }

        const designerUserId = model.Designers.Users.user_id; // Correctly fetch user_id

        // Avoid sending notification if the user likes their own model
        if (designerUserId !== userId) {
          // Create the notification
          const notification = await tx.notification.create({
            data: {
              recipientId: designerUserId, // Use the correct user_id
              type: "LIKE",
              message: `User ${userId} liked your model "${model.name}".`,
              relatedEntity: "model",
              relatedId: parseInt(modelId),
            },
          });

          // Emit the notification via Socket.io server
          await axios.post(`${process.env.SOCKET_IO_SERVER_URL}/notify`, {
            recipientId: designerUserId, // Use the correct user_id
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
      } else if (!like.liked) {
        // Update like status if it exists but was previously unliked
        await tx.likes.update({
          where: {
            model_user_unique: { // Updated to use the named constraint
              model_id: parseInt(modelId),
              user_id: userId,
            },
          },
          data: {
            liked: true,
            updatedAt: currentTimestamp,
          },
        });

        // Increment the likes_count in the Models table
        await tx.models.update({
          where: { model_id: parseInt(modelId) },
          data: { likes_count: { increment: 1 } },
        });

        // Fetch model details to identify the designer, including the user_id
        const model = await tx.models.findUnique({
          where: { model_id: parseInt(modelId) },
          include: { Designers: { include: { Users: true } } }, // Include Users within Designers
        });

        if (!model) {
          throw new Error("Model not found.");
        }

        const designerUserId = model.Designers.Users.user_id; // Correctly fetch user_id

        // Avoid sending notification if the user likes their own model
        if (designerUserId !== userId) {
          // Create the notification
          const notification = await tx.notification.create({
            data: {
              recipientId: designerUserId, // Use the correct user_id
              type: "LIKE",
              message: `User ${userId} liked your model "${model.name}".`,
              relatedEntity: "model",
              relatedId: parseInt(modelId),
            },
          });

          // Emit the notification via Socket.io server
          await axios.post(`${process.env.SOCKET_IO_SERVER_URL}/notify`, {
            recipientId: designerUserId, // Use the correct user_id
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
      } else {
        return { message: "Model is already liked." };
      }

      return { message: "Model liked successfully." };
    });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message || "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function DELETE(req, { params }) {
  const { modelId } = params;
  const url = new URL(req.url);
  const userId = parseInt(url.searchParams.get("user_id")); // Ensure user_id is an integer

  if (isNaN(userId)) {
    return new Response(
      JSON.stringify({ error: "User ID is required and must be an integer" }),
      { status: 400 }
    );
  }

  const currentTimestamp = new Date();

  try {
    // Start a transaction
    const result = await prisma.$transaction(async (tx) => { // Renamed to 'tx'
      // Find the existing like using the named unique constraint
      const like = await tx.likes.findUnique({
        where: {
          model_user_unique: { // Updated to use the named constraint
            model_id: parseInt(modelId),
            user_id: userId,
          },
        },
      });

      if (!like || !like.liked) {
        throw new Error("Like does not exist.");
      }

      // Update the like to set liked to false
      await tx.likes.update({
        where: {
          model_user_unique: { // Updated to use the named constraint
            model_id: parseInt(modelId),
            user_id: userId,
          },
        },
        data: {
          liked: false,
          updatedAt: currentTimestamp,
        },
      });

      // Decrement the likes_count in the Models table
      await tx.models.update({
        where: { model_id: parseInt(modelId) },
        data: { likes_count: { decrement: 1 } },
      });

      return { message: "Model unliked successfully." };
    });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message || "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function GET(req, { params }) {
  const { modelId } = params;
  const url = new URL(req.url);
  const userId = parseInt(url.searchParams.get("user_id")); // Ensure user_id is an integer

  if (isNaN(userId)) {
    return new Response(
      JSON.stringify({ error: "User ID is required and must be an integer" }),
      { status: 400 }
    );
  }

  try {
    const like = await prisma.likes.findUnique({
      where: {
        model_user_unique: { // Updated to use the named constraint
          model_id: parseInt(modelId),
          user_id: userId,
        },
      },
    });

    if (like) {
      return new Response(JSON.stringify({ liked: like.liked }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ liked: false }), { status: 200 });
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

