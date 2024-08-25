// app/api/models/route.js
import pool from "@/app/lib/db";

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM Models");
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch models" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  const form = await req.formData();
  const file = form.get("modelFile");
  const filename = `${form.get("name")}_model_${Date.now()}.${file.name
    .split(".")
    .pop()}`;
  const filePath = `./uploads/models/${filename}`;

  // Save the file locally
  fs.writeFileSync(filePath, Buffer.from(await file.arrayBuffer()));

  const { category_id, designer_id, name, description, price, is_free, tags } =
    form;

  try {
    const result = await pool.query(
      "INSERT INTO Models (category_id, designer_id, name, description, price, is_free, tags, model_file) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        category_id,
        designer_id,
        name,
        description,
        price,
        is_free,
        JSON.stringify(tags),
        filePath,
      ]
    );
    return new Response(JSON.stringify(result.rows[0]), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to create model" }), {
      status: 500,
    });
  }
}
