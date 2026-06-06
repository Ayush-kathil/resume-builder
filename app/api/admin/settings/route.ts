import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import SystemSettings from "@/models/SystemSettings";
import mongoose from "mongoose";

const ADMIN_EMAILS = [process.env.ADMIN_EMAIL, "kathilshiva@gmail.com"];

async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return false;
  }
  return true;
}

export async function GET() {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!, {
        family: 4,
        serverSelectionTimeoutMS: 5000,
      });
    }

    let settings = await SystemSettings.findOne({});
    if (!settings) {
      settings = await SystemSettings.create({});
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!, {
        family: 4,
        serverSelectionTimeoutMS: 5000,
      });
    }

    const body = await request.json();

    let settings = await SystemSettings.findOne({});
    if (!settings) {
      settings = new SystemSettings(body);
      await settings.save();
    } else {
      settings.maintenanceMode = body.maintenanceMode ?? settings.maintenanceMode;
      settings.allowNewSignups = body.allowNewSignups ?? settings.allowNewSignups;
      settings.defaultAiModel = body.defaultAiModel ?? settings.defaultAiModel;
      settings.mfaEnforced = body.mfaEnforced ?? settings.mfaEnforced;
      settings.sessionTimeout = body.sessionTimeout ?? settings.sessionTimeout;
      settings.ipAllowlist = body.ipAllowlist ?? settings.ipAllowlist;
      settings.piiMasking = body.piiMasking ?? settings.piiMasking;
      settings.aiModelTrainingOptOut = body.aiModelTrainingOptOut ?? settings.aiModelTrainingOptOut;
      
      if (body.announcementBanner) {
        settings.announcementBanner = {
          ...settings.announcementBanner,
          ...body.announcementBanner
        };
      }
      settings.updatedAt = new Date();
      await settings.save();
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
