import { Router, Request, Response } from 'express';
import { SeedService } from '../services/seed.service';

const router = Router();

// POST /api/v1/seed - Trigger database / in-memory seed
router.post('/', async (req: Request, res: Response) => {
  try {
    const result = await SeedService.seedDatabase();
    res.status(200).json({
      success: true,
      message: 'SpotPicks Discovery database seeded successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SEEDING_FAILED',
        message: error.message || 'Failed to seed database',
      },
    });
  }
});

// GET /api/v1/seed/status - Get current seed counts
router.get('/status', (req: Request, res: Response) => {
  SeedService.initializeInMemoryStore();
  res.status(200).json({
    success: true,
    data: {
      categoriesCount: SeedService.inMemoryCategories.size,
      locationsCount: SeedService.inMemoryLocations.size,
      businessesCount: SeedService.inMemoryBusinesses.size,
      isSeeded: SeedService.isSeeded,
    },
  });
});

export default router;
