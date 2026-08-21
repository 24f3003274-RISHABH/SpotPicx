import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../server/src/app';

const app = createApp();

describe('Business, Search & Directory API Suite', () => {
  it('GET /api/v1/categories should return 200 and categories list', async () => {
    const res = await request(app).get('/api/v1/categories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/locations should return 200 and Delhi-NCR localities', async () => {
    const res = await request(app).get('/api/v1/locations');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/businesses should return 200 with pagination data', async () => {
    const res = await request(app).get('/api/v1/businesses?page=1&limit=10');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/search/suggestions should return instant search suggestions', async () => {
    const res = await request(app).get('/api/v1/search/suggestions?q=cafe');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });

  it('GET /api/v1/search/trending should return trending searches and businesses', async () => {
    const res = await request(app).get('/api/v1/search/trending');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.searches).toBeDefined();
  });

  it('GET /api/v1/top10 should return curated top 10 rankings', async () => {
    const res = await request(app).get('/api/v1/top10');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/v1/discovery/students should return student curated spots', async () => {
    const res = await request(app).get('/api/v1/discovery/students');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
