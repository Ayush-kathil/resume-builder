import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name?: string;
  password?: string;
  resumeIds: mongoose.Types.ObjectId[];
  tier: 'freemium' | 'premium' | 'enterprise';
  tokenBalance: number;
  monthlyLimit: number;
  banned?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      select: false, // Don't return password by default
    },
    resumeIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Resume',
      },
    ],
    tier: {
      type: String,
      enum: ['freemium', 'premium', 'enterprise'],
      default: 'freemium',
    },
    tokenBalance: {
      type: Number,
      default: 0,
    },
    monthlyLimit: {
      type: Number,
      default: 50000, // Default 50k tokens for freemium
    },
    banned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation errors in Next.js development
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
