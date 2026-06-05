import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import SecurityAlertEmail from "@/emails/SecurityAlertEmail";
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

    const { oldPassword, newPassword } = await request.json();

    if (!oldPassword || !newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: "Invalid input. New password must be at least 8 characters long." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection("users").findOne({ email: session.user.email });

    if (!user || !user.password) {
      return NextResponse.json({ error: "User not found or using OAuth provider." }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect old password." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.collection("users").updateOne(
      { email: session.user.email },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );

    // Send Security Alert Email
    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
      try {
        const emailHtml = await render(
          React.createElement(SecurityAlertEmail, {
            userName: user.name || session.user.email.split('@')[0],
            action: "Password Changed",
            time: new Date().toLocaleString(),
          })
        );
        
        await transporter.sendMail({
          from: `"Resume Maker Security" <${process.env.SMTP_EMAIL}>`,
          to: session.user.email,
          subject: 'Security Alert: Password Changed',
          html: emailHtml,
        });
      } catch (err) {
        console.error("Security email failed to send", err);
      }
    }

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (error: any) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
