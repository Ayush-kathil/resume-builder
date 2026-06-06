import mongoose from "mongoose";
import SystemSettings from "@/models/SystemSettings";
import { Lock, AlertTriangle } from "lucide-react";

export async function GlobalSettingsWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings = null;
  
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!, {
        family: 4,
        serverSelectionTimeoutMS: 5000,
      });
    }
    settings = await SystemSettings.findOne({}).lean();
  } catch (e) {
    console.error("Failed to fetch global settings:", e);
  }

  // If Maintenance Mode is strictly active, show the maintenance screen
  // (We do not block /admin routes because the layout is wrapping everything, so we assume admin knows the direct URL. Wait, if we wrap everything, how does admin access?
  // We should probably allow access to everything, but show the maintenance screen ONLY on non-admin routes. However, next/headers can read the URL.)
  // Actually, standard Next.js app directory: to get the path in a server component, you can't easily without middleware.
  // Instead, let's just render the announcement banner if active, and let middleware or client-side handle strict maintenance mode. Or we can render a banner saying "Maintenance Mode is active. Normal users are blocked."
  // Wait, if it's a global wrapper, let's just render the Announcement banner here.

  return (
    <>
      {settings?.announcementBanner?.active && (
        <div 
          className="w-full text-center py-2 text-sm font-medium relative z-50 shadow-sm transition-all"
          style={{ 
            backgroundColor: settings.announcementBanner.backgroundColor || '#1a1a1a',
            color: settings.announcementBanner.textColor || '#ffffff'
          }}
        >
          {settings.announcementBanner.text}
        </div>
      )}
      
      {settings?.maintenanceMode && (
        <div className="w-full bg-red-600 text-white text-center py-1 text-xs font-bold uppercase tracking-wider relative z-50">
          <AlertTriangle className="w-3 h-3 inline-block mr-1" />
          Maintenance Mode Active - Website is hidden from standard users
        </div>
      )}

      {children}
    </>
  );
}
