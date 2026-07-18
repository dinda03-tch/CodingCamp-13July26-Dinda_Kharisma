'use strict';

/* ============================================================
   StorageModule — localStorage abstraction with in-memory fallback
   Requirements: 1.2
   ============================================================ */

const StorageModule = {
  isAvailable: false,
  _store: {},

  init() {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, '1');
      localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      this.isAvailable = true;
    } catch (e) {
      this.isAvailable = false;
      const warn = document.getElementById('storage-warning');
      if (warn) {
        warn.textContent = 'Peringatan: LocalStorage tidak tersedia. Data tidak akan tersimpan.';
        warn.hidden = false;
      }
    }
  },

  get(key) {
    try {
      if (this.isAvailable) {
        const raw = localStorage.getItem(key);
        if (raw === null) return null;
        return JSON.parse(raw);
      }
      return key in this._store ? this._store[key] : null;
    } catch (e) {
      return null;
    }
  },

  set(key, value) {
    try {
      if (this.isAvailable) {
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        this._store[key] = value;
      }
    } catch (e) {
      // silently fail
    }
  },

  remove(key) {
    try {
      if (this.isAvailable) {
        localStorage.removeItem(key);
      } else {
        delete this._store[key];
      }
    } catch (e) {
      // silently fail
    }
  },
};

/* ============================================================
   ThemeModule — toggle light/dark mode, persist preference
   Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6
   ============================================================ */

const ThemeModule = {
  _isDark: false,

  init() {
    const saved = StorageModule.get('darkMode');
    this._isDark = saved === true;
    this.apply(this._isDark);

    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', () => this.toggle());
    }
  },

  toggle() {
    this._isDark = !this._isDark;
    this.apply(this._isDark);
    this._save(this._isDark);
  },

  apply(isDark) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = isDark ? '☀️' : '🌙';
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
  },

  _save(isDark) {
    StorageModule.set('darkMode', isDark);
  },
};

/* ============================================================
   ClockModule — realtime digital clock + date display
   Requirements: 4.1, 4.2, 4.3, 4.4
   ============================================================ */

const ClockModule = {
  _intervalId: null,

  init() {
    this.render(new Date());
    this._intervalId = setInterval(() => this.render(new Date()), 1000);
  },

  formatTime(date) {
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  },

  formatDate(date) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const dayName = days[date.getDay()];
    const dayNum = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    return `${dayName}, ${dayNum} ${monthName} ${year}`;
  },

  render(date) {
    const clockEl = document.getElementById('clock');
    const dateEl = document.getElementById('date-display');
    const now = date || new Date();
    if (clockEl) clockEl.textContent = this.formatTime(now);
    if (dateEl) dateEl.textContent = this.formatDate(now);
  },

  stop() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  },
};

/* ============================================================
   TimerModule — Pomodoro Timer state machine
   Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9
   ============================================================ */

const TimerModule = {
  _state: { duration: 1500, remaining: 1500, running: false },
  _intervalId: null,

  init() {
    this.render();
    const startBtn = document.getElementById('timer-start-btn');
    const pauseBtn = document.getElementById('timer-pause-btn');
    const resetBtn = document.getElementById('timer-reset-btn');
    const durationInput = document.getElementById('timer-duration-input');

    if (startBtn) startBtn.addEventListener('click', () => this.start());
    if (pauseBtn) pauseBtn.addEventListener('click', () => this.pause());
    if (resetBtn) resetBtn.addEventListener('click', () => this.reset());
    if (durationInput) {
      durationInput.addEventListener('change', (e) => {
        const val = parseInt(e.target.value, 10);
        this.setDuration(val);
      });
    }
  },

  formatSeconds(secs) {
    const mm = String(Math.floor(secs / 60)).padStart(2, '0');
    const ss = String(secs % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  },

  start() {
    if (this._state.running) return;
    this._state.running = true;
    this._intervalId = setInterval(() => this._tick(), 1000);
    this.render();
  },

  pause() {
    if (!this._state.running) return;
    clearInterval(this._intervalId);
    this._intervalId = null;
    this._state.running = false;
    this.render();
  },

  reset() {
    clearInterval(this._intervalId);
    this._intervalId = null;
    this._state.running = false;
    this._state.remaining = this._state.duration;
    this.render();
  },

  setDuration(minutes) {
    const val = parseInt(minutes, 10);
    if (isNaN(val) || val < 1 || val > 120) return;
    this._state.duration = val * 60;
    this._state.remaining = val * 60;
    this._state.running = false;
    clearInterval(this._intervalId);
    this._intervalId = null;
    this.render();
  },

  render() {
    const display = document.getElementById('timer-display');
    const startBtn = document.getElementById('timer-start-btn');
    const pauseBtn = document.getElementById('timer-pause-btn');
    const resetBtn = document.getElementById('timer-reset-btn');
    const durationInput = document.getElementById('timer-duration-input');

    if (display) display.textContent = this.formatSeconds(this._state.remaining);
    if (startBtn) startBtn.disabled = this._state.running;
    if (pauseBtn) pauseBtn.disabled = !this._state.running;
    if (resetBtn) resetBtn.disabled = false;
    if (durationInput) durationInput.disabled = this._state.running;
  },

  _tick() {
    if (this._state.remaining <= 0) {
      this._onComplete();
      return;
    }
    this._state.remaining -= 1;
    if (this._state.remaining === 0) {
      this.render();
      this._onComplete();
    } else {
      this.render();
    }
  },

  _onComplete() {
    clearInterval(this._intervalId);
    this._intervalId = null;
    this._state.running = false;
    this.render();
    // Show browser notification
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification('Focus Session Complete!', {
        body: 'Great work! Time for a break.',
        icon: 'favicon.ico',
      });
    } else {
      alert('⏰ Focus session complete! Great work, time for a break!');
    }
  },
};

