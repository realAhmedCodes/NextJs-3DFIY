const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const Category = [
    { name: "Art & Entertainment" },
    { name: "Characters", parent_category_id: 1 },
    { name: "Objects", parent_category_id: 1 },
    { name: "Environments", parent_category_id: 1 },
    { name: "Vehicles", parent_category_id: 1 },
    { name: "Animals", parent_category_id: 2 },
    { name: "People", parent_category_id: 2 },
    { name: "Mythical creatures", parent_category_id: 2 },
    { name: "Furniture", parent_category_id: 3 },
    { name: "Props", parent_category_id: 3 },
    { name: "Decorations", parent_category_id: 3 },
    { name: "Landscapes", parent_category_id: 4 },
    { name: "Buildings", parent_category_id: 4 },
    { name: "Interiors", parent_category_id: 4 },
    { name: "Cars", parent_category_id: 5 },
    { name: "Airplanes", parent_category_id: 5 },
    { name: "Spaceships", parent_category_id: 5 },
    { name: "Architecture & Engineering" },
    { name: "Buildings", parent_category_id: 18 },
    { name: "Furniture", parent_category_id: 18 },
    { name: "Products", parent_category_id: 18 },
    { name: "Mechanical parts", parent_category_id: 18 },
    { name: "Residential", parent_category_id: 19 },
    { name: "Commercial", parent_category_id: 19 },
    { name: "Industrial", parent_category_id: 19 },
    { name: "Chairs", parent_category_id: 20 },
    { name: "Tables", parent_category_id: 20 },
    { name: "Beds", parent_category_id: 20 },
    { name: "Electronics", parent_category_id: 21 },
    { name: "Appliances", parent_category_id: 21 },
    { name: "Tools", parent_category_id: 21 },
    { name: "Gears", parent_category_id: 22 },
    { name: "Pistons", parent_category_id: 22 },
    { name: "Valves", parent_category_id: 22 },
    { name: "Fashion & Design" },
    { name: "Clothing", parent_category_id: 35 },
    { name: "Jewelry", parent_category_id: 35 },
    { name: "Accessories", parent_category_id: 35 },
    { name: "Shirts", parent_category_id: 36 },
    { name: "Dresses", parent_category_id: 36 },
    { name: "Shoes", parent_category_id: 36 },
    { name: "Rings", parent_category_id: 37 },
    { name: "Necklaces", parent_category_id: 37 },
    { name: "Earrings", parent_category_id: 37 },
    { name: "Bags", parent_category_id: 38 },
    { name: "Hats", parent_category_id: 38 },
    { name: "Watches", parent_category_id: 38 },
    { name: "Science & Education" },
    { name: "Anatomy models", parent_category_id: 48 },
    { name: "Scientific equipment", parent_category_id: 48 },
    { name: "Historical artifacts", parent_category_id: 48 },
    { name: "Educational models", parent_category_id: 48 },
    { name: "Human body", parent_category_id: 49 },
    { name: "Animals", parent_category_id: 49 },
    { name: "Plants", parent_category_id: 49 },
    { name: "Microscopes", parent_category_id: 50 },
    { name: "Telescopes", parent_category_id: 50 },
    { name: "Robots", parent_category_id: 50 },
    { name: "Buildings", parent_category_id: 51 },
    { name: "Tools", parent_category_id: 51 },
    { name: "Weapons", parent_category_id: 51 },
    { name: "Molecules", parent_category_id: 52 },
    { name: "Planets", parent_category_id: 52 },
    { name: "Ecosystems", parent_category_id: 52 },
    { name: "Gaming & VR" },
    { name: "Characters", parent_category_id: 65 },
    { name: "Environments", parent_category_id: 65 },
    { name: "Objects", parent_category_id: 65 },
    { name: "Vehicles", parent_category_id: 65 },
    { name: "Players", parent_category_id: 66 },
    { name: "Enemies", parent_category_id: 66 },
    { name: "NPCs", parent_category_id: 66 },
    { name: "Levels", parent_category_id: 67 },
    { name: "Worlds", parent_category_id: 67 },
    { name: "Landscapes", parent_category_id: 67 },
    { name: "Weapons", parent_category_id: 68 },
    { name: "Tools", parent_category_id: 68 },
    { name: "Props", parent_category_id: 68 },
    { name: "Cars", parent_category_id: 69 },
    { name: "Spaceships", parent_category_id: 69 },
    { name: "Airplanes", parent_category_id: 69 },
  ];

  await prisma.category.createMany({
    data: Category,
    skipDuplicates: true, // Skip categories that already exist
  });
}

main()
  .then(() => {
    console.log("Seeding successful");
  })
  .catch((e) => {
    console.error("Error seeding", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
