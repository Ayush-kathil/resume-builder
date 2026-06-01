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
    const { email, type } = await req.json();

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

    // Connect to DB via native client for user check
    const client = await clientPromise;
    const db = client.db();
    const existingUser = await db.collection("users").findOne({ email });

    if (type === 'signup' && existingUser) {
      return NextResponse.json({ error: 'Email already registered. Please login.' }, { status: 400 });
    }

    if (type === 'reset' && !existingUser) {
      return NextResponse.json({ error: 'No account found with this email.' }, { status: 400 });
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
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 40px auto; padding: 40px; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 16px; color: #1a1a1a; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
            <h2 style="color: #1a1a1a; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 8px;">Security <span style="color: #3b82f6;">Verification</span></h2>
            <p style="color: #52525b; font-size: 15px; line-height: 24px; margin-bottom: 32px;">Please use the verification code below to securely log into your ResumeAI account.</p>
            
            <div style="background-color: #f9f9f9; border: 1px solid #e5e5e5; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
              <strong style="font-size: 36px; letter-spacing: 8px; color: #1a1a1a;">${otpCode}</strong>
            </div>
            
            <p style="color: #a1a1aa; font-size: 13px; margin-bottom: 0;">This code will expire in 5 minutes. If you didn't request this, you can safely ignore this email.</p>
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
