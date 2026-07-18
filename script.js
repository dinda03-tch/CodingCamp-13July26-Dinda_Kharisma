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
