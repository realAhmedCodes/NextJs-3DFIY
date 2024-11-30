const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedPrinters() {
  const printers = [
    { location: "Karachi", name: "Printer 1", printer_type: "FDM", materials: ["PLA", "ABS"], price: 500 },
    { location: "Lahore", name: "Printer 2", printer_type: "SLA", materials: ["Resin"], price: 800 },
    { location: "Islamabad", name: "Printer 3", printer_type: "FDM", materials: ["PLA", "PETG"], price: 650 },
    { location: "Karachi", name: "Printer 4", printer_type: "FDM", materials: ["ABS", "TPU"], price: 700 },
    { location: "Lahore", name: "Printer 5", printer_type: "SLA", materials: ["Resin"], price: 1200 },
    { location: "Islamabad", name: "Printer 6", printer_type: "FDM", materials: ["PLA", "PETG"], price: 750 },
    { location: "Karachi", name: "Printer 7", printer_type: "SLA", materials: ["Resin"], price: 1500 },
    { location: "Lahore", name: "Printer 8", printer_type: "FDM", materials: ["PLA", "ABS"], price: 900 },
    { location: "Islamabad", name: "Printer 9", printer_type: "FDM", materials: ["TPU", "PLA"], price: 800 },
    { location: "Karachi", name: "Printer 10", printer_type: "SLA", materials: ["Resin", "ABS"], price: 1300 },
    { location: "Lahore", name: "Printer 11", printer_type: "FDM", materials: ["PLA", "PETG"], price: 950 },
    { location: "Islamabad", name: "Printer 12", printer_type: "FDM", materials: ["ABS", "PLA"], price: 600 },
    { location: "Karachi", name: "Printer 13", printer_type: "SLA", materials: ["Resin"], price: 1100 },
    { location: "Lahore", name: "Printer 14", printer_type: "FDM", materials: ["PLA", "TPU"], price: 800 },
    { location: "Islamabad", name: "Printer 15", printer_type: "SLA", materials: ["Resin", "PLA"], price: 1400 },
  ];

  await prisma.printers.createMany({
    data: printers,
    skipDuplicates: true,
  });

  console.log("Printers seeding completed.");
}

module.exports = seedPrinters;
