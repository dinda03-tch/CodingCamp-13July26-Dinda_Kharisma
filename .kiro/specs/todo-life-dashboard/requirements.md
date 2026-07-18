# Requirements Document

## Introduction

Todo Life Dashboard adalah sebuah aplikasi web satu halaman (single-page application) yang dibangun menggunakan HTML, CSS, dan Vanilla JavaScript murni tanpa dependensi eksternal. Dashboard ini menggabungkan jam digital realtime, greeting personal, Pomodoro Timer, manajemen tugas (To-Do List) dengan operasi CRUD penuh, dan Quick Links yang dapat dikustomisasi oleh pengguna. Semua data pengguna disimpan menggunakan LocalStorage browser. Antarmuka menggunakan layout satu halaman dengan jam dan timer di kolom kiri, daftar tugas di kolom kanan, dan Quick Links di bagian bawah. Tema menggunakan warna putih dan biru dengan dukungan Dark Mode. Proyek menghasilkan tiga file: `index.html`, `style.css`, dan `script.js` (menggunakan module pattern) di folder `CodingCamp-13July26-Dinda_Kharisma`.

## Glossary

- **Dashboard**: Antarmuka web satu halaman yang menampilkan semua fitur secara terpadu.
- **App**: Aplikasi Todo Life Dashboard secara keseluruhan.
- **ClockModule**: Modul JavaScript yang mengelola tampilan jam digital realtime.
- **GreetingModule**: Modul JavaScript yang mengelola sapaan personal berdasarkan waktu dan nama pengguna.
- **TimerModule**: Modul JavaScript yang mengelola Pomodoro Timer, termasuk konfigurasi durasi.
- **TodoModule**: Modul JavaScript yang mengelola operasi CRUD pada daftar tugas.
- **QuickLinksModule**: Modul JavaScript yang mengelola penambahan, penyimpanan, dan pembukaan tautan cepat.
- **ThemeModule**: Modul JavaScript yang mengelola pergantian antara Light Mode dan Dark Mode.
- **LocalStorage**: Mekanisme penyimpanan data browser yang digunakan untuk menyimpan semua data pengguna secara persisten.
- **CRUD**: Operasi Create, Read, Update, Delete pada item To-Do List.
- **Pomodoro Timer**: Timer fokus kerja dengan sesi berdurasi yang dapat dikonfigurasi, bawaan 25 menit.
- **Quick Link**: Tautan URL yang ditambahkan dan disimpan oleh pengguna, terbuka di tab baru.
- **Dark Mode**: Tema tampilan gelap yang kontras dengan Light Mode (putih-biru).
- **Light Mode**: Tema tampilan terang berbasis warna putih dan biru.
- **Module Pattern**: Pola penulisan JavaScript menggunakan IIFE atau ES6 module untuk enkapsulasi.

## Requirements

### Requirement 1: Struktur File dan Arsitektur Proyek

**User Story:** Sebagai developer, saya ingin file proyek terorganisir dalam tiga file terpisah menggunakan module pattern, sehingga kode mudah dipelihara dan dipahami.

#### Acceptance Criteria

1. THE App SHALL menghasilkan tiga file: `index.html`, `style.css`, dan `script.js` di dalam folder `CodingCamp-13July26-Dinda_Kharisma`.
2. THE `script.js` SHALL mengimplementasikan module pattern dengan modul-modul terpisah: ClockModule, GreetingModule, TimerModule, TodoModule, QuickLinksModule, dan ThemeModule.
3. THE `index.html` SHALL menggunakan semantic HTML dengan elemen-elemen seperti `<header>`, `<main>`, `<section>`, `<article>`, dan `<footer>`.
4. THE `index.html` SHALL mereferensikan `style.css` melalui tag `<link>` dan `script.js` melalui tag `<script>` di bagian bawah `<body>`.

---

### Requirement 2: Layout dan Antarmuka Satu Halaman

**User Story:** Sebagai pengguna, saya ingin melihat semua informasi dalam satu halaman dengan tata letak yang jelas, sehingga saya dapat mengakses semua fitur tanpa berpindah halaman.

#### Acceptance Criteria

1. THE Dashboard SHALL menampilkan layout dua kolom: kolom kiri menampilkan jam digital, greeting, dan Pomodoro Timer; kolom kanan menampilkan To-Do List.
2. THE Dashboard SHALL menampilkan bagian Quick Links di bawah area dua kolom.
3. THE Dashboard SHALL menggunakan card layout dengan sudut membulat dan shadow pada setiap komponen utama.
4. THE `style.css` SHALL mendefinisikan palet warna utama berbasis putih dan biru (minimal warna primer `#1E90FF` atau sejenisnya dan latar belakang `#FFFFFF` atau sejenisnya).

