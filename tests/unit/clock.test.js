import { describe, test, expect } from 'vitest';
import { formatTime, formatDate } from '../helpers/moduleExports.js';

describe('ClockModule', () => {
  test('formatTime returns HH:MM:SS for midnight', () => {
    const d = new Date(2025, 0, 1, 0, 0, 0);
    expect(formatTime(d)).toBe('00:00:00');
  });
  test('formatTime pads single digits', () => {
    const d = new Date(2025, 0, 1, 9, 5, 3);
    expect(formatTime(d)).toBe('09:05:03');
  });
  test('formatDate returns Indonesian date string', () => {
    const d = new Date(2025, 6, 14); // July 14 2025 = Senin
    const result = formatDate(d);
    expect(result).toContain('2025');
    expect(result).toContain('Juli');
  });
});
