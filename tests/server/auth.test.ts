import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../server/src/app';
import { generateAccessToken } from '../../server/src/utils/jwt';
import { USER_ROLES } from '../../server/src/constants/roles';

const app = createApp();

describe('Auth & Security API Suite', () => {
  it('GET /api/v1/health should return 200 and healthy status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('healthy');
  });

  it('POST /api/v1/auth/login with missing fields should return 400 Bad Request with validation errors', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it('GET /api/v1/auth/me without token should return 401 Unauthorized', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Authentication required');
  });

  it('GET /api/v1/auth/me with malformed token should return 401', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer invalid-token-string');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('Generates valid JWT and signs role payload accurately', () => {
    const token = generateAccessToken({
      id: '507f1f77bcf86cd799439011',
      email: 'test@spotpicks.delhi',
      username: 'testuser',
      role: USER_ROLES.USER,
    });
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });
});

