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
import pool from "../lib/db"; // Ensure this is the correct path to your db.js

export async function storeOTP(email, otp, expiry) {
  try {
    await pool.query(
      `INSERT INTO otp (email, otp, expiry) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET otp = $2, expiry = $3`,
      [email, otp, new Date(expiry)]
    );
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
    return result.rows[0];
  } catch (error) {
    console.error("Error retrieving OTP:", error);
    throw new Error("Error retrieving OTP");
  }
}

export async function deleteOTP(email) {
  try {
    await pool.query(`DELETE FROM otp WHERE email = $1`, [email]);
  } catch (error) {
    console.error("Error deleting OTP:", error);
    throw new Error("Error deleting OTP");
  }
}
