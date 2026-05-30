import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import mongoose from "mongoose";
import Otp from "@/models/Otp";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, otp, password } = await request.json();

    if (!email || !otp || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

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

    // Check if user exists
    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "No account found with this email" }, { status: 404 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    await db.collection("users").updateOne(
      { email },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        } 
      }
    );

    // Delete used OTP
    await Otp.deleteOne({ _id: validOtp._id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
