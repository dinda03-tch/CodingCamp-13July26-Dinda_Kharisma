import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { formatTime } from '../helpers/moduleExports.js';

// **Validates: Requirements 4.1**
describe('Property 1: Clock format always valid', () => {
  test('formatTime always produces HH:MM:SS', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date(2000, 0, 1), max: new Date(2100, 11, 31) }),
        (d) => {
          const result = formatTime(d);
          expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
          const [hh, mm, ss] = result.split(':').map(Number);
          expect(hh).toBeGreaterThanOrEqual(0); expect(hh).toBeLessThanOrEqual(23);
          expect(mm).toBeGreaterThanOrEqual(0); expect(mm).toBeLessThanOrEqual(59);
          expect(ss).toBeGreaterThanOrEqual(0); expect(ss).toBeLessThanOrEqual(59);
        }
      ),
      { numRuns: 100 }
    );
  });
});
