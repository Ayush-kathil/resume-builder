import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import mongoose from "mongoose";
import Otp from "@/models/Otp";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import WelcomeEmail from "@/emails/WelcomeEmail";
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
    const { email, otp, password } = await request.json();

    if (!email || !otp || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // Connect to DB if needed for Mongoose
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!, {
        family: 4,
        serverSelectionTimeoutMS: 5000,
      });
    }

    // Validate OTP
    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // Check if user already exists
    const client = await clientPromise;
    const db = client.db();
    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      emailVerified: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Delete used OTP
    await Otp.deleteOne({ _id: validOtp._id });

    // Send Welcome Email
    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
      try {
        const emailHtml = await render(React.createElement(WelcomeEmail, { userName: email.split('@')[0] }));
        
        await transporter.sendMail({
          from: `"Resume Builder" <${process.env.SMTP_EMAIL}>`,
          to: email,
          subject: 'Welcome to the Future of Resumes',
          html: emailHtml,
        });
      } catch (err) {
        console.error("Welcome email failed to send via SMTP", err);
      }
    } else {
      console.log('NO SMTP CREDENTIALS, WELCOME EMAIL NOT SENT');
    }

    return NextResponse.json({ success: true, userId: result.insertedId });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
