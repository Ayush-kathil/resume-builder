import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import clientPromise from '@/lib/mongodb';
import Otp from '@/models/Otp';
import dns from 'node:dns';

// Force IPv4 resolution to prevent querySrv ECONNREFUSED on some ISPs
dns.setDefaultResultOrder('ipv4first');

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Send email using Resend
    if (process.env.RESEND_API_KEY) {
      const { data, error } = await resend.emails.send({
        from: 'Resume Builder <onboarding@resend.dev>',
        to: [email],
        subject: 'Your Login Code',
        html: `<p>Your single-use login code is: <strong>${otpCode}</strong></p><p>This code will expire in 5 minutes.</p>`,
      });

      if (error) {
        console.error('Resend Error:', error);
        return NextResponse.json({ error: `Resend Error: ${error.message}` }, { status: 500 });
      }
    } else {
      console.log('NO RESEND API KEY, OTP IS:', otpCode);
    }

    return NextResponse.json({ success: true, message: 'OTP sent' });
  } catch (error: any) {
    console.error('OTP Send Error:', error);
    return NextResponse.json({ error: `Server Error: ${error.message || String(error)}` }, { status: 500 });
  }
}
