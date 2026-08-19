import mongoose, { Document, Schema, Model } from 'mongoose';

export type LocationType = 'COUNTRY' | 'STATE' | 'CITY' | 'LOCALITY';

export interface ILocation extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  type: LocationType;
  parent?: mongoose.Types.ObjectId | null;
  country: string;
  state: string;
  city: string;
  latitude: number;
  longitude: number;
  pincode: string;
  isActive: boolean;
  description?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILocationModel extends Model<ILocation> {}

const LocationSchema = new Schema<ILocation>(
  {
    name: {
      type: String,
      required: [true, 'Location name is required'],
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['COUNTRY', 'STATE', 'CITY', 'LOCALITY'],
      required: true,
      index: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      default: null,
      index: true,
    },
    country: {
      type: String,
      required: true,
      default: 'India',
      index: true,
    },
    state: {
      type: String,
      required: true,
      default: 'Delhi',
      index: true,
    },
    city: {
      type: String,
      required: true,
      default: 'Delhi',
      index: true,
    },
    latitude: {
      type: Number,
      default: 28.6139,
    },
    longitude: {
      type: Number,
      default: 77.209,
    },
    pincode: {
      type: String,
      default: '',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

LocationSchema.index({ city: 1, type: 1 });
LocationSchema.index({ parent: 1, type: 1 });

export const Location =
  (mongoose.models.Location as ILocationModel) ||
  mongoose.model<ILocation, ILocationModel>('Location', LocationSchema);
