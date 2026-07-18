import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { createStorageModule, createTaskModule } from '../helpers/moduleExports.js';

// **Validates: Requirements 7.2, 7.8, 7.9, 7.10**
describe('Property 6: Task mutations persist to storage', () => {
  test('after addTask, storage matches _tasks', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        fc.constantFrom('Work', 'Personal', 'Study', 'Health', 'Other'),
        (text, cat) => {
          const storage = createStorageModule();
          const tasks = createTaskModule(storage);
          tasks.addTask(text, cat);
          expect(storage.get('tasks')).toEqual(tasks._tasks);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// **Validates: Requirements 7.3**
describe('Property 7: Empty task text rejected', () => {
  test('whitespace-only task not added', () => {
    fc.assert(
      fc.property(
        fc.stringOf(fc.constantFrom(' ', '\t', '\n')),
        (ws) => {
          const storage = createStorageModule();
          const tasks = createTaskModule(storage);
          const before = tasks._tasks.length;
          tasks.addTask(ws, 'Work');
          expect(tasks._tasks.length).toBe(before);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// **Validates: Requirements 7.6**
describe('Property 9: toggleComplete is involution', () => {
  test('double toggle restores original state', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (completed) => {
          const storage = createStorageModule();
          const tasks = createTaskModule(storage);
          const task = { id: '1', text: 'test', category: 'Work', completed, createdAt: 0 };
          tasks._tasks = [task];
          tasks.toggleComplete('1');
          tasks.toggleComplete('1');
          expect(tasks._tasks[0].completed).toBe(completed);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// **Validates: Requirements 7.4**
describe('Property 13 & 14: Filter behavior', () => {
  test('category filter returns only matching tasks', () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom('Work', 'Personal', 'Study'), { minLength: 1, maxLength: 10 }),
        fc.constantFrom('Work', 'Personal', 'Study'),
        (categories, filter) => {
          const storage = createStorageModule();
          const tasks = createTaskModule(storage);
          categories.forEach((cat, i) => tasks.addTask(`Task ${i}`, cat));
          tasks.setFilter(filter);
          const result = tasks.getFilteredTasks();
          result.forEach(t => expect(t.category).toBe(filter));
        }
      ),
      { numRuns: 100 }
    );
  });

  test('All filter returns all tasks', () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom('Work', 'Personal'), { minLength: 0, maxLength: 10 }),
        (categories) => {
          const storage = createStorageModule();
          const tasks = createTaskModule(storage);
          categories.forEach((cat, i) => tasks.addTask(`Task ${i}`, cat));
          tasks.setFilter('All');
          expect(tasks.getFilteredTasks().length).toBe(tasks._tasks.length);
        }
      ),
      { numRuns: 100 }
    );
  });
});
