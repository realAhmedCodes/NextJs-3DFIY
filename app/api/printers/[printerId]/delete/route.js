import pool from "@/app/lib/db";
import path from "path";
import fs from "fs/promises";

// Delete Printer API Handler
export async function DELETE(req, { params }) {
  const { printerId } = params;
  console.log(`Deleting printer with ID: ${printerId}`); // Debugging

  try {
    // Check if the printer ID is provided
    if (!printerId) {
      return new Response(JSON.stringify({ error: "Printer ID is required" }), {
        status: 400,
      });
    }

    // Retrieve the printer data from the database
    const result = await pool.query(
      'SELECT * FROM "printers" WHERE printer_id = $1',
      [printerId]
    );

    // Check if the printer exists
    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Printer not found" }), {
        status: 404,
      });
    }

    const printer = result.rows[0];
    const filePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      printer.image
    );

    // Delete the associated image file
    try {
      await fs.unlink(filePath);
      console.log(`Deleted file at path: ${filePath}`);
    } catch (error) {
      console.error(`Failed to delete file at path: ${filePath}`, error);
      // Continue to delete the printer record even if the image file deletion fails
    }

    // Delete the printer record from the database
    await pool.query('DELETE FROM "printers" WHERE printer_id = $1', [
      printerId,
    ]);

    return new Response(
      JSON.stringify({ message: "Printer deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting printer:", error);
    return new Response(JSON.stringify({ error: "Failed to delete printer" }), {
      status: 500,
    });
  }
}
