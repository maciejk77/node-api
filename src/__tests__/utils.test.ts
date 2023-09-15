import { formatPrice, getElementById, fetchData } from '../utils';
import { sizesMock, templatesMock } from '../dataMocks';
import { SIZES_URL } from '../constants';

describe('Utils', () => {
  describe('fetchData', () => {
    test('returns data', async () => {
      const data = await fetchData(SIZES_URL);
      expect(data).toEqual(sizesMock);
    });
  });

  describe('getElementById', () => {
    test('returns correct size data for a given sizeId', () => {
      const size = getElementById(sizesMock, 'lg');
      expect(size).toEqual(sizesMock[2]);
    });

    test('returns correct template data for a given templateId', () => {
      const template = getElementById(templatesMock, 'template007');
      expect(template).toEqual(templatesMock[1]);
    });
  });

  describe('formatPrice', () => {
    test('returns formatted price (multiplier provided)', () => {
      const price = formatPrice(200, 0.8);
      expect(price).toEqual('£1.60');
    });

    test('returns formatted price (no multiplier)', () => {
      const price = formatPrice(200);
      expect(price).toEqual('£2.00');
    });
  });
});
