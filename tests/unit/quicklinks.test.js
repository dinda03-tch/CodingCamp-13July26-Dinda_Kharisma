import { describe, test, expect, beforeEach } from 'vitest';
import { createStorageModule, createQuickLinksModule } from '../helpers/moduleExports.js';

describe('QuickLinksModule', () => {
  let storage, links;
  beforeEach(() => { storage = createStorageModule(); links = createQuickLinksModule(storage); });

  test('addLink adds a link', () => {
    links.addLink('Google', 'https://google.com');
    expect(links._links).toHaveLength(1);
  });
  test('addLink rejects empty label', () => {
    links.addLink('', 'https://google.com');
    expect(links._links).toHaveLength(0);
  });
  test('addLink rejects empty url', () => {
    links.addLink('Google', '');
    expect(links._links).toHaveLength(0);
  });
  test('deleteLink removes link', () => {
    links.addLink('G', 'https://g.com');
    links.deleteLink(links._links[0].id);
    expect(links._links).toHaveLength(0);
  });
});
