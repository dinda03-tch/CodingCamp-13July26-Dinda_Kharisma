// tests/helpers/moduleExports.js
// Pure function re-implementations for testing
// (script.js is a browser-only file with no ES module exports)

export function formatTime(date) {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

export function formatDate(date) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function getGreeting(hour, name) {
  let salutation;
  if (hour >= 0 && hour <= 11) salutation = 'Good Morning';
  else if (hour >= 12 && hour <= 17) salutation = 'Good Afternoon';
  else salutation = 'Good Evening';
  return `${salutation}, ${name.trim()}`;
}

export function formatSeconds(secs) {
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export function createStorageModule() {
  const store = {};
  return {
    isAvailable: false,
    _store: store,
    get(key) {
      try { return key in store ? JSON.parse(JSON.stringify(store[key])) : null; }
      catch { return null; }
    },
    set(key, value) { store[key] = value; },
    remove(key) { delete store[key]; },
  };
}

export function createTaskModule(storage) {
  const mod = {
    _tasks: [],
    _activeFilter: 'All',
    _storage: storage,
    addTask(text, category) {
      if (!text || !text.trim()) return;
      const task = { id: Date.now().toString() + Math.random(), text: text.trim(), category: category || 'Other', completed: false, createdAt: Date.now() };
      this._tasks.push(task);
      this._save();
    },
    editTask(id, newText) {
      if (!newText || !newText.trim()) return;
      const t = this._tasks.find(t => t.id === id);
      if (t) { t.text = newText.trim(); this._save(); }
    },
    deleteTask(id) { this._tasks = this._tasks.filter(t => t.id !== id); this._save(); },
    toggleComplete(id) { const t = this._tasks.find(t => t.id === id); if (t) { t.completed = !t.completed; this._save(); } },
    setFilter(cat) { this._activeFilter = cat; },
    getFilteredTasks() { return this._activeFilter === 'All' ? [...this._tasks] : this._tasks.filter(t => t.category === this._activeFilter); },
    _save() { this._storage.set('tasks', this._tasks); },
    renderItem(task) {
      const li = document.createElement('li');
      const span = document.createElement('span');
      span.className = 'task-text';
      span.textContent = task.text;
      const cat = document.createElement('span');
      cat.className = 'task-category';
      cat.textContent = task.category;
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = task.completed;
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.dataset.action = 'edit';
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.dataset.action = 'delete';
      li.append(cb, span, cat, editBtn, delBtn);
      return li;
    },
  };
  return mod;
}

export function createQuickLinksModule(storage) {
  return {
    _links: [],
    _storage: storage,
    addLink(label, url) {
      if (!label || !label.trim() || !url || !url.trim()) return;
      this._links.push({ id: Date.now().toString(), label: label.trim(), url: url.trim(), createdAt: Date.now() });
      this._save();
    },
    deleteLink(id) { this._links = this._links.filter(l => l.id !== id); this._save(); },
    _save() { this._storage.set('quickLinks', this._links); },
  };
}

export function createThemeModule(storage) {
  return {
    _isDark: false,
    _storage: storage,
    toggle() { this._isDark = !this._isDark; this.apply(this._isDark); this._save(this._isDark); },
    apply(isDark) { document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light'); },
    _save(isDark) { this._storage.set('darkMode', isDark); },
  };
}
