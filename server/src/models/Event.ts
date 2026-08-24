import mongoose, { Document, Schema, Model } from 'mongoose';

export type EventCategoryType =
  | 'Concert'
  | 'Comedy'
  | 'Theatre'
  | 'Exhibition'
  | 'Workshop'
  | 'Hackathon'
  | 'Tech'
  | 'Startup'
  | 'Food Festival'
  | 'Cultural';

export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED' | 'PENDING';

export interface IEvent extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  images: string[];
  category: EventCategoryType | string;
  venue: string;
  location: {
    address?: string;
    locality: string;
    city: string;
    coordinates?: [number, number];
  };
  startDate: Date;
  endDate: Date;
  ticketPrice: string | number;
  bookingUrl: string;
  organizer: string;
  tags: string[];
  featured: boolean;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEventModel extends Model<IEvent> {}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    images: {
      type: [String],
      default: ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'],
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Concert',
        'Comedy',
        'Theatre',
        'Exhibition',
        'Workshop',
        'Hackathon',
        'Tech',
        'Startup',
        'Food Festival',
        'Cultural',
      ],
      default: 'Concert',
      index: true,
    },
    venue: { type: String, required: true },
    location: {
      address: { type: String, default: '' },
      locality: { type: String, default: 'Delhi NCR', index: true },
      city: { type: String, default: 'Delhi' },
      coordinates: { type: [Number], default: [77.209, 28.6139] },
    },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true },
    ticketPrice: { type: Schema.Types.Mixed, default: 'Free Entry' },
    bookingUrl: { type: String, default: '' },
    organizer: { type: String, default: 'SpotPicks Events' },
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false, index: true },
    status: {
      type: String,
      enum: ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED', 'EXPIRED', 'PENDING'],
      default: 'UPCOMING',
      index: true,
    },
  },
  { timestamps: true }
);

EventSchema.index({ startDate: 1, status: 1 });
EventSchema.index({ category: 1, status: 1 });

export const Event =
  (mongoose.models.Event as IEventModel) ||
  mongoose.model<IEvent, IEventModel>('Event', EventSchema);
