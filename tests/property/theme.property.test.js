import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { createStorageModule, createThemeModule } from '../helpers/moduleExports.js';

// **Validates: Requirements 9.2, 9.3, 9.4, 9.5**
describe('Property 12: Theme toggle round-trip', () => {
  test('double toggle restores original isDark state', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (initial) => {
          const storage = createStorageModule();
          const theme = createThemeModule(storage);
          theme._isDark = initial;
          theme.toggle();
          theme.toggle();
          expect(theme._isDark).toBe(initial);
          const expectedAttr = initial ? 'dark' : 'light';
          expect(document.documentElement.getAttribute('data-theme')).toBe(expectedAttr);
        }
      ),
      { numRuns: 100 }
    );
  });
});
