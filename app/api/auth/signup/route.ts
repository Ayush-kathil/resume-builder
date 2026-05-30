import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import mongoose from "mongoose";
import Otp from "@/models/Otp";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Trigger Resend Automation
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.automations.create({
          name: 'Welcome series',
          steps: [
            {
              key: 'start',
              type: 'trigger',
              config: { eventName: 'user.created' },
            },
            {
              key: 'welcome',
              type: 'send_email',
              config: {
                template: {
                  id: '044db673-fff6-420f-a566-f6aba05d60e7',
                },
              },
            },
          ],
          connections: [{ from: 'start', to: 'welcome' }],
        });
      } catch (err) {
        console.error("Resend automation failed to trigger", err);
      }
    }

    return NextResponse.json({ success: true, userId: result.insertedId });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
