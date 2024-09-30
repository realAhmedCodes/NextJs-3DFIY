/*import { NextResponse } from "next/server";
import multer from "multer";
import path from "path";
import fs from "fs";
import pool from "@/app/lib/db";

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /obj|stl|jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetypes = [
      "application/sla",
      "model/stl",
      "application/vnd.ms-pki.stl",
      "application/octet-stream",
      "text/plain",
      "image/jpeg",
      "image/png",
    ];
    const mimetype = mimetypes.includes(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(
        new Error("Only .obj, .stl, .jpeg, .jpg, and .png files are allowed!")
      );
    }
  },
});

// Middleware function to parse form data
const multerMiddleware = upload.fields([
  { name: "modelFile", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

// Main PUT function to handle the update logic
export async function PUT(req, { params }) {
  const { modelId } = params;

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

  const { category_id, designer_id, name, description, price, is_free, tags } =
    req.body;

  if (!modelId) {
    return NextResponse.json(
      { error: "Model ID is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch existing model details
    const result = await pool.query(
      'SELECT * FROM "Models" WHERE model_id = $1',
      [modelId]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 });
    }

    const model = result.rows[0];

    // Handle model file upload
    let newModelFilePath = model.model_file;
    if (req.files && req.files.modelFile) {
      const modelFile = req.files.modelFile[0];
      newModelFilePath = `./uploads/models/${name}_model_${Date.now()}.${modelFile.originalname
        .split(".")
        .pop()}`;
      fs.writeFileSync(newModelFilePath, modelFile.buffer);
      if (model.model_file) {
        fs.unlinkSync(model.model_file);
      }
    }

    // Handle image upload
    let newImagePath = model.image;
    if (req.files && req.files.image) {
      const imageFile = req.files.image[0];
      newImagePath = `./uploads/models/${name}_image_${Date.now()}.${imageFile.originalname
        .split(".")
        .pop()}`;
      fs.writeFileSync(newImagePath, imageFile.buffer);
      if (model.image) {
        fs.unlinkSync(model.image);
      }
    }

    // Update model in the database
    const updateResult = await pool.query(
      'UPDATE "Models" SET category_id = $1, designer_id = $2, name = $3, description = $4, price = $5, is_free = $6, tags = $7, model_file = $8, image = $9 WHERE model_id = $10 RETURNING *',
      [
        category_id || model.category_id,
        designer_id || model.designer_id,
        name || model.name,
        description || model.description,
        price || model.price,
        is_free || model.is_free,
        tags || model.tags,
        newModelFilePath,
        newImagePath,
        modelId,
      ]
    );

    return NextResponse.json(updateResult.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update model" },
      { status: 500 }
    );
  }
}
*/
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import multer from "multer";
import path from "path";
import fs from "fs";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /obj|stl|jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetypes = [
      "application/sla",
      "model/stl",
      "application/vnd.ms-pki.stl",
      "application/octet-stream",
      "text/plain",
      "image/jpeg",
      "image/png",
    ];
    const mimetype = mimetypes.includes(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(
        new Error("Only .obj, .stl, .jpeg, .jpg, and .png files are allowed!")
      );
    }
  },
});

// Middleware function to parse form data
const multerMiddleware = upload.fields([
  { name: "modelFile", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

// Helper to process multer requests
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Main PUT function to handle the update logic
export async function PUT(req, { params }) {
  const { modelId } = params;

  // Process the incoming request with multer
  await runMiddleware(req, req.nextUrl, multerMiddleware);

  // Manually parse form fields from req.body since it's a multipart form
  const category_id = req.body.category_id;
  const designer_id = req.body.designer_id;
  const name = req.body.name;
  const description = req.body.description;
  const price = req.body.price;
  const is_free = req.body.is_free === "true"; // Convert to boolean
  const tags = req.body.tags ? JSON.parse(req.body.tags) : [];

  // Debugging output
  console.log({
    category_id,
    designer_id,
    name,
    description,
    price,
    is_free,
    tags,
    files: req.files,
  });

  if (!modelId) {
    return NextResponse.json(
      { error: "Model ID is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch existing model details using Prisma
    const model = await prisma.models.findUnique({
      where: { model_id: parseInt(modelId) },
    });

    if (!model) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 });
    }

    // Handle model file upload
    let newModelFilePath = model.model_file;
    if (req.files && req.files.modelFile) {
      const modelFile = req.files.modelFile[0];
      newModelFilePath = `./uploads/models/${name}_model_${Date.now()}.${modelFile.originalname
        .split(".")
        .pop()}`;
      fs.writeFileSync(newModelFilePath, modelFile.buffer);
      if (model.model_file) {
        fs.unlinkSync(model.model_file); // Delete old file
      }
    }

    // Handle image upload
    let newImagePath = model.image;
    if (req.files && req.files.image) {
      const imageFile = req.files.image[0];
      newImagePath = `./uploads/models/${name}_image_${Date.now()}.${imageFile.originalname
        .split(".")
        .pop()}`;
      fs.writeFileSync(newImagePath, imageFile.buffer);
      if (model.image) {
        fs.unlinkSync(model.image); // Delete old image
      }
    }

    // Update model in the database using Prisma
    const updatedModel = await prisma.models.update({
      where: { model_id: parseInt(modelId) },
      data: {
        category_id: category_id || model.category_id,
        designer_id: designer_id || model.designer_id,
        name: name || model.name,
        description: description || model.description,
        price: price !== undefined ? parseFloat(price) : model.price,
        is_free: is_free !== undefined ? is_free : model.is_free,
        tags: tags.length > 0 ? tags : model.tags,
        model_file: newModelFilePath,
        image: newImagePath,
      },
    });

    return NextResponse.json(updatedModel);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update model" },
      { status: 500 }
    );
  }
}
