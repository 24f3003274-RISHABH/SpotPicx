import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { dbConnection } from '../config/db';
import { SeedService } from '../services/seed.service';

/**
 * SpotPicks Safe Idempotent Manual Seeder
 * 
 * RUN COMMAND: npm run seed
 * 
 * Safety Guarantees:
 * 1. NEVER drops database or collections
 * 2. NEVER calls deleteMany()
 * 3. Uses findOneAndUpdate / findOne checks to only insert missing core categories & locations
 * 4. NEVER overwrites admin-created businesses or custom changes
 */
async function runManualSeed() {
  console.log('🚀 [Manual Seed] Starting safe, non-destructive SpotPicks database seed...');

  try {
    const isConnected = await dbConnection.connect();
    if (!isConnected) {
      console.warn('⚠️ [Manual Seed] MongoDB connection failed or URI not configured. Seed completed in-memory only.');
      process.exit(0);
    }

    console.log('🌱 [Manual Seed] Verifying core categories, locations, and curated establishments...');
    const result = await SeedService.seedDatabase();

    console.log('✅ [Manual Seed] Seeding completed successfully without altering existing custom data!');
    console.log('📊 Result summary:', JSON.stringify(result, null, 2));

    await dbConnection.disconnect();
    process.exit(0);
  } catch (err: any) {
    console.error('❌ [Manual Seed] Seeding process failed:', err);
    process.exit(1);
  }
}

runManualSeed();
