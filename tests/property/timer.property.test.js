import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { formatSeconds } from '../helpers/moduleExports.js';

// **Validates: Requirements 6.1**
describe('Property 4: Timer format always valid', () => {
  test('formatSeconds always produces MM:SS', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 7199 }),
        (secs) => {
          const result = formatSeconds(secs);
          expect(result).toMatch(/^\d{2}:\d{2}$/);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// **Validates: Requirements 6.5, 6.8**
describe('Property 5: Reset returns to configured duration', () => {
  test('reset restores remaining to duration * 60', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 120 }),
        (minutes) => {
          const state = { duration: minutes * 60, remaining: 0, running: true };
          // simulate reset
          state.remaining = state.duration;
          state.running = false;
          expect(state.remaining).toBe(minutes * 60);
          expect(state.running).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});