---

### Requirement 3: Responsivitas

**User Story:** Sebagai pengguna mobile, saya ingin tampilan dashboard menyesuaikan layar perangkat saya, sehingga saya dapat menggunakannya di smartphone maupun desktop.

#### Acceptance Criteria

1. WHEN lebar viewport kurang dari atau sama dengan 768px, THE Dashboard SHALL mengubah layout dari dua kolom menjadi satu kolom (stack vertikal).
2. THE `style.css` SHALL menggunakan CSS media queries untuk mengelola responsivitas.
3. WHILE tampilan satu kolom aktif, THE Dashboard SHALL memastikan semua elemen tetap dapat dibaca dan digunakan tanpa horizontal scroll.

---

### Requirement 4: Jam Digital Realtime

**User Story:** Sebagai pengguna, saya ingin melihat jam digital yang selalu diperbarui, sehingga saya tahu waktu saat ini tanpa membuka aplikasi lain.

#### Acceptance Criteria

1. THE ClockModule SHALL menampilkan jam, menit, dan detik dalam format HH:MM:SS pada elemen di kolom kiri.
2. WHEN halaman pertama kali dimuat, THE ClockModule SHALL langsung menampilkan waktu saat ini.
3. THE ClockModule SHALL memperbarui tampilan waktu setiap 1000 milidetik menggunakan `setInterval`.
4. THE ClockModule SHALL juga menampilkan tanggal lengkap (hari, tanggal, bulan, tahun) di bawah jam.

---

### Requirement 5: Greeting Otomatis Berdasarkan Waktu dan Nama

**User Story:** Sebagai pengguna, saya ingin melihat sapaan personal yang sesuai waktu dan nama saya, sehingga dashboard terasa lebih personal.

#### Acceptance Criteria

1. WHEN jam menunjukkan antara 00:00 hingga 11:59, THE GreetingModule SHALL menampilkan teks "Good Morning".
2. WHEN jam menunjukkan antara 12:00 hingga 17:59, THE GreetingModule SHALL menampilkan teks "Good Afternoon".
3. WHEN jam menunjukkan antara 18:00 hingga 23:59, THE GreetingModule SHALL menampilkan teks "Good Evening".
4. WHEN nama pengguna telah disimpan di LocalStorage, THE GreetingModule SHALL menampilkan sapaan dalam format "[Greeting], [Nama]" (contoh: "Good Morning, Charisma").
5. THE GreetingModule SHALL menyediakan input field agar pengguna dapat memasukkan atau mengubah nama mereka.
6. WHEN pengguna memasukkan nama dan menekan Enter atau tombol simpan, THE GreetingModule SHALL menyimpan nama ke LocalStorage dan memperbarui tampilan greeting secara langsung.
7. WHEN halaman dimuat ulang, THE GreetingModule SHALL membaca nama dari LocalStorage dan menampilkan greeting dengan nama tersebut.

---

### Requirement 6: Pomodoro Timer

**User Story:** Sebagai pengguna, saya ingin menggunakan Pomodoro Timer untuk sesi fokus kerja, sehingga saya dapat mengelola waktu dengan produktif.

#### Acceptance Criteria

1. WHEN halaman pertama kali dimuat, THE TimerModule SHALL menampilkan durasi bawaan 25 menit (1500 detik) dalam format MM:SS.
2. THE TimerModule SHALL menyediakan tombol Start, Pause, dan Reset.
3. WHEN pengguna menekan tombol Start, THE TimerModule SHALL memulai hitung mundur setiap 1000 milidetik.
4. WHEN timer sedang berjalan dan pengguna menekan tombol Pause, THE TimerModule SHALL menghentikan hitung mundur dan mempertahankan sisa waktu.
5. WHEN pengguna menekan tombol Reset, THE TimerModule SHALL mengembalikan timer ke durasi yang saat ini dikonfigurasi.
6. WHEN hitung mundur mencapai 00:00, THE TimerModule SHALL menampilkan notifikasi kepada pengguna bahwa sesi selesai dan menghentikan timer.
7. THE TimerModule SHALL menyediakan input field agar pengguna dapat mengubah durasi sesi dalam satuan menit.
8. WHEN pengguna mengubah nilai durasi pada input field dan mengonfirmasi, THE TimerModule SHALL memperbarui durasi timer dan mereset tampilan ke durasi baru.
9. WHEN timer sedang berjalan, THE TimerModule SHALL menonaktifkan input perubahan durasi.

---

### Requirement 7: To-Do List dengan CRUD dan LocalStorage

**User Story:** Sebagai pengguna, saya ingin mengelola daftar tugas dengan kemampuan menambah, mengedit, menandai selesai, dan menghapus tugas, sehingga saya dapat melacak pekerjaan sehari-hari.

