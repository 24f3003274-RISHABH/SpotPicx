import { z } from 'zod';
import { USER_ROLES } from '../constants/roles';

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters'),
  role: z
    .enum([USER_ROLES.USER, USER_ROLES.BUSINESS_OWNER])
    .optional()
    .default(USER_ROLES.USER),
  city: z.string().trim().optional().default('Delhi'),
  avatar: z.string().trim().optional().default(''),
  bio: z.string().trim().max(500, 'Bio cannot exceed 500 characters').optional().default(''),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email or username is required'),
  password: z
    .string()
    .min(1, 'Password cannot be empty'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100).optional(),
  city: z.string().trim().optional(),
  bio: z.string().trim().max(500).optional(),
  avatar: z.string().trim().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
