import mongoose, { Document, Schema, Model } from 'mongoose';

export type JobType = 'Internship' | 'Part-time' | 'Full-time' | 'Freelance';

export interface IJob extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  company: string;
  companyLogo?: string;
  description: string;
  location: string;
  type: JobType;
  salary: string;
  skills: string[];
  experience: string;
  applyUrl: string;
  deadline: Date;
  tags: string[];
  featured: boolean;
  status: 'ACTIVE' | 'CLOSED';
  createdAt: Date;
  updatedAt: Date;
}

export interface IJobModel extends Model<IJob> {}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    company: { type: String, required: true, trim: true },
    companyLogo: { type: String, default: '' },
    description: { type: String, required: true },
    location: { type: String, required: true, default: 'Delhi NCR' },
    type: {
      type: String,
      required: true,
      enum: ['Internship', 'Part-time', 'Full-time', 'Freelance'],
      default: 'Internship',
      index: true,
    },
    salary: { type: String, required: true, default: 'Competitive Stipend' },
    skills: { type: [String], default: [] },
    experience: { type: String, default: 'Fresher / Student' },
    applyUrl: { type: String, required: true },
    deadline: { type: Date, required: true },
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false, index: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'CLOSED'],
      default: 'ACTIVE',
      index: true,
    },
  },
  { timestamps: true }
);

JobSchema.index({ type: 1, status: 1 });
JobSchema.index({ deadline: 1 });

export const Job =
  (mongoose.models.Job as IJobModel) ||
  mongoose.model<IJob, IJobModel>('Job', JobSchema);
