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
  service: "gmail", // Or any other email service provider
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
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
  const { path } = req.nextUrl;

  if ( req.url.endsWith("/generate")) {
    const { email } = await req.json();
    console.log("Received email:", email);

    const otp = generateOTP();
    await sendOTPEmail(email, otp);

    // Store the OTP with a timestamp for expiry (e.g., valid for 5 minutes)
    otpStore[email] = {
      otp,
      expiry: Date.now() + 5 * 60 * 1000, // 5 minutes from now
    };

    return NextResponse.json({ message: "OTP sent to your email" });
  } else if (path === "/api/otp/verify") {
    // Handle OTP verification
    const { email, otp } = await req.json();

    const storedData = otpStore[email];

    if (!storedData) {
      return NextResponse.json(
        { message: "No OTP found for this email" },
        { status: 401 }
      );
    }

    if (Date.now() > storedData.expiry) {
      return NextResponse.json({ message: "OTP expired" }, { status: 401 });
    }

    if (storedData.otp === otp) {
      // OTP matches, authenticate the user
      delete otpStore[email]; // Remove the OTP after successful verification
      return NextResponse.json({
        message: "OTP verified, authentication successful",
      });
    } else {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 401 });
    }
  } else {
    return NextResponse.json({ message: "Invalid endpoint" }, { status: 404 });
  }
}
*/