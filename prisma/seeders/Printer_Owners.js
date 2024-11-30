const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedPrinterOwners() {
  const printerOwners = [
    { user_id: 1, cnic_number: "12345-6789012-3", bio: "Experienced 3D printing expert.", ratings: 4, balance: 250.0 },
    { user_id: 2, cnic_number: "23456-7890123-4", bio: "Specializes in high-quality prints and rapid prototyping.", ratings: 5, balance: 500.0 },
    { user_id: 3, cnic_number: "34567-8901234-5", bio: "Experienced in FDM and SLA printing.", ratings: 3, balance: 150.0 },
    { user_id: 4, cnic_number: "45678-9012345-6", bio: "Providing custom 3D printing services with a focus on quality.", ratings: 4, balance: 400.0 },
    { user_id: 5, cnic_number: "56789-0123456-7", bio: "Offering 3D printing solutions for both small and large scale projects.", ratings: 5, balance: 450.0 },
    { user_id: 6, cnic_number: "67890-1234567-8", bio: "Professional with a focus on precise 3D modeling and printing.", ratings: 4, balance: 300.0 },
    { user_id: 7, cnic_number: "78901-2345678-9", bio: "Focused on rapid prototyping and high-quality prints.", ratings: 4, balance: 550.0 },
    { user_id: 8, cnic_number: "89012-3456789-0", bio: "Certified 3D printing expert, specializing in industrial-grade prints.", ratings: 5, balance: 600.0 },
    { user_id: 9, cnic_number: "90123-4567890-1", bio: "Expert in both SLA and FDM 3D printing technologies.", ratings: 3, balance: 220.0 },
    { user_id: 10, cnic_number: "01234-5678901-2", bio: "Affordable and fast 3D printing solutions for every need.", ratings: 5, balance: 500.0 },
    { user_id: 11, cnic_number: "12345-6789012-4", bio: "Experienced in architectural and industrial 3D printing.", ratings: 4, balance: 250.0 },
    { user_id: 12, cnic_number: "23456-7890123-5", bio: "Innovative solutions in 3D printing, catering to the latest technologies.", ratings: 3, balance: 300.0 },
    { user_id: 13, cnic_number: "34567-8901234-6", bio: "A professional 3D printer with a focus on design and prototypes.", ratings: 4, balance: 400.0 },
    { user_id: 14, cnic_number: "45678-9012345-7", bio: "Innovative 3D printing solutions with a focus on customer satisfaction.", ratings: 5, balance: 450.0 },
    { user_id: 15, cnic_number: "56789-0123456-8", bio: "Offering premium 3D printing services with high accuracy.", ratings: 4, balance: 500.0 },
  ];

  await prisma.printer_Owners.createMany({
    data: printerOwners,
    skipDuplicates: true,
  });

  console.log("Printer Owners seeding completed.");
}

module.exports = seedPrinterOwners;
