import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { keyword, category, minPrice, maxPrice, tags, sortBy } = req.query;

    try {
      const models = await prisma.models.findMany({
        where: {
          AND: [
            keyword
              ? {
                  OR: [
                    { name: { contains: keyword, mode: "insensitive" } },
                    { description: { contains: keyword, mode: "insensitive" } },
                  ],
                }
              : {},
            category
              ? {
                  Category: {
                    name: { equals: category, mode: "insensitive" },
                  },
                }
              : {},
            minPrice
              ? {
                  price: { gte: parseFloat(minPrice) },
                }
              : {},
            maxPrice
              ? {
                  price: { lte: parseFloat(maxPrice) },
                }
              : {},
            tags
              ? {
                  tags: {
                    hasSome: tags.split(","),
                  },
                }
              : {},
          ],
        },
        orderBy: sortBy
          ? {
              [sortBy]: "asc",
            }
          : {},
        include: {
          Category: true,
          Designers: true,
        },
      });

      res.status(200).json(models);
    } catch (error) {
      console.error("Error fetching models:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
