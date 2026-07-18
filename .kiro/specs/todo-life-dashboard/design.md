# Design Document — To-Do Life Dashboard

## Overview

To-Do Life Dashboard adalah aplikasi web satu halaman (SPA) yang dibangun murni dengan HTML, CSS, dan Vanilla JavaScript tanpa framework atau library eksternal. Aplikasi ini mengintegrasikan enam komponen utama dalam satu layar: jam digital realtime, salam personal, Focus Timer berbasis Pomodoro, manajemen tugas (To-Do List) CRUD, Quick Links, dan Dark Mode. Semua data disimpan secara persisten di `localStorage` browser.

Pendekatan desain mengutamakan:
- **Simplicity**: Satu file HTML, satu file CSS, satu file JS — tidak ada build tool atau bundler.
- **Module Pattern**: Setiap fitur dibungkus dalam objek JavaScript dengan `init()` untuk separasi tanggung jawab.
- **CSS Custom Properties**: Seluruh sistem tema (light/dark mode) dikendalikan lewat variabel CSS pada `<html data-theme>`.
- **Event-Driven Updates**: Interaksi UI menggunakan event delegation dan listener terpusat.

---

## Architecture

```
Browser
  ├── index.html        ← markup semantic, referensikan style.css & script.js
  ├── style.css         ← variabel CSS, grid layout, dark mode, responsif
  └── script.js         ← semua modul JS (module pattern / IIFE)

script.js Modules
  ├── StorageModule     ← abstraksi localStorage
  ├── ClockModule       ← jam realtime + format tanggal
  ├── GreetingModule    ← sapaan berdasarkan jam + nama pengguna
  ├── TimerModule       ← Pomodoro Timer state machine
  ├── TaskModule        ← CRUD task + filter kategori
  ├── QuickLinksModule  ← CRUD quick links
  ├── ThemeModule       ← toggle light/dark mode
  └── App               ← entry point, init semua modul
```

Semua modul berkomunikasi lewat pemanggilan fungsi langsung. `App.init()` adalah entry point setelah DOMContentLoaded.

---

## Components and Interfaces

### Struktur File Project

```
CodingCamp-13July26-Dinda_Kharisma/
├── index.html      ← seluruh markup semantic HTML
├── style.css       ← styling, variabel CSS, layout grid, dark mode
└── script.js       ← semua logika JavaScript (module pattern)
```

### Struktur HTML Semantic

```html
<!DOCTYPE html>
<html lang="id" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Life Dashboard</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>

  <header>
    <span class="app-title">Life Dashboard</span>
    <div class="header-controls">
      <input id="user-name-input" type="text" placeholder="Your name..." aria-label="Your name" />
      <button id="save-name-btn">Save</button>
      <button id="theme-toggle" aria-label="Toggle dark mode">🌙</button>
    </div>
  </header>

  <section id="hero" aria-label="Clock and greeting">
    <div id="clock" aria-live="polite" aria-atomic="true"></div>
    <p id="date-display"></p>
    <p id="greeting" aria-live="polite"></p>
  </section>

  <main id="main-grid">
    <section id="focus-timer-section" aria-label="Focus Timer">
      <h2>Focus Timer</h2>
      <div id="timer-display" aria-live="polite" aria-atomic="true">25:00</div>
      <div class="timer-controls">
        <label for="timer-duration-input">Duration (min):</label>
        <input id="timer-duration-input" type="number" min="1" max="120" value="25" />
        <button id="timer-start-btn">Start</button>
        <button id="timer-pause-btn" disabled>Pause</button>
        <button id="timer-reset-btn">Reset</button>
      </div>
    </section>

    <section id="task-section" aria-label="Task List">
      <h2>Tasks</h2>
      <form id="task-form">
        <input id="task-input" type="text" placeholder="New task..." required />
        <select id="task-category-select">
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Study">Study</option>
          <option value="Health">Health</option>
          <option value="Other">Other</option>
        </select>
        <button type="submit">Add</button>
      </form>
      <ul id="task-list" aria-label="Task list"></ul>
    </section>
  </main>

  <section id="quick-links-section" aria-label="Quick Links">
    <h2>Quick Links</h2>
    <form id="quick-link-form">
      <input id="ql-label-input" type="text" placeholder="Label" required />
      <input id="ql-url-input" type="url" placeholder="https://..." required />
      <button type="submit">Add</button>
    </form>
    <div id="quick-links-list" role="list"></div>
  </section>

  <footer>
    <p id="storage-warning" role="alert" hidden></p>
  </footer>

  <script src="script.js"></script>
</body>
</html>
```

