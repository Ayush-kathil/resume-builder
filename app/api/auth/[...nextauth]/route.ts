import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { Resend } from "resend";
import WelcomeEmail from "@/emails/WelcomeEmail";
import mongoose from "mongoose";
import Otp from "@/models/Otp";
import dns from "node:dns";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Force IPv4 resolution
dns.setDefaultResultOrder('ipv4first');

const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise) as any,
  providers: [
    CredentialsProvider({
      name: 'OTP',
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) return null;

        if (mongoose.connection.readyState !== 1) {
          await mongoose.connect(process.env.MONGODB_URI!, {
            family: 4,
            serverSelectionTimeoutMS: 5000,
          });
        }

        const validOtp = await Otp.findOne({
          email: credentials.email,
          otp: credentials.otp
        });

        if (!validOtp) throw new Error("Invalid or expired OTP");

        await Otp.deleteOne({ _id: validOtp._id });

        const client = await clientPromise;
        const db = client.db();
        let user = await db.collection("users").findOne({ email: credentials.email });

        if (!user) {
          const generatedPassword = crypto.randomBytes(6).toString('hex');
          const hashedPassword = await bcrypt.hash(generatedPassword, 10);

          const result = await db.collection("users").insertOne({
            email: credentials.email,
            password: hashedPassword,
            emailVerified: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          user = await db.collection("users").findOne({ _id: result.insertedId });

          // Send welcome email
          if (process.env.RESEND_API_KEY) {
            try {
              await resend.emails.send({
                from: 'Resume Builder <onboarding@resend.dev>',
                to: [credentials.email],
                subject: 'Welcome to the Future of Resumes',
                react: WelcomeEmail({ userName: credentials.email.split('@')[0], password: generatedPassword }),
              });
            } catch (err) {
              console.error("Welcome email failed", err);
            }
          }
        }

        return { id: user!._id.toString(), email: user!.email };
      }
    }),
    CredentialsProvider({
      id: "password",
      name: 'Password',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const client = await clientPromise;
        const db = client.db();
        const user = await db.collection("users").findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return { id: user._id.toString(), email: user.email };
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
