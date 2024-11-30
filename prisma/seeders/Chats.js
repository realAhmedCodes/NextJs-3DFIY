const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedChats() {
  const chats = [
    { user_1_id: 1, user_2_id: 2, messages: ["Hi, I need a 3D model for a car.", "Sure! I can help you with that."] },
    { user_1_id: 3, user_2_id: 4, messages: ["Are you available for a printing project?", "Yes, I can take it on."] },
    { user_1_id: 5, user_2_id: 6, messages: ["I need an SLA printer for a new project.", "I have a few models that fit your needs."] },
    { user_1_id: 7, user_2_id: 8, messages: ["Do you have a 3D model for mechanical parts?", "Yes, I do. Let me show you."] },
    { user_1_id: 9, user_2_id: 10, messages: ["Can you print an architectural model?", "Absolutely, let's discuss the details."] },
    { user_1_id: 11, user_2_id: 12, messages: ["I want to try resin printing for a project.", "Resin printing is great for fine details, let's get started."] },
    { user_1_id: 13, user_2_id: 14, messages: ["Do you offer customization services?", "Yes, I can help you design a custom 3D model."] },
    { user_1_id: 15, user_2_id: 1, messages: ["Looking for a 3D model for a mechanical part.", "I have some options for you. Let’s get started."] },
    { user_1_id: 2, user_2_id: 3, messages: ["Are you available for a 3D rendering project?", "I’m free this weekend. Let’s chat more about it."] },
    { user_1_id: 4, user_2_id: 5, messages: ["How soon can you deliver the print?", "It should take about two days depending on the complexity."] },
    { user_1_id: 6, user_2_id: 7, messages: ["Can you help me with a prototype?", "Of course, let’s discuss the requirements."] },
    { user_1_id: 8, user_2_id: 9, messages: ["Do you offer overnight printing services?", "Yes, we can do overnight delivery for some models."] },
    { user_1_id: 10, user_2_id: 11, messages: ["I need a 3D print for a client’s prototype.", "I’ll get started on it right away."] },
    { user_1_id: 12, user_2_id: 13, messages: ["Do you have availability for an architectural model?", "I do, I’ll send you some sample work."] },
    { user_1_id: 14, user_2_id: 15, messages: ["Can you print parts with multiple materials?", "Yes, we can print with mixed materials like PLA and TPU."] },
  ];

  await prisma.chats.createMany({
    data: chats,
    skipDuplicates: true,
  });

  console.log("Chats seeding completed.");
}

module.exports = seedChats;
