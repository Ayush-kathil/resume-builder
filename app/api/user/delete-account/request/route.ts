import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import Otp from "@/models/Otp";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import AccountDeletionEmail from "@/emails/AccountDeletionEmail";
import React from 'react';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!, {
        family: 4,
        serverSelectionTimeoutMS: 5000,
      });
    }

    const email = session.user.email;
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove any existing OTPs for this user
    await Otp.deleteMany({ email });

    await Otp.create({ email, otp: otpCode });

    // Send OTP Email
    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
      try {
        const emailHtml = await render(
          React.createElement(AccountDeletionEmail, {
            userName: email.split('@')[0],
            otp: otpCode,
          })
        );
        
        await transporter.sendMail({
          from: `"Resume Maker Security" <${process.env.SMTP_EMAIL}>`,
          to: email,
          subject: 'Account Deletion Verification Code',
          html: emailHtml,
        });
      } catch (err) {
        console.error("Deletion email failed to send", err);
        return NextResponse.json({ error: "Failed to send OTP email" }, { status: 500 });
      }
    } else {
      console.log('NO SMTP CREDENTIALS, LOGGING OTP FOR DELETION:', otpCode);
      return NextResponse.json({ error: "Email configuration missing" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error: any) {
    console.error("Delete request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
