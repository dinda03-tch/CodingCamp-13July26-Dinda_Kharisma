import { describe, test, expect } from 'vitest';
import { formatSeconds } from '../helpers/moduleExports.js';

describe('TimerModule', () => {
  test('formatSeconds 1500 = 25:00', () => {
    expect(formatSeconds(1500)).toBe('25:00');
  });
  test('formatSeconds 0 = 00:00', () => {
    expect(formatSeconds(0)).toBe('00:00');
  });
  test('formatSeconds pads single digits', () => {
    expect(formatSeconds(65)).toBe('01:05');
  });
});