### Komponen JavaScript (Interfaces)

#### StorageModule

```js
const StorageModule = {
  isAvailable: false,
  init(),          // cek localStorage, set isAvailable, tampilkan warning jika gagal
  get(key),        // -> any | null   (JSON.parse, return null jika error)
  set(key, value), // -> void          (JSON.stringify)
  remove(key),     // -> void
};
```

#### ClockModule

```js
const ClockModule = {
  _intervalId: null,
  init(),              // mulai interval 1000ms
  formatTime(date),    // -> "HH:MM:SS"  — pure function
  formatDate(date),    // -> "Senin, 14 Juli 2025" — pure function
  render(date),        // -> void (update #clock dan #date-display)
  stop(),              // -> void (clearInterval)
};
```

#### GreetingModule

```js
const GreetingModule = {
  init(),                   // baca userName dari storage, render
  getGreeting(hour, name),  // -> string  — pure function
  render(),                 // -> void (update #greeting)
  saveName(name),           // -> void (validasi, simpan ke storage, re-render)
};
```

#### TimerModule

```js
const TimerModule = {
  _state: { duration: 1500, remaining: 1500, running: false },
  _intervalId: null,
  init(),                  // render tampilan awal, bind event
  formatSeconds(secs),     // -> "MM:SS"  — pure function
  start(),                 // -> void (set running=true, mulai interval)
  pause(),                 // -> void (set running=false, clearInterval)
  reset(),                 // -> void (remaining=duration, clearInterval)
  setDuration(minutes),    // -> void (validasi 1-120, update state, reset)
  render(),                // -> void (update #timer-display, toggle button state)
  _tick(),                 // -> void (kurangi remaining 1, cek 0)
  _onComplete(),           // -> void (stop, tampilkan notifikasi)
};
```

#### TaskModule

```js
const TaskModule = {
  _tasks: [],
  _activeFilter: 'All',
  init(),                      // baca dari storage, render
  addTask(text, category),     // -> void  | throw jika text kosong
  editTask(id, newText),       // -> void  | throw jika id tidak ada atau text kosong
  deleteTask(id),              // -> void
  toggleComplete(id),          // -> void
  setFilter(category),         // -> void
  getFilteredTasks(),          // -> Task[]  — pure function
  _save(),                     // -> void (simpan ke storage)
  renderList(),                // -> void (render ke #task-list)
  renderItem(task),            // -> HTMLElement  — pure function
};
```

#### QuickLinksModule

```js
const QuickLinksModule = {
  _links: [],
  init(),                   // baca dari storage, render
  addLink(label, url),      // -> void  | throw jika label/url kosong
  deleteLink(id),           // -> void
  _save(),                  // -> void
  renderList(),             // -> void (render ke #quick-links-list)
  renderItem(link),         // -> HTMLElement  — pure function
};
```

#### ThemeModule

```js
const ThemeModule = {
  _isDark: false,
  init(),          // baca preferensi dari storage, terapkan
  toggle(),        // -> void
  apply(isDark),   // -> void (set data-theme pada <html>, perbarui ikon toggle)
  _save(isDark),   // -> void
};
```

---

## Data Models

### Task Object

```js
{
  id: string,          // crypto.randomUUID() atau Date.now().toString()
  text: string,        // deskripsi tugas, non-empty setelah trim
  category: string,    // "Work" | "Personal" | "Study" | "Health" | "Other"
  completed: boolean,  // false saat pertama dibuat
  createdAt: number,   // timestamp Unix (Date.now())
}
```

### QuickLink Object

```js
{
  id: string,          // crypto.randomUUID() atau Date.now().toString()
  label: string,       // teks tampilan, non-empty setelah trim
  url: string,         // URL valid, non-empty setelah trim
  createdAt: number,   // timestamp Unix (Date.now())
}
```

### LocalStorage Schema

| Key          | Tipe          | Deskripsi                                        |
|--------------|---------------|--------------------------------------------------|
| `userName`   | `string`      | Nama pengguna. Default: `""` jika tidak ada      |
| `tasks`      | `Task[]`      | Array task ter-JSON-stringify                    |
| `quickLinks` | `QuickLink[]` | Array quick link ter-JSON-stringify              |
| `darkMode`   | `boolean`     | Preferensi tema. Default: `false`                |

