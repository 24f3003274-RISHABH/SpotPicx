import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User, IUser } from '../models/User';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { dbConnection } from '../config/db';
import { USER_ROLES, UserRole } from '../constants/roles';

export interface SafeUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  avatar: string;
  bio: string;
  city: string;
  isActive: boolean;
  savedSpots?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: SafeUser;
  tokens: AuthTokens;
}

// In-Memory Dev User Store for Resilient Preview without MongoDB Atlas credentials
interface InMemoryUser {
  id: string;
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatar: string;
  bio: string;
  city: string;
  isActive: boolean;
  savedSpots: string[];
  createdAt: string;
  updatedAt: string;
}

const inMemoryUsers: Map<string, InMemoryUser> = new Map();

// Helper to seed initial demo accounts in memory
const initializeInMemoryUsers = async () => {
  if (inMemoryUsers.size === 0) {
    const salt = await bcrypt.genSalt(10);
    
    // 1. Super Admin / Admin
    const adminHash = await bcrypt.hash('admin123', salt);
    inMemoryUsers.set('usr_admin_1', {
      id: 'usr_admin_1',
      name: 'SpotPicks Admin',
      username: 'spotpicks_admin',
      email: 'admin@spotpicks.com',
      passwordHash: adminHash,
      role: USER_ROLES.SUPER_ADMIN,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: 'Platform architect & chief curator for SpotPicks Delhi NCR.',
      city: 'Delhi',
      isActive: true,
      savedSpots: ['spot-1', 'spot-2'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 2. Business Owner (Delhi Cafe & PG Owner)
    const ownerHash = await bcrypt.hash('owner123', salt);
    inMemoryUsers.set('usr_owner_1', {
      id: 'usr_owner_1',
      name: 'Rohan Oberoi',
      username: 'rohan_oberoi',
      email: 'owner@spotpicks.com',
      passwordHash: ownerHash,
      role: USER_ROLES.BUSINESS_OWNER,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      bio: 'Proprietor of artisanal cafes in Hauz Khas and premium stays in South Delhi.',
      city: 'Delhi',
      isActive: true,
      savedSpots: ['spot-1'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 3. Regular Explorer
    const userHash = await bcrypt.hash('user123', salt);
    inMemoryUsers.set('usr_user_1', {
      id: 'usr_user_1',
      name: 'Ananya Sharma',
      username: 'ananya_delhi',
      email: 'user@spotpicks.com',
      passwordHash: userHash,
      role: USER_ROLES.USER,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      bio: 'Street food lover, momo hunter, and weekend heritage photographer in Delhi.',
      city: 'Delhi',
      isActive: true,
      savedSpots: ['spot-1', 'spot-3'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
};

// Initialize seed users
initializeInMemoryUsers().catch((err) => console.error('Seed user initialization:', err));

export class AuthService {
  private static isDbReady(): boolean {
    return dbConnection.getStatus().isConnected;
  }

  private static formatMongooseUser(user: IUser): SafeUser {
    return {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar || '',
      bio: user.bio || '',
      city: user.city || 'Delhi',
      isActive: user.isActive,
      savedSpots: user.savedSpots ? user.savedSpots.map((s) => s.toString()) : [],
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  private static formatMemoryUser(user: InMemoryUser): SafeUser {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      city: user.city,
      isActive: user.isActive,
      savedSpots: user.savedSpots,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Register a new user
   */
  public static async register(input: RegisterInput): Promise<AuthResult> {
    const emailLower = input.email.toLowerCase().trim();
    const usernameLower = input.username.toLowerCase().trim();

    if (this.isDbReady()) {
      // 1. Check existing email
      const existingEmail = await User.findOne({ email: emailLower });
      if (existingEmail) {
        const error: any = new Error('User with this email already exists');
        error.statusCode = 409;
        throw error;
      }

      // 2. Check existing username
      const existingUsername = await User.findOne({ username: usernameLower });
      if (existingUsername) {
        const error: any = new Error('Username is already taken. Please choose another');
        error.statusCode = 409;
        throw error;
      }

      // 3. Create user
      const user = new User({
        name: input.name.trim(),
        username: usernameLower,
        email: emailLower,
        password: input.password,
        role: input.role || USER_ROLES.USER,
        city: input.city || 'Delhi',
        avatar: input.avatar || '',
        bio: input.bio || '',
      });

      await user.save();

      const safeUser = this.formatMongooseUser(user);
      const accessToken = generateAccessToken({
        id: safeUser.id,
        email: safeUser.email,
        username: safeUser.username,
        role: safeUser.role,
      });
      const refreshToken = generateRefreshToken({
        id: safeUser.id,
        role: safeUser.role,
      });

      return {
        user: safeUser,
        tokens: { accessToken, refreshToken },
      };
    } else {
      // Fallback In-Memory Storage
      for (const u of inMemoryUsers.values()) {
        if (u.email.toLowerCase() === emailLower) {
          const error: any = new Error('User with this email already exists');
          error.statusCode = 409;
          throw error;
        }
        if (u.username.toLowerCase() === usernameLower) {
          const error: any = new Error('Username is already taken. Please choose another');
          error.statusCode = 409;
          throw error;
        }
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(input.password, salt);
      const newId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const newMemoryUser: InMemoryUser = {
        id: newId,
        name: input.name.trim(),
        username: usernameLower,
        email: emailLower,
        passwordHash,
        role: (input.role as UserRole) || USER_ROLES.USER,
        avatar: input.avatar || '',
        bio: input.bio || '',
        city: input.city || 'Delhi',
        isActive: true,
        savedSpots: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      inMemoryUsers.set(newId, newMemoryUser);

      const safeUser = this.formatMemoryUser(newMemoryUser);
      const accessToken = generateAccessToken({
        id: safeUser.id,
        email: safeUser.email,
        username: safeUser.username,
        role: safeUser.role,
      });
      const refreshToken = generateRefreshToken({
        id: safeUser.id,
        role: safeUser.role,
      });

      return {
        user: safeUser,
        tokens: { accessToken, refreshToken },
      };
    }
  }

  /**
   * Login user with email or username
   */
  public static async login(input: LoginInput): Promise<AuthResult> {
    const identifier = input.email.toLowerCase().trim();

    if (this.isDbReady()) {
      // Search by email or username
      const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }],
      }).select('+password');

      if (!user) {
        const error: any = new Error('Invalid email/username or password');
        error.statusCode = 401;
        throw error;
      }

      if (!user.isActive) {
        const error: any = new Error('Your account has been deactivated. Please contact support.');
        error.statusCode = 403;
        throw error;
      }

      const isMatch = await user.comparePassword(input.password);
      if (!isMatch) {
        const error: any = new Error('Invalid email/username or password');
        error.statusCode = 401;
        throw error;
      }

      const safeUser = this.formatMongooseUser(user);
      const accessToken = generateAccessToken({
        id: safeUser.id,
        email: safeUser.email,
        username: safeUser.username,
        role: safeUser.role,
      });
      const refreshToken = generateRefreshToken({
        id: safeUser.id,
        role: safeUser.role,
      });

      return {
        user: safeUser,
        tokens: { accessToken, refreshToken },
      };
    } else {
      // Fallback In-Memory Storage
      let foundUser: InMemoryUser | null = null;
      for (const u of inMemoryUsers.values()) {
        if (u.email.toLowerCase() === identifier || u.username.toLowerCase() === identifier) {
          foundUser = u;
          break;
        }
      }

      if (!foundUser) {
        const error: any = new Error('Invalid email/username or password');
        error.statusCode = 401;
        throw error;
      }

      if (!foundUser.isActive) {
        const error: any = new Error('Your account has been deactivated. Please contact support.');
        error.statusCode = 403;
        throw error;
      }

      const isMatch = await bcrypt.compare(input.password, foundUser.passwordHash);
      if (!isMatch) {
        const error: any = new Error('Invalid email/username or password');
        error.statusCode = 401;
        throw error;
      }

      const safeUser = this.formatMemoryUser(foundUser);
      const accessToken = generateAccessToken({
        id: safeUser.id,
        email: safeUser.email,
        username: safeUser.username,
        role: safeUser.role,
      });
      const refreshToken = generateRefreshToken({
        id: safeUser.id,
        role: safeUser.role,
      });

      return {
        user: safeUser,
        tokens: { accessToken, refreshToken },
      };
    }
  }

  /**
   * Refresh access token using refresh token
   */
  public static async refreshToken(token: string): Promise<AuthResult> {
    if (!token) {
      const error: any = new Error('Refresh token is required');
      error.statusCode = 400;
      throw error;
    }

    try {
      const payload = verifyRefreshToken(token);
      const user = await this.getUserById(payload.id);

      if (!user) {
        const error: any = new Error('Invalid refresh token: user not found');
        error.statusCode = 401;
        throw error;
      }

      if (!user.isActive) {
        const error: any = new Error('Account has been deactivated');
        error.statusCode = 403;
        throw error;
      }

      const newAccessToken = generateAccessToken({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      });
      const newRefreshToken = generateRefreshToken({
        id: user.id,
        role: user.role,
      });

      return {
        user,
        tokens: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      };
    } catch (err: any) {
      const error: any = new Error(err.message || 'Invalid or expired refresh token');
      error.statusCode = 401;
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  public static async getUserById(id: string): Promise<SafeUser | null> {
    if (this.isDbReady()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      const user = await User.findById(id);
      if (!user) return null;
      return this.formatMongooseUser(user);
    } else {
      const memoryUser = inMemoryUsers.get(id);
      if (!memoryUser) return null;
      return this.formatMemoryUser(memoryUser);
    }
  }

  /**
   * Get all registered users (for Admin dashboard)
   */
  public static async getAllUsers(): Promise<SafeUser[]> {
    if (this.isDbReady()) {
      const users = await User.find().sort({ createdAt: -1 });
      return users.map((u) => this.formatMongooseUser(u));
    } else {
      return Array.from(inMemoryUsers.values()).map((u) => this.formatMemoryUser(u));
    }
  }

  /**
   * Update User Role (Admin only)
   */
  public static async updateUserRole(userId: string, newRole: UserRole): Promise<SafeUser> {
    if (this.isDbReady()) {
      const user = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });
      if (!user) {
        const error: any = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
      return this.formatMongooseUser(user);
    } else {
      const user = inMemoryUsers.get(userId);
      if (!user) {
        const error: any = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
      user.role = newRole;
      user.updatedAt = new Date().toISOString();
      return this.formatMemoryUser(user);
    }
  }
}
