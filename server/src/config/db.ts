import mongoose from 'mongoose';
import { ENV } from './env';

// Disable buffering to prevent hanging requests when MongoDB Atlas is disconnected/unreachable
mongoose.set('bufferCommands', false);

interface DBStatus {
  isConnected: boolean;
  state: string;
  host?: string;
  name?: string;
  mode: 'atlas_connected' | 'offline_dev_mode' | 'connecting' | 'error';
  message?: string;
}

// this is the mongodb configure file 

const stateMap: Record<number, string> = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnecting: boolean = false;
  private connectionAttempted: boolean = false;
  private lastError: string | null = null;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  private isValidMongoUri(uri: string): boolean {
    if (!uri || typeof uri !== 'string') return false;
    const trimmed = uri.trim();
    if (trimmed.length === 0) return false;
    // Check for unpopulated placeholders in .env template
    if (trimmed.includes('<username>') || trimmed.includes('<password>') || trimmed.includes('CLUSTER_NAME')) return false;
    if (trimmed.startsWith('mongodb://') || trimmed.startsWith('mongodb+srv://')) {
      return true;
    }
    return false;
  }

  public async connect(): Promise<boolean> {
    const uri = ENV.MONGODB_URI?.trim();

    if (!this.isValidMongoUri(uri)) {
      this.lastError = 'MONGODB_URI is not configured with valid credentials';
      console.log('ℹ️ [MongoDB] Running in offline development mode with fast in-memory store.');
      return false;
    }

    if (mongoose.connection.readyState === 1) {
      return true;
    }

    if (this.isConnecting) {
      return false;
    }

    try {
      this.isConnecting = true;
      this.connectionAttempted = true;
      console.log('⏳ [MongoDB] Connecting to MongoDB Atlas cluster...');

      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 2000,
        connectTimeoutMS: 2000,
        socketTimeoutMS: 10000,
      });

      console.log(`✅ [MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
      this.isConnecting = false;
      this.lastError = null;
      return true;
    } catch (err: unknown) {
      this.isConnecting = false;
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.lastError = errorMessage;
      console.warn(`⚠️ [MongoDB] Could not reach database server: ${errorMessage}. SpotPicks resilient offline engine active.`);
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('🛑 [MongoDB] Disconnected.');
    }
  }

  public getStatus(): DBStatus {
    const readyState = mongoose.connection.readyState;
    const isConnected = readyState === 1;

    let mode: DBStatus['mode'] = 'offline_dev_mode';
    if (isConnected) {
      mode = 'atlas_connected';
    } else if (this.isConnecting) {
      mode = 'connecting';
    } else if (this.lastError) {
      mode = 'error';
    }

    return {
      isConnected,
      state: stateMap[readyState] || 'disconnected',
      host: mongoose.connection.host || undefined,
      name: mongoose.connection.name || undefined,
      mode,
      message: isConnected
        ? 'Connected to MongoDB Atlas'
        : (this.lastError || 'Operating in offline development mode (Mongoose models ready)'),
    };
  }
}

export const dbConnection = DatabaseConnection.getInstance();

