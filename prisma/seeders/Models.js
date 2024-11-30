// /prisma/seeders/models.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedModels() {
  const models = [
    { name: "Mechanical Gear 3D Model", description: "A detailed 3D model of a mechanical gear.", category_id: 1, designer_id: 1, image: "model1.png", model_file: "model1.stl", tags: ["mechanical", "gear"], price: 15.0, is_free: false },
    { name: "Modern Home Building 3D Model", description: "3D model of a modern home building.", category_id: 2, designer_id: 2, image: "model2.png", model_file: "model2.stl", tags: ["architecture", "home"], price: 25.0, is_free: false },
    { name: "3D Logo Design", description: "3D model of a digital artwork for a logo design.", category_id: 3, designer_id: 3, image: "model3.png", model_file: "model3.stl", tags: ["graphic", "logo"], price: 10.0, is_free: true },
    { name: "Car Engine Part", description: "Detailed car engine parts model.", category_id: 1, designer_id: 4, image: "model4.png", model_file: "model4.stl", tags: ["automotive", "engine"], price: 40.0, is_free: false },
    { name: "3D Model Bridge", description: "A 3D model of a civil engineering bridge.", category_id: 2, designer_id: 5, image: "model5.png", model_file: "model5.stl", tags: ["civil", "bridge"], price: 30.0, is_free: false },
    { name: "Modern Chair", description: "Graphic design of a modern chair for interiors.", category_id: 3, designer_id: 6, image: "model6.png", model_file: "model6.stl", tags: ["interior", "furniture"], price: 20.0, is_free: true },
    { name: "3D Drone Model", description: "3D print-ready model of a drone.", category_id: 1, designer_id: 7, image: "model7.png", model_file: "model7.stl", tags: ["drone", "mechanical"], price: 45.0, is_free: false },
    { name: "Futuristic Home 3D Model", description: "Design of a futuristic home structure.", category_id: 2, designer_id: 8, image: "model8.png", model_file: "model8.stl", tags: ["architecture", "home"], price: 50.0, is_free: false },
    { name: "Fashion Necklace", description: "3D model of a fashion accessory: a stylish necklace.", category_id: 3, designer_id: 9, image: "model9.png", model_file: "model9.stl", tags: ["fashion", "accessory"], price: 15.0, is_free: true },
    { name: "Industrial Machine", description: "Design of a multi-purpose industrial machine.", category_id: 1, designer_id: 10, image: "model10.png", model_file: "model10.stl", tags: ["machine", "engineering"], price: 60.0, is_free: false },
    { name: "Urban Park", description: "3D model of an urban park with green space and benches.", category_id: 2, designer_id: 11, image: "model11.png", model_file: "model11.stl", tags: ["urban", "park"], price: 35.0, is_free: true },
    { name: "Banner Design", description: "Advanced digital art design for website banner.", category_id: 3, designer_id: 12, image: "model12.png", model_file: "model12.stl", tags: ["digital art", "website"], price: 25.0, is_free: false },
    { name: "Office Building", description: "Design of an energy-efficient office building.", category_id: 2, designer_id: 13, image: "model13.png", model_file: "model13.stl", tags: ["architecture", "office"], price: 40.0, is_free: true },
    { name: "Solar Powered Car", description: "Interactive 3D model of a solar-powered car.", category_id: 1, designer_id: 14, image: "model14.png", model_file: "model14.stl", tags: ["automotive", "solar"], price: 55.0, is_free: false },
    { name: "Evening Dress", description: "Fashion design model for evening wear dress.", category_id: 3, designer_id: 15, image: "model15.png", model_file: "model15.stl", tags: ["fashion", "dress"], price: 20.0, is_free: false }
  ];

  for (let model of models) {
    await prisma.models.create({
      data: model,
    });
  }

  console.log("Models seeding completed.");
}

module.exports = seedModels;
