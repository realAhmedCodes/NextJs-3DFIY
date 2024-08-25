/*import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

// OTP store (in-memory, but should be in a database for production)
const otpStore = {};

// Function to generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Configure nodemailer with your email service
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send the OTP via email
async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// Handle OTP generation and sending
export async function POST(req) {
  const { email } = await req.json();
  console.log("Received email:", email);

  const otp = generateOTP();
  await sendOTPEmail(email, otp);

  otpStore[email] = {
    otp,
    expiry: Date.now() + 5 * 60 * 1000, // 5 minutes from now
  };

  return NextResponse.json({ message: "OTP sent to your email" });
}
*/
/*

import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { storeOTP, retrieveOTP, deleteOTP } from "@/app/utlits/otpstore"; // Import from the shared module

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export async function POST(req) {
  const { email } = await req.json();
  console.log("Received email:", email);

  const otp = generateOTP();
  await sendOTPEmail(email, otp);

  const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes from now
  storeOTP(email, otp, expiry); // Store the OTP using the shared store

  return NextResponse.json({ message: "OTP sent to your email" });
}
*/

import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
//import { storeOTP, deleteOTP, retrieveOTP } from "@/app/utlits/otpstore"; // Adjust the path if necessary
import { storeOTP, deleteOTP, retrieveOTP } from "@/app/utlits/otpstore"; 
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export async function POST(req) {
  const { email } = await req.json();
  console.log("Received email:", email);

  const otp = generateOTP();
  await sendOTPEmail(email, otp);

  const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes from now
  await storeOTP(email, otp, expiry); // Store the OTP in the database

  return NextResponse.json({ message: "OTP sent to your email" });
}
