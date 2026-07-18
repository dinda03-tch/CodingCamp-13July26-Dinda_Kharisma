import { describe, test, expect, beforeEach } from 'vitest';
import { createStorageModule, createTaskModule } from '../helpers/moduleExports.js';

describe('TaskModule', () => {
  let storage, tasks;
  beforeEach(() => { storage = createStorageModule(); tasks = createTaskModule(storage); });

  test('addTask adds a task', () => {
    tasks.addTask('Write tests', 'Work');
    expect(tasks._tasks).toHaveLength(1);
    expect(tasks._tasks[0].text).toBe('Write tests');
  });
  test('addTask rejects empty text', () => {
    tasks.addTask('   ', 'Work');
    expect(tasks._tasks).toHaveLength(0);
  });
  test('deleteTask removes task', () => {
    tasks.addTask('A', 'Work');
    tasks.deleteTask(tasks._tasks[0].id);
    expect(tasks._tasks).toHaveLength(0);
  });
  test('toggleComplete flips completed', () => {
    tasks.addTask('B', 'Work');
    const id = tasks._tasks[0].id;
    tasks.toggleComplete(id);
    expect(tasks._tasks[0].completed).toBe(true);
  });
});
