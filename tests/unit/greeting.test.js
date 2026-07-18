import { describe, test, expect } from 'vitest';
import { getGreeting } from '../helpers/moduleExports.js';

describe('GreetingModule', () => {
  test('morning at hour 6', () => {
    expect(getGreeting(6, 'Dinda')).toContain('Good Morning');
  });
  test('afternoon at hour 14', () => {
    expect(getGreeting(14, 'Dinda')).toContain('Good Afternoon');
  });
  test('evening at hour 20', () => {
    expect(getGreeting(20, 'Dinda')).toContain('Good Evening');
  });
  test('greeting includes name', () => {
    expect(getGreeting(10, 'Kharisma')).toContain('Kharisma');
  });
});
