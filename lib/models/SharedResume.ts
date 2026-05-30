import mongoose, { Schema, Document } from 'mongoose';

export interface ISharedResume extends Document {
  slug: string;
  data: any; // ResumeData payload
  passwordHash?: string;
  createdAt: Date;
  expiresAt: Date;
  views: number;
}

const SharedResumeSchema: Schema = new Schema({
  slug: { type: String, required: true, unique: true },
  data: { type: Schema.Types.Mixed, required: true },
  passwordHash: { type: String },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }, // 30 days default
  views: { type: Number, default: 0 },
});

export const SharedResume = mongoose.models.SharedResume || mongoose.model<ISharedResume>('SharedResume', SharedResumeSchema);
