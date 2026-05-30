import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPromptVersion extends Document {
  name: string;
  version: number;
  content: string;
  isActive: boolean;
  createdBy: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PromptVersionSchema = new Schema<IPromptVersion>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    version: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String, // email or user ID of admin
      required: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure uniqueness of name + version
PromptVersionSchema.index({ name: 1, version: 1 }, { unique: true });

export const PromptVersion: Model<IPromptVersion> = 
  mongoose.models.PromptVersion || mongoose.model<IPromptVersion>('PromptVersion', PromptVersionSchema);
