import { SystemLog, LogLevel, LogCategory } from '../models/SystemLog';
import { dbConnection } from '../config/db';

export class LoggerService {
  // In-memory buffer for logs when MongoDB is disconnected or buffering
  private static memoryLogs: Array<{
    id: string;
    level: LogLevel;
    category: LogCategory;
    message: string;
    details?: any;
    path?: string;
    method?: string;
    statusCode?: number;
    timestamp: string;
  }> = [];

  private static readonly MAX_MEMORY_LOGS = 200;

  /**
   * Log an event securely to server-side telemetry storage
   */
  public static async log(
    level: LogLevel,
    category: LogCategory,
    message: string,
    meta?: {
      details?: any;
      path?: string;
      method?: string;
      statusCode?: number;
      userId?: string;
      durationMs?: number;
      ip?: string;
    }
  ) {
    const entry = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      level,
      category,
      message,
      details: meta?.details || {},
      path: meta?.path || '',
      method: meta?.method || '',
      statusCode: meta?.statusCode,
      timestamp: new Date().toISOString(),
    };

    // Keep circular in-memory buffer
    this.memoryLogs.unshift(entry);
    if (this.memoryLogs.length > this.MAX_MEMORY_LOGS) {
      this.memoryLogs.pop();
    }

    // Persist to MongoDB if connected
    if (dbConnection.getStatus().isConnected) {
      try {
        await SystemLog.create({
          level,
          category,
          message,
          details: meta?.details,
          path: meta?.path,
          method: meta?.method,
          statusCode: meta?.statusCode,
          userId: meta?.userId,
          durationMs: meta?.durationMs,
          ip: meta?.ip,
          timestamp: new Date(),
        });
      } catch (err) {
        // Silently capture database write failures without throwing
      }
    }
  }

  public static info(category: LogCategory, message: string, meta?: any) {
    return this.log('INFO', category, message, meta);
  }

  public static warn(category: LogCategory, message: string, meta?: any) {
    return this.log('WARN', category, message, meta);
  }

  public static error(category: LogCategory, message: string, meta?: any) {
    return this.log('ERROR', category, message, meta);
  }

  public static fatal(category: LogCategory, message: string, meta?: any) {
    return this.log('FATAL', category, message, meta);
  }

  /**
   * Query logs for Admin Telemetry & Health Monitoring
   */
  public static async queryLogs(params: {
    category?: LogCategory | 'ALL';
    level?: LogLevel | 'ALL';
    limit?: number;
    search?: string;
  }) {
    const limit = Math.min(params.limit || 50, 100);

    if (dbConnection.getStatus().isConnected) {
      const query: any = {};
      if (params.category && params.category !== 'ALL') query.category = params.category;
      if (params.level && params.level !== 'ALL') query.level = params.level;
      if (params.search) {
        query.$or = [
          { message: { $regex: params.search, $options: 'i' } },
          { path: { $regex: params.search, $options: 'i' } },
        ];
      }

      const logs = await SystemLog.find(query)
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean();

      return logs.map((l) => ({
        id: l._id.toString(),
        level: l.level,
        category: l.category,
        message: l.message,
        details: l.details,
        path: l.path,
        method: l.method,
        statusCode: l.statusCode,
        timestamp: l.timestamp.toISOString(),
      }));
    }

    // Return from in-memory ring buffer
    let filtered = [...this.memoryLogs];
    if (params.category && params.category !== 'ALL') {
      filtered = filtered.filter((l) => l.category === params.category);
    }
    if (params.level && params.level !== 'ALL') {
      filtered = filtered.filter((l) => l.level === params.level);
    }
    if (params.search) {
      const term = params.search.toLowerCase();
      filtered = filtered.filter(
        (l) => l.message.toLowerCase().includes(term) || (l.path && l.path.toLowerCase().includes(term))
      );
    }

    return filtered.slice(0, limit);
  }

  /**
   * Aggregate statistics for Admin Monitoring Dashboard
   */
  public static async getLogStats() {
    const totalLogs = this.memoryLogs.length;
    const errorCount = this.memoryLogs.filter((l) => l.level === 'ERROR' || l.level === 'FATAL').length;
    const aiFailures = this.memoryLogs.filter((l) => l.category === 'AI' && (l.level === 'ERROR' || l.level === 'WARN')).length;
    const scraperFailures = this.memoryLogs.filter((l) => l.category === 'SCRAPER' && (l.level === 'ERROR' || l.level === 'WARN')).length;
    const jobFailures = this.memoryLogs.filter((l) => l.category === 'JOB' && (l.level === 'ERROR' || l.level === 'WARN')).length;

    return {
      totalRecorded: totalLogs,
      errorCount,
      aiFailures,
      scraperFailures,
      jobFailures,
      healthScore: Math.max(95, 100 - errorCount * 2),
    };
  }
}
