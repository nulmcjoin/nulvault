# BlockVault — Minecraft Bedrock Catalog

Starter website statis untuk GitHub Pages dengan katalog Addons, Texture/Resource Pack, Skin Pack, Maps, dan MCTemplate.

## Yang sudah tersedia
- Responsive gaming-style homepage, search, category filters, sort by newest/name.
- Catalog data in `data/catalog.json`.
- Scheduled RSS importer via GitHub Actions (`.github/workflows/update-catalog.yml`).
- Automatic deployment to GitHub Pages on push to `main`.
- Links lead to the original publisher; this project does not re-host packs.

## Publish on GitHub Pages
1. Buat repository publik baru, misalnya `blockvault`.
2. Upload semua file/folder dari ZIP ini ke root repository.
3. Buka **Settings → Pages**. Pada **Build and deployment**, pilih **GitHub Actions**.
4. Pastikan branch default bernama `main`.
5. Buka tab **Actions** dan jalankan `Deploy BlockVault to GitHub Pages` jika belum otomatis.
6. Situs akan muncul di `https://USERNAME.github.io/blockvault/`.

## Enable automatic catalog updates
1. Buka `data/sources.json`.
2. Tambahkan RSS feed publik dari situs komunitas yang mengizinkan pengindeksan. Format:
   ```json
   [
     {
       "name": "Nama sumber",
       "url": "https://contoh.com/feed/",
       "enabled": true
     }
   ]
   ```
3. Commit file. Workflow akan mencoba memperbarui katalog dan berjalan dua kali sehari.
4. Buka **Actions → Update community catalog → Run workflow** untuk uji manual.

### Catatan penting
- RSS feed yang disediakan sumber bisa berubah atau memblokir akses otomatis. Periksa tab Actions jika gagal.
- Importer mengambil judul, ringkasan, tanggal, dan URL dari RSS; ia tidak bisa menjamin versi Minecraft, lisensi, atau tanggal rilis jika sumber tidak menyediakannya. Kolom versi sengaja ditandai **Periksa sumber**.
- `data/sources.json` awal memuat feed MCPEDL sebagai contoh konfigurasi. Jika feed gagal atau hasilnya kosong, cek Actions dan ganti/tambah feed yang masih aktif.
- Jadwal GitHub Actions tidak selalu berjalan tepat pada menit yang ditentukan. Jadwal berjalan dalam UTC.
- GitHub Pages adalah hosting statis. Pembaruan terjadwal dijalankan oleh GitHub Actions, bukan oleh browser.
- Jangan mirror atau mengunggah ulang file Marketplace berbayar. Tautkan pengguna ke sumber resmi/kreator, dan cantumkan unduhan langsung hanya jika pemilik konten mengizinkan distribusi.
- Tambahkan penjelasan lisensi/izin per sumber sebelum mengaktifkan tautan unduhan langsung.
- Website ini independen dan tidak berafiliasi dengan Mojang/Microsoft/Minecraft.

## Local preview
Open `index.html` in a browser. It will show sample cards until `data/catalog.json` contains entries. For local automatic importing, install Python 3 and run:
```bash
python -m pip install
python scripts/update_catalog.py
```
The importer uses only Python standard-library modules.
