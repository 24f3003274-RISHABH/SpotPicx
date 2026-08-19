import { z } from 'zod';

export const createBusinessSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(150),
  slug: z.string().trim().toLowerCase().optional(),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().trim().max(300).optional().default(''),
  category: z.string().min(1, 'Category is required'),
  categories: z.array(z.string()).optional().default([]),
  address: z.string().trim().min(5, 'Address is required'),
  locality: z.string().trim().min(2, 'Locality is required'),
  city: z.string().trim().optional().default('Delhi'),
  state: z.string().trim().optional().default('Delhi'),
  country: z.string().trim().optional().default('India'),
  pincode: z.string().trim().optional().default(''),
  latitude: z.number().optional().default(28.6139),
  longitude: z.number().optional().default(77.209),
  phone: z.string().trim().optional().default(''),
  email: z.string().trim().email().optional().or(z.literal('')),
  website: z.string().trim().optional().default(''),
  images: z.array(z.string()).optional().default([]),
  logo: z.string().trim().optional().default(''),
  priceRange: z.enum(['BUDGET', 'MODERATE', 'PREMIUM', 'LUXURY']).optional().default('MODERATE'),
  tags: z.array(z.string()).optional().default([]),
  amenities: z.array(z.string()).optional().default([]),
  features: z.array(z.string()).optional().default([]),
  openingHours: z.record(z.string(), z.string()).optional().default({}),
  verified: z.boolean().optional().default(false),
  claimed: z.boolean().optional().default(false),
  status: z.enum(['ACTIVE', 'PENDING', 'REJECTED', 'ARCHIVED']).optional().default('ACTIVE'),
});

export const updateBusinessSchema = createBusinessSchema.partial();

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;
export type UpdateBusinessInput = z.infer<typeof updateBusinessSchema>;
