import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name?: string;
  resumeIds: mongoose.Types.ObjectId[];
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
    resumeIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Resume',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation errors in Next.js development
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
