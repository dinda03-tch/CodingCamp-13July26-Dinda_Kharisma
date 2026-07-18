import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { getGreeting, createStorageModule } from '../helpers/moduleExports.js';

// **Validates: Requirements 5.1, 5.2, 5.3, 5.4**
describe('Property 2: Greeting maps hour to correct salutation', () => {
  test('greeting correct salutation and contains name', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 23 }),
        fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        (hour, name) => {
          const result = getGreeting(hour, name.trim());
          if (hour <= 11) expect(result).toContain('Good Morning');
          else if (hour <= 17) expect(result).toContain('Good Afternoon');
          else expect(result).toContain('Good Evening');
          expect(result).toContain(name.trim());
        }
      ),
      { numRuns: 100 }
    );
  });
});

// **Validates: Requirements 5.6, 5.7**
describe('Property 3: Name persistence round-trip', () => {
  test('saveName persists and can be read back', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        (name) => {
          const storage = createStorageModule();
          storage.set('userName', name.trim());
          expect(storage.get('userName')).toBe(name.trim());
        }
      ),
      { numRuns: 100 }
    );
  });
});
