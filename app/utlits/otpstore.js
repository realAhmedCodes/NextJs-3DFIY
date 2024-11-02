// utils/otpStore.js
/*
const otpStore = {};

export function storeOTP(email, otp, expiry) {
  otpStore[email] = { otp, expiry };
  console.log("OTP stored:", email, otpStore[email]);
}

export function retrieveOTP(email) {
  return otpStore[email];
}

export function deleteOTP(email) {
  delete otpStore[email];
}
*/
// app/utils/otpstore.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
}

export async function storeOTP(email, otp, expiry) {
  try {
    await prisma.otp.upsert({
      where: { email },
      update: {
        otp,
        expiry: new Date(expiry),
      },
      create: {
        email,
        otp,
        expiry: new Date(expiry),
      },
    });
    console.log(`[DEBUG] Stored OTP in database for ${email}: ${otp}`);
  } catch (error) {
    console.error('Error storing OTP:', error);
    throw new Error('Error storing OTP');
  }
}

export async function retrieveOTP(email) {
  try {
    const result = await prisma.otp.findUnique({
      where: { email },
    });
    if (result) {
      console.log(`[DEBUG] Retrieved OTP for ${email}: ${result.otp}`);
      return result;
    } else {
      console.log(`[DEBUG] No OTP found for ${email}`);
      return null;
    }
  } catch (error) {
    console.error('Error retrieving OTP:', error);
    throw new Error('Error retrieving OTP');
  }
}

export async function deleteOTP(email) {
  try {
    await prisma.otp.delete({
      where: { email },
    });
    console.log(`[DEBUG] Deleted OTP for ${email}`);
  } catch (error) {
    console.error('Error deleting OTP:', error);
    throw new Error('Error deleting OTP');
  }
}