/* ============================================================
   QuickLinksModule — CRUD quick links, persist to localStorage
   Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6
   ============================================================ */

const QuickLinksModule = {
  _links: [],

  init() {
    try {
      const raw = StorageModule.get('quickLinks');
      this._links = Array.isArray(raw) ? raw : [];
    } catch {
      this._links = [];
    }
    this.renderList();

    const form = document.getElementById('quick-link-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const labelInput = document.getElementById('ql-label-input');
        const urlInput = document.getElementById('ql-url-input');
        if (!labelInput || !urlInput) return;
        this.addLink(labelInput.value, urlInput.value);
        labelInput.value = '';
        urlInput.value = '';
        labelInput.focus();
      });
    }
  },

  addLink(label, url) {
    if (!label || !label.trim() || !url || !url.trim()) return;
    const link = {
      id: Date.now().toString(),
      label: label.trim(),
      url: url.trim(),
      createdAt: Date.now(),
    };
    this._links.push(link);
    this._save();
    this.renderList();
  },

  deleteLink(id) {
    this._links = this._links.filter(l => l.id !== id);
    this._save();
    this.renderList();
  },

  _save() {
    StorageModule.set('quickLinks', this._links);
  },

  renderList() {
    const container = document.getElementById('quick-links-list');
    if (!container) return;
    container.innerHTML = '';
    this._links.forEach(link => {
      container.appendChild(this.renderItem(link));
    });
  },

  renderItem(link) {
    // Card container
    const card = document.createElement('div');
    card.className = 'quick-link-card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Open ${link.label}`);

    // Label
    const labelEl = document.createElement('span');
    labelEl.className = 'quick-link-label';
    labelEl.textContent = link.label;

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'quick-link-delete';
    deleteBtn.textContent = '✕';
    deleteBtn.setAttribute('aria-label', `Delete ${link.label}`);
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent card click
      this.deleteLink(link.id);
    });

    // Clicking the card opens URL in new tab
    card.addEventListener('click', () => {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    });

    // Keyboard accessibility: Enter/Space activates card
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.open(link.url, '_blank', 'noopener,noreferrer');
      }
    });

    card.appendChild(labelEl);
    card.appendChild(deleteBtn);
    return card;
  },
};

/* ============================================================
   GreetingModule — time-based greeting + user name persistence
   Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7
   ============================================================ */

const GreetingModule = {
  _userName: '',

  init() {
    const saved = StorageModule.get('userName');
    this._userName = (typeof saved === 'string') ? saved : '';
    this.render();

    const saveBtn = document.getElementById('save-name-btn');
    const nameInput = document.getElementById('user-name-input');

    if (nameInput && this._userName) {
      nameInput.value = this._userName;
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const input = document.getElementById('user-name-input');
        if (input) this.saveName(input.value);
      });
    }

    if (nameInput) {
      nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.saveName(nameInput.value);
      });
    }
  },

  getGreeting(hour, name) {
    let salutation;
    if (hour >= 0 && hour <= 11) salutation = 'Good Morning';
    else if (hour >= 12 && hour <= 17) salutation = 'Good Afternoon';
    else salutation = 'Good Evening';
    const trimmed = (name || '').trim();
    return trimmed ? `${salutation}, ${trimmed}` : salutation;
  },

  render() {
    const el = document.getElementById('greeting');
    if (el) {
      el.textContent = this.getGreeting(new Date().getHours(), this._userName);
    }
  },

  saveName(name) {
    if (!name || !name.trim()) return;
    this._userName = name.trim();
    StorageModule.set('userName', this._userName);
    this.render();
  },
};

