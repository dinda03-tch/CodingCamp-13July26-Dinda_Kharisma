# Implementation Plan: To-Do Life Dashboard

## Overview

Implementasi aplikasi web satu halaman menggunakan HTML, CSS, dan Vanilla JavaScript murni. Tiga file utama (`index.html`, `style.css`, `script.js`) dibuat secara inkremental — dimulai dari struktur HTML semantik, lalu sistem CSS dengan custom properties, kemudian setiap modul JavaScript diimplementasikan satu per satu dan diwiring di akhir. Semua data persisten disimpan di `localStorage`.

## Tasks

- [x] 1. Buat struktur file proyek dan HTML semantik
  - Buat file `index.html` di folder `CodingCamp-13July26-Dinda_Kharisma/` dengan struktur HTML5 semantik lengkap
  - Sertakan elemen `<header>`, `<section id="hero">`, `<main id="main-grid">`, `<section id="quick-links-section">`, dan `<footer>`
  - Tambahkan semua elemen UI yang diperlukan: `#clock`, `#date-display`, `#greeting`, `#timer-display`, `#task-list`, `#quick-links-list`, input fields, dan tombol-tombol
  - Tambahkan atribut `data-theme="light"` pada `<html>` dan `lang="id"`
  - Sertakan tag `<link>` untuk `style.css` di `<head>` dan `<script src="script.js">` di bawah `</body>`
  - Tambahkan atribut `aria-label`, `aria-live`, dan `role` untuk aksesibilitas
  - Buat file kosong `style.css` dan `script.js` di folder yang sama
  - _Requirements: 1.1, 1.3, 1.4, 2.1, 2.2, 10.1, 10.2_

- [x] 2. Implementasi sistem CSS dan layout
  - [x] 2.1 Tulis CSS custom properties (variabel) untuk light mode dan dark mode
    - Definisikan variabel warna (`--color-bg`, `--color-surface`, `--color-accent: #1E90FF`, dll.) pada `:root`
    - Definisikan override untuk `[data-theme="dark"]`
    - Tambahkan variabel spacing, typography, border-radius, shadow, dan transition
    - _Requirements: 2.4, 9.6_

  - [x] 2.2 Implementasi layout grid dan komponen visual
    - Buat layout sticky header dengan flexbox
    - Buat hero section dengan gradient background penuh lebar
    - Buat main-grid dua kolom menggunakan CSS Grid
    - Buat section quick-links full-width di bawah grid
    - Tambahkan card styling (rounded corners, shadow) untuk setiap section
    - Implementasi media query `@media (max-width: 768px)` untuk mengubah ke single column
    - Styling untuk task items (strikethrough saat completed), timer display, quick link cards
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3_

- [x] 3. Implementasi StorageModule dan ThemeModule
  - [x] 3.1 Implementasi StorageModule di `script.js`
    - Buat objek `StorageModule` dengan method `init()`, `get(key)`, `set(key, value)`, `remove(key)`
    - `init()` memverifikasi ketersediaan localStorage dengan write/read/delete dummy, tampilkan warning di `#storage-warning` jika gagal
    - Setiap `get()` dibungkus try-catch, kembalikan `null` jika parse gagal
    - _Requirements: 1.2_

  - [x] 3.2 Implementasi ThemeModule
    - Buat objek `ThemeModule` dengan method `init()`, `toggle()`, `apply(isDark)`, `_save(isDark)`
    - `init()` membaca preferensi dari `StorageModule.get('darkMode')` dan memanggil `apply()`
    - `toggle()` membalik `_isDark` dan memanggil `apply()` + `_save()`
    - `apply(isDark)` mengeset atribut `data-theme` pada `<html>` dan memperbarui ikon tombol toggle
    - Bind event listener pada `#theme-toggle`
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [ ]* 3.3 Tulis property test untuk ThemeModule
    - **Property 12: Round-trip persistensi preferensi tema**
    - **Validates: Requirements 9.2, 9.3, 9.4, 9.5**
    - Test bahwa `toggle()` dua kali berturut-turut mengembalikan `_isDark` ke nilai asli
    - Test bahwa `data-theme` pada `<html>` mencerminkan state yang benar

