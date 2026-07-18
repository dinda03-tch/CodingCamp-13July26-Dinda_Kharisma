import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { createStorageModule, createQuickLinksModule } from '../helpers/moduleExports.js';

// **Validates: Requirements 8.2, 8.6**
describe('Property 10: Quick link persistence round-trip', () => {
  test('addLink persists to storage', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        fc.webUrl(),
        (label, url) => {
          const storage = createStorageModule();
          const ql = createQuickLinksModule(storage);
          ql.addLink(label, url);
          const saved = storage.get('quickLinks');
          expect(saved).toHaveLength(1);
          expect(saved[0].label).toBe(label.trim());
          expect(saved[0].url).toBe(url.trim());
        }
      ),
      { numRuns: 100 }
    );
  });
});

// **Validates: Requirements 8.3**
describe('Property 11: Empty quick link fields rejected', () => {
  test('empty label or url not saved', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.record({ label: fc.constant(''), url: fc.webUrl() }),
          fc.record({ label: fc.string({ minLength: 1 }), url: fc.constant('') })
        ),
        ({ label, url }) => {
          const storage = createStorageModule();
          const ql = createQuickLinksModule(storage);
          ql.addLink(label, url);
          expect(ql._links).toHaveLength(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});
