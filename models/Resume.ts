import mongoose, { Schema, Document, Model } from 'mongoose';
import { ResumeData } from '@/types/resume';

export interface IResume extends Document {
  ownerId?: mongoose.Types.ObjectId; // Optional for guest resumes
  title: string;
  isPublic: boolean;
  data: ResumeData;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    title: {
      type: String,
      required: true,
      default: 'Untitled Resume',
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    data: {
      personalInfo: {
        fullName: String,
        email: String,
        phone: String,
        location: String,
        website: String,
        linkedin: String,
        github: String,
        summary: String,
      },
      experience: [
        {
          id: String,
          company: String,
          position: String,
          startDate: String,
          endDate: String,
          current: Boolean,
          location: String,
          description: [String],
        },
      ],
      education: [
        {
          id: String,
          institution: String,
          degree: String,
          fieldOfStudy: String,
          startDate: String,
          endDate: String,
          current: Boolean,
          location: String,
          gpa: String,
        },
      ],
      skills: [
        {
          id: String,
          category: String,
          items: [String],
        },
      ],
      projects: [
        {
          id: String,
          name: String,
          description: String,
          url: String,
          technologies: [String],
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation errors in Next.js development
export const Resume: Model<IResume> = mongoose.models.Resume || mongoose.model<IResume>('Resume', ResumeSchema);