- [ ] 4. Implementasi ClockModule dan GreetingModule
  - [x] 4.1 Implementasi ClockModule
    - Buat objek `ClockModule` dengan method `init()`, `formatTime(date)`, `formatDate(date)`, `render(date)`, `stop()`
    - `formatTime(date)` menghasilkan string `HH:MM:SS` dengan zero-padding
    - `formatDate(date)` menghasilkan string tanggal lengkap (hari, tanggal, bulan, tahun) dalam bahasa Indonesia
    - `init()` memanggil `render()` sekali lalu set interval 1000ms
    - `render()` memperbarui `#clock` dan `#date-display`
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ]* 4.2 Tulis property test untuk ClockModule
    - **Property 1: Format waktu Clock selalu valid**
    - **Validates: Requirements 4.1**
    - Test bahwa `formatTime(date)` selalu menghasilkan string format `HH:MM:SS` yang valid untuk semua objek `Date`

  - [-] 4.3 Implementasi GreetingModule
    - Buat objek `GreetingModule` dengan method `init()`, `getGreeting(hour, name)`, `render()`, `saveName(name)`
    - `getGreeting(hour, name)` mengembalikan `"Good Morning"`, `"Good Afternoon"`, atau `"Good Evening"` sesuai jam, diikuti nama
    - `init()` membaca `userName` dari storage dan memanggil `render()`
    - `render()` memperbarui `#greeting` menggunakan jam saat ini
    - `saveName(name)` memvalidasi nama non-empty, simpan ke storage, re-render
    - Bind event pada `#save-name-btn` dan `#user-name-input` (event Enter)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [ ]* 4.4 Tulis property test untuk GreetingModule
    - **Property 2: Greeting memetakan jam ke salam yang benar dan mengandung nama**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**
    - **Property 3: Round-trip persistensi nama pengguna**
    - **Validates: Requirements 5.6, 5.7**

- [x] 5. Implementasi TimerModule
  - [x] 5.1 Implementasi TimerModule
    - Buat objek `TimerModule` dengan state `{ duration: 1500, remaining: 1500, running: false }`
    - Implementasi method `init()`, `formatSeconds(secs)`, `start()`, `pause()`, `reset()`, `setDuration(minutes)`, `render()`, `_tick()`, `_onComplete()`
    - `formatSeconds(secs)` menghasilkan string `MM:SS` dengan zero-padding
    - `start()` mulai interval 1000ms dan set `running = true`; nonaktifkan duration input
    - `pause()` stop interval, set `running = false`; aktifkan kembali duration input
    - `reset()` stop interval, `remaining = duration`, `running = false`; re-render
    - `setDuration(minutes)` validasi 1–120, update `duration` dan `remaining`, re-render
    - `_onComplete()` stop timer, tampilkan notifikasi `alert()` atau visual notification
    - `render()` memperbarui `#timer-display` dan toggle disabled state tombol-tombol
    - Bind event pada `#timer-start-btn`, `#timer-pause-btn`, `#timer-reset-btn`, dan `#timer-duration-input`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9_

  - [ ]* 5.2 Tulis property test untuk TimerModule
    - **Property 4: Format waktu Timer selalu valid**
    - **Validates: Requirements 6.1**
    - **Property 5: Reset timer mengembalikan ke durasi yang dikonfigurasi**
    - **Validates: Requirements 6.5, 6.8**

- [~] 6. Checkpoint — Pastikan semua modul dasar berfungsi
  - Pastikan semua tests pass, tanyakan kepada pengguna jika ada pertanyaan.

- [ ] 7. Implementasi TaskModule
  - [-] 7.1 Implementasi struktur data dan CRUD TaskModule
    - Buat objek `TaskModule` dengan `_tasks: []` dan `_activeFilter: 'All'`
    - Implementasi `init()`: baca tasks dari `StorageModule.get('tasks')`, fallback ke `[]` jika gagal/bukan array
    - Implementasi `addTask(text, category)`: validasi teks non-empty, buat objek Task dengan `id` (Date.now().toString()), `text`, `category`, `completed: false`, `createdAt`, simpan via `_save()`, re-render
    - Implementasi `editTask(id, newText)`: validasi id ada dan newText non-empty, update teks, `_save()`, re-render
    - Implementasi `deleteTask(id)`: filter dari `_tasks`, `_save()`, re-render
    - Implementasi `toggleComplete(id)`: flip boolean `completed`, `_save()`, re-render
    - Implementasi `_save()`: simpan `_tasks` ke storage
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.6, 7.7, 7.8, 7.9, 7.10_

  - [~] 7.2 Implementasi filter dan rendering TaskModule
    - Implementasi `setFilter(category)`: set `_activeFilter`, re-render
    - Implementasi `getFilteredTasks()`: kembalikan semua task jika `_activeFilter === 'All'`, atau filter berdasarkan kategori
    - Implementasi `renderList()`: render daftar tugas ke `#task-list` menggunakan `renderItem()`
    - Implementasi `renderItem(task)`: kembalikan `<li>` HTMLElement dengan checkbox, teks (strikethrough jika completed), label kategori, tombol edit, tombol hapus
    - Tambahkan filter buttons untuk kategori (All, Work, Personal, Study, Health, Other)
    - Bind event pada `#task-form` (submit), dan event delegation pada `#task-list` untuk complete/edit/delete
    - _Requirements: 7.4, 7.5, 7.6, 7.7_

  - [ ]* 7.3 Tulis property test untuk TaskModule
    - **Property 6: Mutasi task list tersimpan ke LocalStorage**
    - **Validates: Requirements 7.2, 7.8, 7.9, 7.10**
    - **Property 7: Task dengan teks kosong atau whitespace-only ditolak**
    - **Validates: Requirements 7.3**
    - **Property 8: Render task item mengandung semua komponen yang diperlukan**
    - **Validates: Requirements 7.5**
    - **Property 9: Toggle complete adalah involution (round-trip)**
    - **Validates: Requirements 7.6**
    - **Property 13: Filter kategori hanya mengembalikan task yang sesuai**
    - **Validates: Requirements 7.4**
    - **Property 14: Filter "All" mengembalikan semua task**
    - **Validates: Requirements 7.4**

