import path from "path";
import fs from "fs";
import pool from "@/app/lib/db";

const uploadDir = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
export async function POST(req) {
  try {
    const form = await req.formData();

    const printer_owner_id = parseInt(form.get("printer_owner_id"), 10);
    const name = form.get("name");
    const description = form.get("description");
    const printerType = form.get("printerType");
    const material = form.get("material");
    const price = parseFloat(form.get("price"));
    const location = form.get("location");
    const image = form.get("image");

    if (!printer_owner_id || !name || !printerType || !material || !image) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
        }
      );
    }

    const imageFilename = `${name}_image_${Date.now()}.${image.name
      .split(".")
      .pop()}`;
    const imagePath = path.join(uploadDir, imageFilename);

    const imageBuffer = Buffer.from(await image.arrayBuffer());
    fs.writeFileSync(imagePath, imageBuffer);

    const now = new Date().toISOString();

    const result = await pool.query(
      'INSERT INTO "printers" (printer_owner_id, name, description, printer_type, materials, price, location, image, "created_at", "updated_at") VALUES ($1, $2, $3, $4, $5::text[], $6, $7, $8,$9,$10) RETURNING *',
      [
        printer_owner_id,
        name,
        description,
        printerType,
        [material], 
        price,
        location,
        imageFilename,
        now,
        now
      ]
    );

    return new Response(JSON.stringify(result.rows[0]), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to upload printer" }), {
      status: 500,
    });
  }
}
