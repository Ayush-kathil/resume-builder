import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISystemSettings extends Document {
  maintenanceMode: boolean;
  allowNewSignups: boolean;
  announcementBanner: {
    active: boolean;
    text: string;
    backgroundColor: string;
    textColor: string;
  };
  defaultAiModel: string;
  updatedAt: Date;
  mfaEnforced: boolean;
  sessionTimeout: number; // in minutes
  ipAllowlist: string; // comma separated
  piiMasking: boolean;
  aiModelTrainingOptOut: boolean;
}

const SystemSettingsSchema = new Schema<ISystemSettings>({
  maintenanceMode: { type: Boolean, default: false },
  allowNewSignups: { type: Boolean, default: true },
  announcementBanner: {
    active: { type: Boolean, default: false },
    text: { type: String, default: 'Welcome to the AI Resume Maker!' },
    backgroundColor: { type: String, default: '#1a1a1a' },
    textColor: { type: String, default: '#ffffff' },
  },
  defaultAiModel: { type: String, default: 'gemini-2.5-flash' },
  updatedAt: { type: Date, default: Date.now },
  mfaEnforced: { type: Boolean, default: false },
  sessionTimeout: { type: Number, default: 60 },
  ipAllowlist: { type: String, default: '' },
  piiMasking: { type: Boolean, default: false },
  aiModelTrainingOptOut: { type: Boolean, default: false },
});

// Enforce singleton by hardcoding a specific ID or just querying the first document.
const SystemSettings: Model<ISystemSettings> = mongoose.models.SystemSettings || mongoose.model<ISystemSettings>("SystemSettings", SystemSettingsSchema);

export default SystemSettings;
