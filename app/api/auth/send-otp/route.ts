import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import clientPromise from '@/lib/mongodb';
import Otp from '@/models/Otp';
import dns from 'node:dns';

// Force IPv4 resolution to prevent querySrv ECONNREFUSED on some ISPs
dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Connect to DB via mongoose
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!, {
        family: 4,
        serverSelectionTimeoutMS: 5000,
      });
    }

    // Generate 6 digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete existing OTPs for this email
    await Otp.deleteMany({ email });

    // Save new OTP
    await Otp.create({ email, otp: otpCode });

    // Send email using Nodemailer
    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
      await transporter.sendMail({
        from: `"Resume Builder" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: 'Your Verification Code',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Verification Code</h2>
            <p>Your single-use verification code is: <strong style="font-size: 24px;">${otpCode}</strong></p>
            <p>This code will expire in 5 minutes.</p>
          </div>
        `,
      });
    } else {
      console.log('NO SMTP CREDENTIALS, OTP IS:', otpCode);
    }

    return NextResponse.json({ success: true, message: 'OTP sent' });
  } catch (error: any) {
    console.error('OTP Send Error:', error);
    return NextResponse.json({ error: `Server Error: ${error.message || String(error)}` }, { status: 500 });
  }
}