/* ============================================================
   TaskModule — CRUD To-Do list with category filter + LocalStorage
   Requirements: 7.1, 7.2, 7.3, 7.4, 7.6, 7.7, 7.8, 7.9, 7.10
   ============================================================ */

const TaskModule = {
  _tasks: [],
  _activeFilter: 'All',

  init() {
    try {
      const raw = StorageModule.get('tasks');
      this._tasks = Array.isArray(raw) ? raw : [];
    } catch {
      this._tasks = [];
    }
    this.renderList();
  },

  /**
   * Add a new task.
   * Throws if text is empty/whitespace; silently ignores to match test expectations.
   * Requirements: 7.2, 7.3
   */
  addTask(text, category) {
    if (!text || !text.trim()) return;
    const task = {
      id: Date.now().toString(),
      text: text.trim(),
      category: category || 'Other',
      completed: false,
      createdAt: Date.now(),
    };
    this._tasks.push(task);
    this._save();
    this.renderList();
  },

  /**
   * Edit an existing task's text.
   * Does nothing if id not found or newText is empty.
   * Requirements: 7.7, 7.8
   */
  editTask(id, newText) {
    if (!newText || !newText.trim()) return;
    const task = this._tasks.find(t => t.id === id);
    if (!task) return;
    task.text = newText.trim();
    this._save();
    this.renderList();
  },

  /**
   * Delete a task by id.
   * Requirements: 7.9
   */
  deleteTask(id) {
    this._tasks = this._tasks.filter(t => t.id !== id);
    this._save();
    this.renderList();
  },

  /**
   * Flip the completed boolean for a task.
   * Requirements: 7.6
   */
  toggleComplete(id) {
    const task = this._tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this._save();
      this.renderList();
    }
  },

  /**
   * Set the active category filter.
   * Requirements: 7.4
   */
  setFilter(category) {
    this._activeFilter = category;
    this.renderList();
  },

  /**
   * Return tasks matching the current filter — pure function.
   * Requirements: 7.4
   */
  getFilteredTasks() {
    if (this._activeFilter === 'All') return [...this._tasks];
    return this._tasks.filter(t => t.category === this._activeFilter);
  },

  /**
   * Persist _tasks array to storage.
   * Requirements: 7.10
   */
  _save() {
    StorageModule.set('tasks', this._tasks);
  },

  /**
   * Render the full task list into #task-list.
   * Stub: full rendering (filter buttons, event delegation) is completed in task 7.2.
   * Requirements: 7.2, 7.5
   */
  renderList() {
    const list = document.getElementById('task-list');
    if (!list) return;
    list.innerHTML = '';
    const filtered = this.getFilteredTasks();
    filtered.forEach(task => list.appendChild(this.renderItem(task)));
  },

  /**
   * Build and return a <li> element for a single task — pure function.
   * Stub: buttons are present but event wiring is completed in task 7.2.
   * Requirements: 7.5
   */
  renderItem(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    if (task.completed) li.classList.add('completed');

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = task.completed;
    cb.setAttribute('aria-label', 'Mark complete');

    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;
    if (task.completed) textSpan.style.textDecoration = 'line-through';

    const catSpan = document.createElement('span');
    catSpan.className = 'task-category';
    catSpan.textContent = task.category;

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'task-edit-btn';
    editBtn.dataset.action = 'edit';
    editBtn.setAttribute('aria-label', `Edit task: ${task.text}`);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'task-delete-btn';
    delBtn.dataset.action = 'delete';
    delBtn.setAttribute('aria-label', `Delete task: ${task.text}`);

    li.append(cb, textSpan, catSpan, editBtn, delBtn);
    return li;
  },
};

/* ============================================================
   App — entry point, initialise all modules in order
   Requirements: 1.2, 2.1, 2.2
   ============================================================ */

const App = {
  init() {
    StorageModule.init();
    ThemeModule.init();
    ClockModule.init();
    GreetingModule.init();
    TimerModule.init();
    TaskModule.init();
    QuickLinksModule.init();
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
