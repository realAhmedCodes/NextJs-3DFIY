// app/api/auth/reset-password/route.js

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, newPassword } = await req.json();

    // Check if the email exists
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: 'No user found with this email.' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await prisma.users.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      { message: 'Password reset successful.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ error: 'Failed to reset password.' }, { status: 500 });
  }
}
