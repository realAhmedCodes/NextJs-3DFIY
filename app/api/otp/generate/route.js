// app/api/otp/generate/route.js

import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { generateOTP, storeOTP } from '@/app/utlits/otpstore';

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
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
    html: `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Static Template</title>

    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body
    style="
      margin: 0;
      font-family: 'Poppins', sans-serif;
      background: #ffffff;
      font-size: 14px;
    "
  >
    <div
      style="
        max-width: 680px;
        margin: 0 auto;
        padding: 45px 30px 60px;
        background-color: #171717;
        font-size: 14px;
        color: #434343;
      "
    >
      <header>
          <div style="display: flex; align-items: center; justify-content: center; width: 100%;">
            <img
              alt="3Dify Logo"
              src="https://i.ibb.co/MGSDpby/Untitled-1.png"
              style="margin: 0 auto;"
              height="50px"
            />  
          </div>
      </header>

      <main>
        <div
          style="
            margin: 0;
            margin-top: 70px;
            padding: 92px 30px 115px;
            background: #ffffff;
            border-radius: 30px;
            text-align: center;
          "
        >
          <div style="width: 100%; max-width: 489px; margin: 0 auto;">
            <h1
              style="
                margin: 0;
                font-size: 24px;
                font-weight: 500;
                color: #1f1f1f;
              "
            >
              3Dify Email Verification
            </h1>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-size: 16px;
                font-weight: 500;
              "
            >
              Hello <span style="font-weight: 600; color: #171717; text-transform: capitalize">${name}</span>,
            </p>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-weight: 500;
                letter-spacing: 0.56px;
              "
            >
              Thank you for registering with 3Dify. Use the following OTP
              to complete the registration process. OTP is
              valid for
              <span style="font-weight: 600; color: #1f1f1f;">30 minutes</span>.
              Do not share this code with others, including <span style="font-weight: 600; color: #1f1f1f;">Mercurius Inc. or 3Dify</span>
              employees.
            </p>
            <p
              style="
                margin: 0;
                margin-top: 60px;
                font-size: 40px;
                font-weight: 600;
                letter-spacing: 25px;
                color: #171717;
              "
            >
              ${otp}
            </p>
          </div>
        </div>

        <p
          style="
            max-width: 400px;
            margin: 0 auto;
            margin-top: 90px;
            text-align: center;
            font-weight: 500;
            color: #8c8c8c;
          "
        >
          Need help? Ask at
          <a
            href="mailto:acontact@mercurius-inc.com"
            style="color: #fafafa; text-decoration: none;"
            >contact@mercurius-inc.com</a
          >
          or visit our
          <a
            href=""
            target="_blank"
            style="color: #fafafa; text-decoration: none;"
            >Help Center</a
          >
        </p>
      </main>

      <footer
        style="
          width: 100%;
          max-width: 490px;
          margin: 20px auto 0;
          text-align: center;
          border-top: 1px solid #e6ebf1;
        "
      >
        <p
          style="
            margin: 0;
            margin-top: 40px;
            font-size: 16px;
            font-weight: 600;
            color: #fafafa;
          "
        >
          Mercurius Inc
        </p>
        <div style="margin: 0; margin-top: 16px;">
          <a href="#" target="_blank" style="display: inline-block;">
            <img
              width="36px"
              alt="Facebook"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"
            />
          </a>
          <a
            href="#"
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Instagram"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"
          /></a>
          <a
            href="#"
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Twitter"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter"
            />
          </a>
          <a
            href="#"
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Youtube"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube"
          /></a>
        </div>
        <p style="margin: 0; margin-top: 16px; color: #434343;">
          Copyright © 2024 Mercurius Inc. All rights reserved.
        </p>
      </footer>
    </div>
  </body>
</html>
`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending OTP email');
  }
}

export async function POST(req) {
  try {
    const { email, name } = await req.json();

    // Step 1: Generate OTP
    const otp = generateOTP();
    console.log(`[DEBUG] Generated OTP for ${email}: ${otp}`);


    await sendOTPEmail(email, otp, name);
    console.log(`[DEBUG] Sent OTP email to ${email}: ${otp}`);

    const expiry = Date.now() + 30 * 60 * 1000;
    await storeOTP(email, otp, expiry);
    console.log(`[DEBUG] Stored OTP for ${email}: ${otp}`);

    return NextResponse.json(
      { message: 'OTP sent to your email' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during OTP generation or sending:', error);
    return NextResponse.json({ error: 'Failed to send OTP.' }, { status: 500 });
  }
}