Semua data disimpan via `JSON.stringify()` dan dibaca via `JSON.parse()`. Jika parse gagal, modul mereset ke nilai default.

---

## CSS Architecture

### Custom Properties

```css
:root {
  --color-bg:           #F0F7FF;
  --color-surface:      #FFFFFF;
  --color-text-primary: #1a2a3a;
  --color-text-muted:   #5a7a9a;
  --color-accent:       #1E90FF;
  --color-accent-dark:  #1570CC;
  --color-border:       #C8DDEF;
  --color-completed:    #a0b8cc;
  --hero-gradient:      linear-gradient(135deg, #1E3A5F 0%, #1E90FF 100%);

  --space-xs:  0.25rem;
  --space-sm:  0.5rem;
  --space-md:  1rem;
  --space-lg:  1.5rem;
  --space-xl:  2rem;

  --font-family:        'Segoe UI', system-ui, sans-serif;
  --font-size-clock:    clamp(3rem, 10vw, 5.5rem);
  --font-size-greeting: clamp(1rem, 3vw, 1.4rem);
  --font-size-timer:    clamp(2rem, 6vw, 3.5rem);

  --radius-sm:  4px;
  --radius-md:  8px;
  --radius-lg:  16px;
  --shadow:     0 2px 8px rgba(30,144,255,0.10);
  --transition: background-color 0.3s ease, color 0.3s ease;
}

[data-theme="dark"] {
  --color-bg:           #0d1b2a;
  --color-surface:      #1a2e42;
  --color-text-primary: #e8f4ff;
  --color-text-muted:   #7aaccc;
  --color-accent:       #4db8ff;
  --color-accent-dark:  #1E90FF;
  --color-border:       #2a4a6a;
  --color-completed:    #3a5a7a;
  --hero-gradient:      linear-gradient(135deg, #050e18 0%, #0d2d4a 100%);
  --shadow:             0 2px 8px rgba(0,0,0,0.40);
}
```

### Layout Grid

