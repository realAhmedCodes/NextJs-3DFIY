// app/api/otp/verify/route.js

import { NextResponse } from 'next/server';
import { retrieveOTP, deleteOTP } from '@/app/utlits/otpstore';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    console.log(email, otp);
    

    // Retrieve the stored OTP for the email
    const storedOTPRecord = await retrieveOTP(email);

    if (!storedOTPRecord) {
      return NextResponse.json(
        { error: 'No OTP found for this email.' },
        { status: 400 }
      );
    }

    // Check if the OTP has expired
    if (storedOTPRecord.expiry < new Date()) {
      // Delete the expired OTP
      await deleteOTP(email);
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check if the OTP matches
    if (storedOTPRecord.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP. Please try again.' },
        { status: 400 }
      );
    }

    // OTP is valid, delete it
    await deleteOTP(email);

    // Mark the user as verified in the database
    await prisma.users.update({
      where: { email },
      data: { is_verified: true },
    });

    return NextResponse.json(
      { message: 'OTP verified successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during OTP verification:', error);
    return NextResponse.json({ error: 'Failed to verify OTP.' }, { status: 500 });
  }
}
