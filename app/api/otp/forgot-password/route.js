// app/api/otp/forgot-password/route.js

import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { generateOTP, storeOTP } from '@/app/utlits/otpstore';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendOTPEmail(email, otp, name) {
    const mailOptions = {
        from: "3dify@mercurius-inc.com",
        to: email,
        subject: 'Your OTP Code for Password Reset',
        text: `Your OTP code for password reset is ${otp}`,
        html: `
    <html>
      <body>
        <h3>Hello ${name},</h3>
        <p>You requested a password reset. Use the following OTP to reset your password:</p>
        <h1>${otp}</h1>
        <p>OTP is valid for 30 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </body>
    </html>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Error sending OTP email');
    }
}

export async function POST(req) {
    try {
        const { email, name } = await req.json();

        const user = await prisma.users.findUnique({
            where: { email: email },
            select: { email: true },
        });
        if (!user) {
            return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
        }

        const otp = generateOTP();
        console.log(`[DEBUG] Generated OTP for ${email}: ${otp}`);

        await sendOTPEmail(email, otp, name);
        console.log(`[DEBUG] Sent OTP email to ${email}`);

        const expiry = Date.now() + 30 * 60 * 1000; 
        await storeOTP(email, otp, expiry);
        console.log(`[DEBUG] Stored OTP for ${email}`);

        return NextResponse.json(
            { message: 'OTP sent to your email' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error during OTP generation or sending:', error);
        return NextResponse.json({ error: 'Failed to send OTP.' }, { status: 500 });
    }
}
