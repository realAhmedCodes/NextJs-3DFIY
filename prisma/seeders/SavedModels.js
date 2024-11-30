const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const savedModels = [];

  for (let i = 1; i <= 30; i++) {
    savedModels.push({
      model_id: Math.floor(Math.random() * 30) + 1, // Model IDs 1-30
      user_id: Math.floor(Math.random() * 30) + 1,  // User IDs 1-30
      saved: true,
    });
  }

  await prisma.savedModels.createMany({
    data: savedModels,
    skipDuplicates: true,
  });
}

main()
  .then(() => {
    console.log("Saved Models seeding successful");
  })
  .catch((e) => {
    console.error("Error seeding Saved Models", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
