import pool from "@/app/lib/db";
import fs from "fs/promises";

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("user_id");
    const modelId = url.searchParams.get("model_id");

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
      });
    }

    if (!modelId) {
      return new Response(JSON.stringify({ error: "Model ID is required" }), {
        status: 400,
      });
    }

    const result = await pool.query(
      'SELECT * FROM "Models" WHERE model_id = $1',
      [modelId]
    );
    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Model not found" }), {
        status: 404,
      });
    }

    const model = result.rows[0];
    const filePaths = [model.model_file, model.image].filter(Boolean);

    for (const filePath of filePaths) {
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error(`Failed to delete file at path: ${filePath}`, error);
      }
    }

    await pool.query('DELETE FROM "Models" WHERE model_id = $1', [modelId]);

    return new Response(
      JSON.stringify({ message: "Model deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to delete model" }), {
      status: 500,
    });
  }
}
