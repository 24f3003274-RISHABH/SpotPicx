import { DataSource } from '../models/DataSource';
import { DataIngestionService } from './ingestion.service';
import { FreshnessService } from './freshness.service';
import { dbConnection } from '../config/db';

export class IngestionSchedulerService {
  private static timer: NodeJS.Timeout | null = null;
  private static isRunning = false;
  private static CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes check

  /**
   * Initializes and starts the background ingestion scheduler
   */
  public static start(): void {
    if (this.timer) {
      return; // Already running
    }

    console.log('⏰ [IngestionScheduler] Service started. Checking sources every 5 minutes.');

    // Initial check after 10 seconds of app boot
    setTimeout(() => {
      this.checkAndRunDueJobs().catch((err) => {
        console.warn('[IngestionScheduler] Initial run check notice:', err.message);
      });
    }, 10000);

    // Periodic interval
    this.timer = setInterval(() => {
      this.checkAndRunDueJobs().catch((err) => {
        console.warn('[IngestionScheduler] Scheduled run error:', err.message);
      });
    }, this.CHECK_INTERVAL_MS);
  }

  /**
   * Stops the background scheduler
   */
  public static stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.log('🛑 [IngestionScheduler] Service stopped.');
    }
  }

  /**
   * Checks for active data sources due for execution and runs them with rate-limiting
   */
  public static async checkAndRunDueJobs(): Promise<number> {
    if (this.isRunning) {
      return 0; // Prevent overlapping runs
    }

    if (!dbConnection.getStatus().isConnected) {
      return 0;
    }

    this.isRunning = true;
    let jobsExecuted = 0;

    try {
      // Ensure default sources are bootstrapped
      await DataIngestionService.initializeSources();

      const now = new Date();
      const dueSources = await DataSource.find({
        status: 'ACTIVE',
        $or: [{ nextRun: { $lte: now } }, { nextRun: null }],
      }).limit(5);

      if (dueSources.length > 0) {
        console.log(`[IngestionScheduler] Found ${dueSources.length} due data source(s). Executing...`);

        for (const src of dueSources) {
          try {
            await DataIngestionService.runSourceIngestion(src._id);
            jobsExecuted++;
          } catch (err: any) {
            console.error(`[IngestionScheduler] Error executing source ${src.name}:`, err.message);
          }
        }

        // Recompute freshness across platform
        await FreshnessService.recalculateAllFreshness();
      }
    } catch (err: any) {
      console.error('[IngestionScheduler] Job checking error:', err.message);
    } finally {
      this.isRunning = false;
    }

    return jobsExecuted;
  }
}
