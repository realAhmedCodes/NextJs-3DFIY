import pool from "@/app/lib/db";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req, { params }) {
  const { sellerId } = params;
  try {
    const form = await req.formData();

    const modelName = form.get("modelName");
    const description = form.get("description");
    const dimensions = JSON.parse(form.get("dimensions"));
    const fileFormat = form.get("fileFormat");
    const referenceFile = form.get("referenceFile");
    const additionalNotes = form.get("additionalNotes");

    const userId = parseInt(form.get("userId"), 10);

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
        {
          status: 400,
        }
      );
    }

    let filename = null;
    if (referenceFile && referenceFile.name) {
      filename = `${sellerId}_${Date.now()}.${referenceFile.name
        .split(".")
        .pop()}`;
      const filePath = path.join(uploadDir, filename);

      // Write file to disk
      const fileBuffer = Buffer.from(await referenceFile.arrayBuffer());
      fs.writeFileSync(filePath, fileBuffer);
    }

    const now = new Date().toISOString();

    const result = await pool.query(
      `INSERT INTO "model_orders" 
        (user_id, model_name, description, dimensions, file_format, reference_file, additional_notes, designer_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        userId,
        modelName,
        description,
        dimensions,
        fileFormat,
        filename,
        additionalNotes,
        sellerId,
        now,
        now,
      ]
    );

    return new Response(JSON.stringify(result.rows[0]), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to place order" }), {
      status: 500,
    });
  }
}