```css
/* Header — full width */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) var(--space-xl);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

/* Hero — full width, gradient */
#hero {
  background: var(--hero-gradient);
  text-align: center;
  padding: var(--space-xl);
  color: #ffffff;
}

/* Main — 2-column grid */
#main-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  padding: var(--space-lg);
  max-width: 1200px;
  margin: 0 auto;
}

/* Quick Links — full width di bawah grid */
#quick-links-section {
  padding: var(--space-lg);
  max-width: 1200px;
  margin: 0 auto var(--space-xl);
}

/* Responsive */
@media (max-width: 768px) {
  #main-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## Error Handling

### LocalStorage Tidak Tersedia

`StorageModule.init()` memverifikasi ketersediaan dengan write/read/delete dummy:

```js
init() {
  try {
    const key = '__test__';
    localStorage.setItem(key, '1');
    localStorage.removeItem(key);
    this.isAvailable = true;
  } catch (e) {
    this.isAvailable = false;
    // fallback: gunakan in-memory object
    const warn = document.getElementById('storage-warning');
    warn.textContent = 'Peringatan: LocalStorage tidak tersedia. Data tidak akan tersimpan.';
    warn.hidden = false;
  }
}
```

### Data Korup

Setiap pembacaan dari storage dibungkus try-catch:

```js
// Contoh di TaskModule.init()
try {
  const raw = StorageModule.get('tasks');
  this._tasks = Array.isArray(raw) ? raw : [];
} catch {
  this._tasks = [];
}
```

### Input Validation

| Input | Aturan Validasi |
|-------|-----------------|
| Task text | `text.trim() !== ''` |
| Quick link label | `label.trim() !== ''` |
| Quick link url | `url.trim() !== ''` |
| User name | `name.trim() !== ''` sebelum simpan |
| Timer duration | `!isNaN(val) && val >= 1 && val <= 120` |

### Timer State Table

| State   | Start | Pause | Reset | Duration Input |
|---------|-------|-------|-------|----------------|
| Stopped | ✓     | ✗     | ✓     | ✓              |
| Running | ✗     | ✓     | ✓     | ✗              |
| Paused  | ✓     | ✗     | ✓     | ✓              |

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

Sebelum menulis properties, redundansi telah dieliminasi:
- Req 5.1, 5.2, 5.3 (greeting per rentang waktu) → digabung menjadi **Property 2** (satu property komprehensif)
- Req 5.6 dan 5.7 (simpan + baca nama) → round-trip → **Property 3**
- Req 7.2, 7.8, 7.9 (add/edit/delete simpan ke storage) → digabung menjadi **Property 6** (mutasi task tersimpan)
- Req 9.3, 9.4, 9.5 (simpan + baca preferensi tema) → round-trip → **Property 12**
- Req 8.6 (baca quick links saat muat) + Req 8.2 (tambah tersimpan) → round-trip → **Property 10**

---

### Property 1: Format waktu Clock selalu valid

*For any* objek `Date` yang valid, fungsi `ClockModule.formatTime(date)` SHALL menghasilkan string yang sesuai format `HH:MM:SS` — dua digit jam (00–23), dua digit menit (00–59), dua digit detik (00–59), dipisahkan titik dua.

**Validates: Requirements 4.1**

---

### Property 2: Greeting memetakan jam ke salam yang benar dan mengandung nama

*For any* nilai jam integer (0–23) dan nama pengguna yang tidak kosong (setelah trim), fungsi `GreetingModule.getGreeting(hour, name)`:
- SHALL mengembalikan string yang mengandung `"Good Morning"` jika `hour` ∈ [0, 11],
- SHALL mengembalikan string yang mengandung `"Good Afternoon"` jika `hour` ∈ [12, 17],
- SHALL mengembalikan string yang mengandung `"Good Evening"` jika `hour` ∈ [18, 23],
- SHALL selalu mengandung `name` dalam string kembaliannya.

**Validates: Requirements 5.1, 5.2, 5.3, 5.4**

---

### Property 3: Round-trip persistensi nama pengguna

*For any* string nama pengguna non-empty (setelah trim), memanggil `GreetingModule.saveName(name)` lalu membaca kembali via `StorageModule.get('userName')` SHALL mengembalikan nilai yang identik dengan nama yang disimpan.

**Validates: Requirements 5.6, 5.7**

---

### Property 4: Format waktu Timer selalu valid

*For any* nilai integer detik antara 0 dan 7199 inklusif (0 menit 0 detik hingga 119 menit 59 detik), fungsi `TimerModule.formatSeconds(seconds)` SHALL menghasilkan string yang sesuai format `MM:SS` — dua digit menit dan dua digit detik.

**Validates: Requirements 6.1**

---

### Property 5: Reset timer mengembalikan ke durasi yang dikonfigurasi

*For any* nilai durasi valid (1–120 menit) yang dikonfigurasi via `TimerModule.setDuration(minutes)`, memanggil `TimerModule.reset()` SHALL mengeset `_state.remaining` menjadi `minutes * 60` dan mengeset `_state.running` menjadi `false`.

**Validates: Requirements 6.5, 6.8**

---

### Property 6: Mutasi task list tersimpan ke LocalStorage

*For any* operasi mutasi pada task list (addTask, editTask, deleteTask, toggleComplete), setelah operasi selesai, membaca dan mem-parse `StorageModule.get('tasks')` SHALL menghasilkan array yang secara struktural identik dengan state `_tasks` terkini.

**Validates: Requirements 7.2, 7.8, 7.9, 7.10**

---

### Property 7: Task dengan teks kosong atau whitespace-only ditolak

*For any* string yang seluruhnya terdiri dari karakter whitespace (termasuk string kosong `""`), memanggil `TaskModule.addTask(text, category)` SHALL tidak mengubah panjang `_tasks[]` dan SHALL tidak mengubah isi `localStorage`.

**Validates: Requirements 7.3**

---

### Property 8: Render task item mengandung semua komponen yang diperlukan

*For any* objek `Task` yang valid (dengan `id`, `text`, `category`, `completed`, `createdAt`), fungsi `TaskModule.renderItem(task)` SHALL menghasilkan `HTMLElement` yang mengandung: teks task, label kategori, elemen checkbox, tombol edit, dan tombol hapus.

**Validates: Requirements 7.5**

---

### Property 9: Toggle complete adalah involution (round-trip)

*For any* task dalam `_tasks[]`, memanggil `TaskModule.toggleComplete(id)` dua kali berturut-turut SHALL mengembalikan nilai `completed` task tersebut ke nilai aslinya (boolean asal).

**Validates: Requirements 7.6**

---

### Property 10: Round-trip persistensi Quick Link

*For any* pasangan `(label, url)` yang keduanya non-empty setelah trim, memanggil `QuickLinksModule.addLink(label, url)` lalu membaca `StorageModule.get('quickLinks')` SHALL menghasilkan array yang mengandung entry dengan `label` dan `url` yang identik dengan nilai yang ditambahkan.

**Validates: Requirements 8.2, 8.6**

---

### Property 11: Quick Link dengan field kosong ditolak

*For any* kombinasi label kosong (trim → `""`) atau URL kosong (trim → `""`), memanggil `QuickLinksModule.addLink(label, url)` SHALL tidak mengubah panjang atau isi `_links[]`.

**Validates: Requirements 8.3**

---

### Property 12: Round-trip persistensi preferensi tema

*For any* state dark mode awal (`true` atau `false`), memanggil `ThemeModule.toggle()` dua kali berturut-turut SHALL mengembalikan `_isDark` ke nilai aslinya, dan atribut `data-theme` pada `<html>` SHALL mencerminkan state tersebut (`"dark"` jika `true`, `"light"` jika `false`).

**Validates: Requirements 9.2, 9.3, 9.4, 9.5**

---

### Property 13: Filter kategori hanya mengembalikan task yang sesuai

*For any* kategori string yang ada dalam `_tasks[]` dan `_activeFilter` disetel ke kategori tersebut, `TaskModule.getFilteredTasks()` SHALL hanya mengembalikan task yang memiliki `category === _activeFilter`.

**Validates: Requirements 7.4**

---

### Property 14: Filter "All" mengembalikan semua task

*For any* daftar `_tasks[]` dan `_activeFilter = 'All'`, `TaskModule.getFilteredTasks()` SHALL mengembalikan array dengan panjang yang identik dengan `_tasks.length` dan mengandung semua task tanpa pengecualian.

**Validates: Requirements 7.4**

---

## Testing Strategy

### Library

- **Test Runner**: [Vitest](https://vitest.dev/)
- **Property-Based Testing**: [fast-check](https://fast-check.io/)
- **DOM**: Pure functions diuji tanpa DOM; fungsi DOM menggunakan jsdom via Vitest

Setiap property test dikonfigurasi dengan minimum **100 iterasi** (`numRuns: 100`).

### Struktur Test

```
tests/
├── unit/
│   ├── clock.test.js
│   ├── timer.test.js
│   ├── task.test.js
│   ├── quicklinks.test.js
│   ├── theme.test.js
│   ├── greeting.test.js
│   └── storage.test.js
└── property/
    ├── clock.property.test.js      # Property 1
    ├── greeting.property.test.js   # Property 2, 3
    ├── timer.property.test.js      # Property 4, 5
    ├── task.property.test.js       # Property 6, 7, 8, 9, 13, 14
    ├── quicklinks.property.test.js # Property 10, 11
    └── theme.property.test.js      # Property 12
