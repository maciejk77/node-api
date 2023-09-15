import * as request from 'supertest';
import { app } from '../server';

describe('GET /cards', () => {
  test('returns cards data', async () => {
    const { status, body } = await request(app).get('/cards');

    expect(status).toBe(200);
    expect(body).toHaveLength(3);
  });
});

describe('GET /cards/card00x', () => {
  test('returns matching card title', async () => {
    const { status, body } = await request(app).get('/cards/card001');

    expect(status).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({
        title: 'card 1 title',
      })
    );
  });
});