#### Acceptance Criteria

1. THE TodoModule SHALL menyediakan input field dan tombol untuk menambahkan tugas baru (Create).
2. WHEN pengguna memasukkan teks tugas dan menekan Enter atau tombol tambah, THE TodoModule SHALL menambahkan item tugas baru ke daftar dan menyimpannya ke LocalStorage.
3. IF pengguna mencoba menambahkan tugas dengan input kosong, THEN THE TodoModule SHALL tidak menambahkan tugas dan memfokuskan kembali kursor ke input field.
4. WHEN halaman dimuat, THE TodoModule SHALL membaca semua item tugas dari LocalStorage dan menampilkannya (Read).
5. THE TodoModule SHALL menampilkan setiap item tugas dengan teks tugas, tombol/checkbox selesai, tombol edit, dan tombol hapus.
6. WHEN pengguna mengklik checkbox atau tombol selesai pada sebuah item, THE TodoModule SHALL menandai item tersebut sebagai selesai dengan tampilan visual berbeda (seperti strikethrough) dan memperbarui status di LocalStorage (Update).
7. WHEN pengguna mengklik tombol edit pada sebuah item, THE TodoModule SHALL mengubah teks item menjadi input yang dapat diedit.
8. WHEN pengguna selesai mengedit dan mengonfirmasi (Enter atau tombol simpan), THE TodoModule SHALL memperbarui teks item di daftar dan di LocalStorage (Update).
9. WHEN pengguna mengklik tombol hapus pada sebuah item, THE TodoModule SHALL menghapus item tersebut dari daftar dan dari LocalStorage (Delete).
10. THE TodoModule SHALL menyimpan semua item tugas sebagai array objek JSON di LocalStorage dengan kunci yang konsisten.

---

### Requirement 8: Quick Links

**User Story:** Sebagai pengguna, saya ingin menyimpan dan mengakses tautan-tautan penting dengan cepat, sehingga saya tidak perlu mengetik ulang URL yang sering dikunjungi.

#### Acceptance Criteria

1. THE QuickLinksModule SHALL menyediakan form dengan input nama tautan dan input URL untuk menambahkan Quick Link baru.
2. WHEN pengguna mengisi nama dan URL lalu menekan tombol tambah, THE QuickLinksModule SHALL menyimpan Quick Link ke LocalStorage dan menampilkannya sebagai card atau tombol.
3. IF pengguna mencoba menambahkan Quick Link dengan nama atau URL kosong, THEN THE QuickLinksModule SHALL tidak menyimpan Quick Link tersebut.
4. WHEN pengguna mengklik sebuah Quick Link, THE QuickLinksModule SHALL membuka URL tersebut di tab baru browser.
5. THE QuickLinksModule SHALL menyediakan tombol hapus pada setiap Quick Link untuk menghapusnya dari daftar dan LocalStorage.
6. WHEN halaman dimuat, THE QuickLinksModule SHALL membaca semua Quick Link dari LocalStorage dan menampilkannya.

---

### Requirement 9: Dark Mode

**User Story:** Sebagai pengguna, saya ingin dapat mengaktifkan Dark Mode untuk kenyamanan mata di lingkungan kurang cahaya, sehingga saya dapat menggunakan dashboard kapan saja.

#### Acceptance Criteria

1. THE Dashboard SHALL menyediakan tombol toggle Dark Mode yang terlihat di area header atau pojok halaman.
2. WHEN pengguna mengklik tombol toggle, THE ThemeModule SHALL beralih antara Light Mode dan Dark Mode secara instan.
3. WHEN Dark Mode aktif, THE ThemeModule SHALL menyimpan preferensi "dark" ke LocalStorage.
4. WHEN Light Mode aktif, THE ThemeModule SHALL menyimpan preferensi "light" ke LocalStorage.
5. WHEN halaman dimuat, THE ThemeModule SHALL membaca preferensi tema dari LocalStorage dan menerapkan tema yang tersimpan secara otomatis.
6. WHILE Dark Mode aktif, THE Dashboard SHALL menampilkan warna latar belakang gelap dan teks berwarna terang pada seluruh komponen.

---

### Requirement 10: Header

**User Story:** Sebagai pengguna, saya ingin melihat header yang informatif dan fungsional, sehingga saya dapat mengidentifikasi aplikasi dan mengakses kontrol utama.

#### Acceptance Criteria

1. THE Dashboard SHALL menampilkan elemen `<header>` yang berisi judul aplikasi ("Life Dashboard" atau sejenisnya) dan tombol toggle Dark Mode.
2. THE `<header>` SHALL menggunakan semantic HTML dan tetap berada di bagian atas halaman.