- [ ] 8. Implementasi QuickLinksModule
  - [-] 8.1 Implementasi QuickLinksModule
    - Buat objek `QuickLinksModule` dengan `_links: []`
    - Implementasi `init()`: baca quick links dari `StorageModule.get('quickLinks')`, fallback ke `[]`
    - Implementasi `addLink(label, url)`: validasi label dan url non-empty setelah trim, buat objek QuickLink dengan `id`, `label`, `url`, `createdAt`, `_save()`, re-render
    - Implementasi `deleteLink(id)`: filter dari `_links`, `_save()`, re-render
    - Implementasi `_save()`: simpan `_links` ke storage
    - Implementasi `renderList()`: render semua link ke `#quick-links-list`
    - Implementasi `renderItem(link)`: kembalikan HTMLElement card dengan label, tombol hapus; klik card membuka URL di tab baru (`window.open(url, '_blank')`)
    - Bind event pada `#quick-link-form` (submit)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [ ]* 8.2 Tulis property test untuk QuickLinksModule
    - **Property 10: Round-trip persistensi Quick Link**
    - **Validates: Requirements 8.2, 8.6**
    - **Property 11: Quick Link dengan field kosong ditolak**
    - **Validates: Requirements 8.3**

- [x] 9. Setup test infrastructure dan konfigurasi Vitest
  - [x] 9.1 Inisialisasi package.json dan install dependensi test
    - Buat `package.json` di root folder `CodingCamp-13July26-Dinda_Kharisma/`
    - Install Vitest dan fast-check sebagai devDependencies
    - Tambahkan script `"test": "vitest --run"` di package.json
    - Buat `vitest.config.js` dengan environment `jsdom`
    - _Requirements: 1.2_

  - [x] 9.2 Buat file test untuk semua modul
    - Buat struktur folder `tests/unit/` dan `tests/property/`
    - Buat file test untuk setiap modul: `clock.test.js`, `timer.test.js`, `task.test.js`, `quicklinks.test.js`, `theme.test.js`, `greeting.test.js`, `storage.test.js`
    - Buat file property test: `clock.property.test.js`, `greeting.property.test.js`, `timer.property.test.js`, `task.property.test.js`, `quicklinks.property.test.js`, `theme.property.test.js`
    - Export pure functions dari `script.js` (atau buat file modul terpisah) agar dapat ditest
    - _Requirements: 1.2_

- [ ] 10. Wiring semua modul dan entry point App
  - [~] 10.1 Implementasi objek App dan inisialisasi semua modul
    - Buat objek `App` dengan method `init()`
    - `App.init()` memanggil semua modul secara berurutan: `StorageModule.init()`, `ThemeModule.init()`, `ClockModule.init()`, `GreetingModule.init()`, `TimerModule.init()`, `TaskModule.init()`, `QuickLinksModule.init()`
    - Tambahkan event listener `DOMContentLoaded` yang memanggil `App.init()`
    - Pastikan semua modul saling terintegrasi dan tidak ada circular dependency
    - _Requirements: 1.2, 2.1, 2.2_

  - [ ]* 10.2 Tulis unit tests untuk StorageModule
    - Test `get()`, `set()`, `remove()` dengan berbagai skenario termasuk data korup
    - Test fallback ke in-memory ketika localStorage tidak tersedia

- [~] 11. Final checkpoint — Pastikan semua tests pass dan aplikasi berjalan lengkap
  - Pastikan semua tests pass, tanyakan kepada pengguna jika ada pertanyaan.

## Notes

- Tasks bertanda `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap task mereferensikan requirements spesifik untuk traceability
- Checkpoints memastikan validasi inkremental
- Property tests memvalidasi correctness properties universal (Property 1–14)
- Unit tests memvalidasi contoh spesifik dan edge case
- Semua pure functions (formatTime, formatDate, getGreeting, formatSeconds, getFilteredTasks, renderItem) dapat ditest tanpa DOM
- `script.js` menggunakan module pattern (IIFE atau object literal) — pastikan pure functions di-export atau dapat diakses dari test environment

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "9.1"] },
    { "id": 2, "tasks": ["2.2", "3.1"] },
    { "id": 3, "tasks": ["3.2", "9.2"] },
    { "id": 4, "tasks": ["3.3", "4.1", "5.1"] },
    { "id": 5, "tasks": ["4.2", "4.3", "5.2"] },
    { "id": 6, "tasks": ["4.4", "7.1", "8.1"] },
    { "id": 7, "tasks": ["7.2", "8.2"] },
    { "id": 8, "tasks": ["7.3", "10.1"] },
    { "id": 9, "tasks": ["10.2"] }
  ]
}
```
