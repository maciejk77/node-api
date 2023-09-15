import * as request from 'supertest';
import { app } from '../server';

describe('API', () => {
  describe('GET /cards', () => {
    test('returns cards data', async () => {
      const { status, body } = await request(app).get('/cards');

      expect(status).toBe(200);
      expect(body).toHaveLength(3);
    });

    test('returns matching card data for the third object', async () => {
      const { status, body } = await request(app).get('/cards');

      expect(status).toBe(200);
      expect(body[2]).toEqual(
        expect.objectContaining({
          title: 'card 3 title',
          url: '/cards/card003',
          imageUrl: '/front-cover-landscape.jpg',
        })
      );
    });
  });

  describe('GET /cards/card001', () => {
    test('returns matching card title', async () => {
      const { status, body } = await request(app).get('/cards/card001');

      expect(status).toBe(200);
      expect(body).toEqual(
        expect.objectContaining({
          title: 'card 1 title',
        })
      );
    });

    test('returns formatted price of £2.00 (no size given)', async () => {
      const { status, body } = await request(app).get('/cards/card001');

      expect(status).toBe(200);
      expect(body).toEqual(
        expect.objectContaining({
          price: '£2.00',
        })
      );
    });
  });

  describe('GET /cards/card003/sm', () => {
    test('returns formatted price of £1.60 for size sm (size provided)', async () => {
      const { status, body } = await request(app).get('/cards/card001/sm');

      expect(status).toBe(200);
      expect(body).toEqual(
        expect.objectContaining({
          price: '£1.60',
        })
      );
    });
  });

  describe('GET /cards/card005', () => {
    test('returns error when no i.e. card005 on the response', async () => {
      const { status, text } = await request(app).get('/cards/card005');

      expect(status).toBe(400);
      console.log(text);
      expect(text).toBe(
        'Error: Unable to fetch data, wrong cardId or size in the URL (not matching sm/md/lg/gt)'
      );
    });
  });
});
