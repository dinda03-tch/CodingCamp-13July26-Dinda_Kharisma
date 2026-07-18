import { describe, test, expect, beforeEach } from 'vitest';
import { createStorageModule } from '../helpers/moduleExports.js';

describe('StorageModule', () => {
  let storage;
  beforeEach(() => { storage = createStorageModule(); });

  test('get returns null for missing key', () => {
    expect(storage.get('missing')).toBeNull();
  });
  test('set and get round-trip', () => {
    storage.set('foo', { x: 1 });
    expect(storage.get('foo')).toEqual({ x: 1 });
  });
  test('remove deletes key', () => {
    storage.set('k', 'v');
    storage.remove('k');
    expect(storage.get('k')).toBeNull();
  });
  test('get returns null after corrupted data', () => {
    storage._store['bad'] = undefined;
    expect(storage.get('bad')).toBeNull();
  });
});
