import { NextResponse } from "next/server";
import multer from "multer";
import path from "path";
import fs from "fs";
import pool from "@/app/lib/db";

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetypes = ["image/jpeg", "image/png"];
    const mimetype = mimetypes.includes(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only .jpeg, .jpg, and .png files are allowed!"));
    }
  },
});

// Middleware function to parse form data
const multerMiddleware = upload.fields([{ name: "image", maxCount: 1 }]);

// Main PUT function to handle the update logic
export async function PUT(req, { params }) {
  const { printerId } = params;

  // Process the incoming request with multer
  await new Promise((resolve, reject) => {
    multerMiddleware(req, req.nextUrl, (err) => {
      if (err instanceof multer.MulterError) {
        return reject(err);
      } else if (err) {
        return reject(err);
      }
      resolve();
    });
  });

  const { name, description, price, printerType, location, materials } =
    req.body;

  if (!printerId) {
    return NextResponse.json(
      { error: "Printer ID is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch existing printer details
    const result = await pool.query(
      'SELECT * FROM "printers" WHERE printer_id = $1',
      [printerId]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Printer not found" }, { status: 404 });
    }

    const printer = result.rows[0];

    // Handle image upload
    let newImagePath = printer.image;
    if (req.files && req.files.image) {
      const imageFile = req.files.image[0];
      newImagePath = `./uploads/printers/${name}_image_${Date.now()}.${imageFile.originalname
        .split(".")
        .pop()}`;
      fs.writeFileSync(newImagePath, imageFile.buffer);
      if (printer.image) {
        fs.unlinkSync(printer.image);
      }
    }

    // Update printer in the database
    const updateResult = await pool.query(
      'UPDATE "printers" SET name = $1, description = $2, price = $3, printer_type = $4, location = $5, materials = $6, image = $7 WHERE printer_id = $8 RETURNING *',
      [
        name || printer.name,
        description || printer.description,
        price || printer.price,
        printerType || printer.printer_type,
        location || printer.location,
        materials || printer.materials,
        newImagePath,
        printerId,
      ]
    );

    return NextResponse.json(updateResult.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update printer" },
      { status: 500 }
    );
  }
}