```

### Contoh Property Test

```js
// Feature: todo-life-dashboard, Property 2: Greeting memetakan jam ke salam yang benar dan mengandung nama
test('greeting maps hour to correct salutation and includes name', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 0, max: 23 }),
      fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
      (hour, name) => {
        const result = GreetingModule.getGreeting(hour, name);
        if (hour <= 11) expect(result).toMatch(/Good Morning/);
        else if (hour <= 17) expect(result).toMatch(/Good Afternoon/);
        else expect(result).toMatch(/Good Evening/);
        expect(result).toContain(name.trim());
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: todo-life-dashboard, Property 9: Toggle complete adalah involution
test('toggleComplete twice restores original completed state', () => {
  fc.assert(
    fc.property(
      fc.record({
        id: fc.string({ minLength: 1 }),
        text: fc.string({ minLength: 1 }),
        category: fc.constantFrom('Work', 'Personal', 'Study', 'Health', 'Other'),
        completed: fc.boolean(),
        createdAt: fc.integer({ min: 0 }),
      }),
      (task) => {
        TaskModule._tasks = [task];
        const original = task.completed;
        TaskModule.toggleComplete(task.id);
        TaskModule.toggleComplete(task.id);
        expect(TaskModule._tasks[0].completed).toBe(original);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Integration Tests (Manual/E2E)

Perilaku berikut diverifikasi manual atau dengan Playwright:
- Clock memperbarui setiap detik saat halaman aktif
- Notifikasi timer muncul saat countdown mencapai 00:00
- Quick link membuka URL di tab baru
- Semua data (task, quick links, nama, tema) tersimpan setelah refresh halaman
