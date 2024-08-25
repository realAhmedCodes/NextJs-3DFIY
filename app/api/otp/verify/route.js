/*import { NextResponse } from "next/server";

// OTP store (in-memory, but should be in a database for production)
const otpStore = {}; // This should be moved to a shared file or database

// Handle OTP verification
export async function POST(req) {
  const { email, otp } = await req.json();
  console.log(otp, email)

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
    delete otpStore[email]; // Remove the OTP after successful verification
    return NextResponse.json({
      message: "OTP verified, authentication successful",
    });
  } else {
    return NextResponse.json({ message: "Invalid OTP" }, { status: 401 });
  }
}
*/
/*
import { NextResponse } from "next/server";
import { storeOTP, deleteOTP, retrieveOTP } from "@/app/utlits/otpstore";// Import from the shared module

export async function POST(req) {
  const { email, otp } = await req.json();
  console.log(otp, email);


const storedData = retrieveOTP(email);
console.log("Retrieved OTP data for email:", email, storedData);


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
    deleteOTP(email); // Remove the OTP after successful verification
    return NextResponse.json({
      message: "OTP verified, authentication successful",
    });
  } else {
    return NextResponse.json({ message: "Invalid OTP" }, { status: 401 });
  }
}
*/

import { NextResponse } from "next/server";
//import { retrieveOTP, deleteOTP } from "@/app/utils/otpStore";
import { storeOTP, deleteOTP, retrieveOTP } from "@/app/utlits/otpstore"; // Adjust the path if necessary

export async function POST(req) {
  const { email, otp } = await req.json();
  console.log("Received OTP and email:", otp, email);

  const storedData = await retrieveOTP(email);

  if (!storedData) {
    return NextResponse.json(
      { message: "No OTP found for this email" },
      { status: 401 }
    );
  }

  if (Date.now() > new Date(storedData.expiry).getTime()) {
    return NextResponse.json({ message: "OTP expired" }, { status: 401 });
  }

  if (storedData.otp === otp) {
    await deleteOTP(email); // Remove the OTP after successful verification
    return NextResponse.json({
      message: "OTP verified, authentication successful",
    });
  } else {
    return NextResponse.json({ message: "Invalid OTP" }, { status: 401 });
  }
}
