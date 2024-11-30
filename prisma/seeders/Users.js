// /prisma/seeders/users.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedUsers() {
  const users = [
    { name: "Ali Khan", username: "alikhan", location: "Karachi, Pakistan", email: "alikhan@example.com", profile_pic: "profile1.jpg", password: await bcrypt.hash("password", 10), phoneNo: "+923001234567", sellerType: "Printer Owner", is_verified: true },
    { name: "Sara Ali", username: "saraali", location: "Lahore, Pakistan", email: "saraali@example.com", profile_pic: "profile2.jpg", password: await bcrypt.hash("password456", 10), phoneNo: "+923002345678", sellerType: "Printer Owner", is_verified: true },
    { name: "Zainab Hussain", username: "zainabhussain", location: "Islamabad, Pakistan", email: "zainabhussain@example.com", profile_pic: "profile3.jpg", password: await bcrypt.hash("password789", 10), phoneNo: "+923003456789", sellerType: "Printer Owner", is_verified: false },
    { name: "Imran Shah", username: "imranshah", location: "Karachi, Pakistan", email: "imranshah@example.com", profile_pic: "profile4.jpg", password: await bcrypt.hash("password", 10), phoneNo: "+923004567890", sellerType: "Designer", is_verified: true },
    { name: "Hina Khan", username: "hinakhan", location: "Lahore, Pakistan", email: "hinakhan@example.com", profile_pic: "profile5.jpg", password: await bcrypt.hash("password456", 10), phoneNo: "+923005678901", sellerType: "Designer", is_verified: true },
    { name: "Usman Malik", username: "usmanmalik", location: "Islamabad, Pakistan", email: "usmanmalik@example.com", profile_pic: "profile6.jpg", password: await bcrypt.hash("password789", 10), phoneNo: "+923006789012", sellerType: "Printer Owner", is_verified: false },
    { name: "Rida Bukhari", username: "ridabukhari", location: "Karachi, Pakistan", email: "ridabukhari@example.com", profile_pic: "profile7.jpg", password: await bcrypt.hash("password", 10), phoneNo: "+923007890123", sellerType: "Designer", is_verified: true },
    { name: "Shahzaib Khan", username: "shahzaibkhan", location: "Lahore, Pakistan", email: "shahzaibkhan@example.com", profile_pic: "profile8.jpg", password: await bcrypt.hash("password456", 10), phoneNo: "+923008901234", sellerType: "Printer Owner", is_verified: false },
    { name: "Madiha Aslam", username: "madihaaslam", location: "Islamabad, Pakistan", email: "madihaaslam@example.com", profile_pic: "profile9.jpg", password: await bcrypt.hash("password789", 10), phoneNo: "+923009012345", sellerType: "Printer Owner", is_verified: true },
    { name: "Faisal Iqbal", username: "faisaliqbal", location: "Karachi, Pakistan", email: "faisaliqbal@example.com", profile_pic: "profile10.jpg", password: await bcrypt.hash("password", 10), phoneNo: "+923010123456", sellerType: "Printer Owner", is_verified: true },
    { name: "Muneeb Ahmad", username: "muneebahmad", location: "Lahore, Pakistan", email: "muneebahmad@example.com", profile_pic: "profile11.jpg", password: await bcrypt.hash("password456", 10), phoneNo: "+923011234567", sellerType: "Designer", is_verified: false },
    { name: "Zehra Shah", username: "zehrashah", location: "Islamabad, Pakistan", email: "zehrashah@example.com", profile_pic: "profile12.jpg", password: await bcrypt.hash("password789", 10), phoneNo: "+923012345678", sellerType: "Printer Owner", is_verified: true },
    { name: "Arslan Khan", username: "arslankhan", location: "Karachi, Pakistan", email: "arslankhan@example.com", profile_pic: "profile13.jpg", password: await bcrypt.hash("password", 10), phoneNo: "+923013456789", sellerType: "Designer", is_verified: false },
    { name: "Sana Khan", username: "sanakhan", location: "Lahore, Pakistan", email: "sanakhan@example.com", profile_pic: "profile14.jpg", password: await bcrypt.hash("password456", 10), phoneNo: "+923014567890", sellerType: "Printer Owner", is_verified: true },
    { name: "Tariq Ahmed", username: "tariqahmed", location: "Islamabad, Pakistan", email: "tariqahmed@example.com", profile_pic: "profile15.jpg", password: await bcrypt.hash("password789", 10), phoneNo: "+923015678901", sellerType: "Designer", is_verified: true },
  ];

  await prisma.users.createMany({
    data: users,
    skipDuplicates: true,
  });

  console.log("Users seeding completed.");
}

module.exports = seedUsers;

