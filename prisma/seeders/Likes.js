const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const likes = [];

  for (let i = 1; i <= 30; i++) {
    likes.push({
      model_id: Math.floor(Math.random() * 30) + 1, // Model IDs 1-30
      user_id: Math.floor(Math.random() * 30) + 1,  // User IDs 1-30
      liked: true,
    });
  }

  await prisma.likes.createMany({
    data: likes,
    skipDuplicates: true,
  });
}

main()
  .then(() => {
    console.log("Likes seeding successful");
  })
  .catch((e) => {
    console.error("Error seeding Likes", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
