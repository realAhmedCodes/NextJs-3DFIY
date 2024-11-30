const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedDesigners() {
  const designers = [
    { user_id: 1, cnic_number: "12345-6789012-3", bio: "A passionate automotive designer with 10+ years of experience.", ratings: 4, balance: 0 },
    { user_id: 2, cnic_number: "23456-7890123-4", bio: "Expert in architectural designs, creating modern and innovative structures.", ratings: 5, balance: 0 },
    { user_id: 3, cnic_number: "34567-8901234-5", bio: "Digital artist specializing in 3D modeling and rendering for entertainment industry.", ratings: 3, balance: 0 },
    { user_id: 4, cnic_number: "45678-9012345-6", bio: "Designing digital assets for the gaming industry, bringing virtual worlds to life.", ratings: 4, balance: 0 },
    { user_id: 5, cnic_number: "56789-0123456-7", bio: "Passionate about product design with a keen eye for user experience.", ratings: 4, balance: 0 },
    { user_id: 6, cnic_number: "67890-1234567-8", bio: "Specializes in 3D character design for animations and games.", ratings: 5, balance: 0 },
    { user_id: 7, cnic_number: "78901-2345678-9", bio: "Architectural designer with a focus on sustainable, eco-friendly structures.", ratings: 3, balance: 0 },
    { user_id: 8, cnic_number: "89012-3456789-0", bio: "Focused on interactive media and VR experiences.", ratings: 5, balance: 0 },
    { user_id: 9, cnic_number: "90123-4567890-1", bio: "Creating high-quality 3D models for e-commerce platforms.", ratings: 4, balance: 0 },
    { user_id: 10, cnic_number: "01234-5678901-2", bio: "A designer with a flair for creating futuristic 3D models for films.", ratings: 4, balance: 0 },
    { user_id: 11, cnic_number: "12345-6789012-3", bio: "Building virtual models for simulations and industrial applications.", ratings: 3, balance: 0 },
    { user_id: 12, cnic_number: "23456-7890123-4", bio: "Creating conceptual product designs, focusing on usability and innovation.", ratings: 4, balance: 0 },
    { user_id: 13, cnic_number: "34567-8901234-5", bio: "Expert in vehicle interior design, with an emphasis on ergonomics and functionality.", ratings: 5, balance: 0 },
    { user_id: 14, cnic_number: "45678-9012345-6", bio: "3D modeler for educational content, bringing complex concepts to life in a simple manner.", ratings: 4, balance: 0 },
    { user_id: 15, cnic_number: "56789-0123456-7", bio: "Industrial designer focused on consumer electronics and tech gadgets.", ratings: 5, balance: 0 }
  ];

  await prisma.designers.createMany({
    data: designers,
    skipDuplicates: true,
  });

  console.log("Designers seeding completed.");
}

module.exports = seedDesigners;
