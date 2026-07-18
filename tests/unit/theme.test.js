import { describe, test, expect, beforeEach } from 'vitest';
import { createStorageModule, createThemeModule } from '../helpers/moduleExports.js';

describe('ThemeModule', () => {
  let storage, theme;
  beforeEach(() => { storage = createStorageModule(); theme = createThemeModule(storage); });

  test('initial state is light', () => {
    expect(theme._isDark).toBe(false);
  });
  test('toggle switches to dark', () => {
    theme.toggle();
    expect(theme._isDark).toBe(true);
  });
  test('double toggle returns to original', () => {
    theme.toggle();
    theme.toggle();
    expect(theme._isDark).toBe(false);
  });
  test('apply sets data-theme attribute', () => {
    theme.apply(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
