const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const printedModels = [];

  for (let i = 1; i <= 30; i++) {
    printedModels.push({
      user_id: i % 2 === 0 ? null : Math.floor(Math.random() * 30) + 1, // Some models have user_id
      printer_owner_id: i % 2 !== 0 ? null : Math.floor(Math.random() * 15) + 1, // Some have printer_owner_id
      name: `Printed Model ${i}`,
      description: `Description of printed model ${i}`,
      material: "PLA",
      color: "Red",
      resolution: "High",
      resistance: "Standard",
      dimensions: { x: 10, y: 20, z: 30 },
      weight: Math.random() * 100,
      image: `printed_model${i}.jpg`,
      status: "available",
      price: Math.random() * 200,
      quantity: Math.floor(Math.random() * 50) + 1,
    });
  }

  await prisma.printed_models.createMany({
    data: printedModels,
    skipDuplicates: true,
  });
}

main()
  .then(() => {
    console.log("Printed Models seeding successful");
  })
  .catch((e) => {
    console.error("Error seeding Printed Models", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
