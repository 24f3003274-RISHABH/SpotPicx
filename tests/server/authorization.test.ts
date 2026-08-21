import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../server/src/app';
import { generateAccessToken } from '../../server/src/utils/jwt';
import { USER_ROLES } from '../../server/src/constants/roles';

const app = createApp();

describe('Role-Based Access Control (RBAC) & Protected Endpoints', () => {
  it('GET /api/v1/admin/overview should reject unauthenticated requests with 401', async () => {
    const res = await request(app).get('/api/v1/admin/overview');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/admin/overview should reject standard USER token with 401 or 403', async () => {
    const userToken = generateAccessToken({
      id: '507f1f77bcf86cd799439011',
      email: 'user@spotpicks.delhi',
      username: 'testregularuser',
      role: USER_ROLES.USER,
    });

    const res = await request(app)
      .get('/api/v1/admin/overview')
      .set('Authorization', `Bearer ${userToken}`);

    expect([401, 403]).toContain(res.status);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/business-owner/businesses should reject unauthenticated requests with 401', async () => {
    const res = await request(app).get('/api/v1/business-owner/businesses');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/favorites/toggle should reject unauthenticated requests with 401', async () => {
    const res = await request(app).post('/api/v1/favorites/toggle').send({ businessId: 'some-id' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/reviews should reject unauthenticated requests with 401', async () => {
    const res = await request(app).post('/api/v1/reviews').send({
      business: '507f1f77bcf86cd799439011',
      rating: 5,
      content: 'Amazing authentic butter chicken and ambiance in Connaught Place!',
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
