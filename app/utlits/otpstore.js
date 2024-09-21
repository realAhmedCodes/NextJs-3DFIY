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

import pool from "../lib/db";

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function storeOTP(email, otp, expiry) {
  try {
    await pool.query(
      `INSERT INTO otp (email, otp, expiry)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) 
       DO UPDATE SET otp = EXCLUDED.otp, expiry = EXCLUDED.expiry`,
      [email, otp, new Date(expiry)]
    );
    console.log(`[DEBUG] Stored OTP in database for ${email}: ${otp}`);
  } catch (error) {
    console.error("Error storing OTP:", error);
    throw new Error("Error storing OTP");
  }
}

export async function retrieveOTP(email) {
  try {
    const result = await pool.query(
      `SELECT otp, expiry FROM otp WHERE email = $1`,
      [email]
    );
    console.log(`[DEBUG] Retrieved OTP for ${email}: ${result.rows[0].otp}`);
    return result.rows[0];
  } catch (error) {
    console.error("Error retrieving OTP:", error);
    throw new Error("Error retrieving OTP");
  }
}

export async function deleteOTP(email) {
  try {
    await pool.query(`DELETE FROM otp WHERE email = $1`, [email]);
    console.log(`[DEBUG] Deleted OTP for ${email}`);
  } catch (error) {
    console.error("Error deleting OTP:", error);
    throw new Error("Error deleting OTP");
  }
}
