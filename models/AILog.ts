import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAILog extends Document {
  userId: mongoose.Types.ObjectId;
  endpoint: string;
  promptName?: string;
  promptVersion?: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  costEstimateUSD: number;
  jailbreakFlagged: boolean;
  piiRedacted: boolean;
  confidenceScore: number;
  needsReview: boolean;
  latencyMs: number;
  createdAt: Date;
  updatedAt: Date;
}

const AILogSchema = new Schema<IAILog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    endpoint: {
      type: String,
      required: true,
    },
    promptName: {
      type: String,
    },
    promptVersion: {
      type: Number,
    },
    inputTokens: {
      type: Number,
      default: 0,
    },
    outputTokens: {
      type: Number,
      default: 0,
    },
    totalTokens: {
      type: Number,
      default: 0,
    },
    costEstimateUSD: {
      type: Number,
      default: 0,
    },
    jailbreakFlagged: {
      type: Boolean,
      default: false,
    },
    piiRedacted: {
      type: Boolean,
      default: false,
    },
    confidenceScore: {
      type: Number,
      default: 100, // 0-100 score
    },
    needsReview: {
      type: Boolean,
      default: false,
      index: true,
    },
    latencyMs: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const AILog: Model<IAILog> = 
  mongoose.models.AILog || mongoose.model<IAILog>('AILog', AILogSchema);
