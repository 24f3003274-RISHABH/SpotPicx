import { DbService } from './db.service';

export interface HealthCheckResult {
  status: 'healthy' | 'degraded';
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  database: {
    isConnected: boolean;
    state: string;
    mode: string;
    message?: string;
    host?: string;
  };
  version: string;
}

export class HealthService {
  public static getHealth(): HealthCheckResult {
    const dbStatus = DbService.getDatabaseStatus();

    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      database: {
        isConnected: dbStatus.isConnected,
        state: dbStatus.state,
        mode: dbStatus.mode,
        message: dbStatus.message,
        host: dbStatus.host,
      },
      version: '1.0.0-phase1',
    };
  }
}
