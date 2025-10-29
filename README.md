# 🕌 Informasi Sejarah Kacirebonan - WebAR

Website Augmented Reality untuk menampilkan informasi sejarah Kacirebonan menggunakan teknologi A-Frame dan Tailwind CSS.

---

## 📁 Struktur File

```
kacirebonan-ar/
│
├── index.html          # Halaman utama HTML
├── styles.css          # Custom CSS styles
├── script.js           # JavaScript logic
├── README.md           # Dokumentasi (file ini)
│
└── assets/             # Folder untuk aset (buat folder ini)
    └── models/         # Folder untuk model 3D
        └── keraton.glb # Model 3D keraton (upload file Anda)
```

---

## 🚀 Cara Deploy ke Netlify

### **Metode 1: Drag & Drop (Paling Mudah)**

1. **Persiapkan folder project:**
   ```
   kacirebonan-ar/
   ├── index.html
   ├── styles.css
   ├── script.js
   └── assets/
       └── models/
           └── keraton.glb
   ```

2. **Buka [Netlify](https://app.netlify.com/drop)**

3. **Drag & drop** folder `kacirebonan-ar` ke area upload

4. **Selesai!** Netlify akan otomatis deploy dan berikan URL HTTPS

---

### **Metode 2: Netlify CLI**

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login ke Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy project:**
   ```bash
   cd kacirebonan-ar
   netlify deploy --prod
   ```

4. **Pilih direktori:** `.` (current directory)

5. **Selesai!** Copy URL yang diberikan

---

### **Metode 3: GitHub + Netlify**

1. **Upload ke GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/kacirebonan-ar.git
   git push -u origin main
   ```

2. **Connect ke Netlify:**
   - Login ke [Netlify](https://app.netlify.com)
   - Klik "New site from Git"
   - Pilih repository GitHub Anda
   - Deploy settings biarkan default
   - Klik "Deploy site"

3. **Auto-deploy:** Setiap push ke GitHub akan otomatis deploy

---

## 🔧 Konfigurasi Model 3D

### **Mengganti Model 3D Sample**

1. **Upload file `keraton.glb` ke folder:**
   ```
   assets/models/keraton.glb
   ```

2. **Edit `index.html` di 2 tempat:**

   **Lokasi 1 - 3D Viewer (sekitar baris 75):**
   ```html
   <a-entity 
       id="model"
       gltf-model="url(./assets/models/keraton.glb)"
       ...
   ```

   **Lokasi 2 - AR Mode (sekitar baris 187):**
   ```html
   <a-entity 
       id="ar-model"
       gltf-model="url(./assets/models/keraton.glb)"
       ...
   ```

3. **Simpan dan re-deploy**

---

### **Hosting Model 3D di CDN (Alternatif)**

Jika file `.glb` terlalu besar, upload ke CDN:

1. **Upload ke service seperti:**
   - [GitHub Release](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)
   - [Cloudinary](https://cloudinary.com/)
   - [ImgBB](https://imgbb.com/) (support GLB)

2. **Gunakan URL direct link:**
   ```html
   gltf-model="url(https://cdn.example.com/keraton.glb)"
   ```

---

## 📝 Kustomisasi Konten

### **Mengganti Informasi Sejarah**

Edit file `index.html` di bagian "Info Card" (sekitar baris 105):

```html
<div class="p-6 md:p-8">
    <h2>Makam Sunan Gunung Jati</h2>
    <p>
        [Ganti dengan informasi sejarah Anda]
    </p>
</div>
```

---

### **Menambah Objek Sejarah Baru**

1. **Duplicate file `index.html`** → `makam.html`, `keraton.html`, dll.

2. **Buat QR Code untuk setiap file:**
   - Gunakan [QR Code Generator](https://www.qr-code-generator.com/)
   - Input URL: `https://yourdomain.netlify.app/makam.html`
   - Download dan print QR Code

3. **Ganti model & informasi** di masing-masing file

---

## 🎨 Kustomisasi Desain

### **Mengganti Warna Tema**

Edit file `index.html` di bagian `<body>`:

```html
<!-- Gradient background -->
<body class="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">

<!-- Ganti dengan warna pilihan Anda, contoh: -->
<body class="bg-gradient-to-br from-green-600 via-teal-600 to-blue-500">
```

### **Mengganti Font**

Tambahkan di `<head>` pada `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
```

Lalu edit di `styles.css`:

```css
body {
    font-family: 'Poppins', sans-serif;
}
```

---

## ⚙️ Konfigurasi Advanced

### **Mengubah Setting Model 3D**

Edit `script.js` di bagian `MODEL_CONFIG`:

```javascript
const MODEL_CONFIG = {
    minScale: 0.5,        // Minimum zoom
    maxScale: 5,          // Maximum zoom
    defaultScale: 2,      // Default scale
    arMinScale: 0.3,      // AR minimum zoom
    arMaxScale: 3,        // AR maximum zoom
    arDefaultScale: 1,    // AR default scale
    zoomStep: 0.3,        // Zoom increment
    arZoomStep: 0.2       // AR zoom increment
};
```

---

### **Mengubah Posisi Model di AR**

Edit `index.html` di bagian AR Model:

```html
<a-entity 
    id="ar-model"
    position="0 0 -2"     <!-- X Y Z coordinate -->
    scale="1 1 1"         <!-- Scale factor -->
    rotation="0 0 0"      <!-- X Y Z rotation -->
```

---

## 📱 Testing

### **Testing di Local (Tanpa HTTPS)**

AR Mode memerlukan HTTPS, tapi untuk testing local:

1. **Gunakan localhost:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx http-server
   ```

2. **Akses:** `http://localhost:8000`

3. **⚠️ Note:** AR Mode hanya berfungsi di HTTPS atau localhost

---

### **Testing di Mobile**

1. **Deploy ke Netlify** (otomatis HTTPS)
2. **Akses URL dari HP**
3. **Test fitur:**
   - ✅ 3D Viewer (drag, zoom)
   - ✅ AR Mode (kamera, zoom AR)
   - ✅ Responsive design

---

## 🐛 Troubleshooting

### **Model 3D tidak muncul**

✅ **Solusi:**
- Cek URL model sudah benar
- Pastikan file `.glb` sudah diupload
- Buka Console browser (F12) untuk lihat error
- Cek format file harus `.glb` bukan `.gltf`

---

### **AR Mode tidak bisa akses kamera**

✅ **Solusi:**
- Pastikan menggunakan **HTTPS** (bukan HTTP)
- Izinkan akses kamera di browser
- Cek permission kamera di HP settings
- Test di browser berbeda (Chrome recommended)

---

### **Website lambat/loading lama**

✅ **Solusi:**
- Kompres file `.glb` menggunakan [glTF Pipeline](https://github.com/KhronosGroup/glTF-Pipeline)
- Upload model ke CDN terpisah
- Optimize textures di Blender
- Enable lazy loading untuk gambar

---

### **Layout rusak di mobile**

✅ **Solusi:**
- Clear cache browser
- Cek Tailwind CSS sudah load
- Test di berbagai ukuran screen
- Gunakan Chrome DevTools responsive mode

---

## 📋 Checklist Deployment

- [ ] File `index.html`, `styles.css`, `script.js` sudah ada
- [ ] Model 3D `keraton.glb` sudah diupload
- [ ] URL model sudah diganti di 2 tempat (viewer & AR)
- [ ] Informasi sejarah sudah diganti
- [ ] Testing di localhost berhasil
- [ ] Deploy ke Netlify
- [ ] Testing di mobile dengan HTTPS
- [ ] AR Mode berfungsi dengan kamera
- [ ] Generate QR Code untuk link website
- [ ] Print QR Code

---

## 🔗 Resources & Links

- **A-Frame Documentation:** https://aframe.io/docs/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Netlify Docs:** https://docs.netlify.com/
- **glTF Sample Models:** https://github.com/KhronosGroup/glTF-Sample-Models
- **QR Code Generator:** https://www.qr-code-generator.com/

---

## 📄 License

MIT License - Free to use and modify

---

## 👨‍💻 Support

Jika ada pertanyaan atau butuh bantuan:
1. Buka issue di GitHub repository
2. Email: your-email@example.com
3. WhatsApp: +62xxx-xxxx-xxxx

---

## 🎯 Next Steps

1. ✅ Deploy website ke Netlify
2. ✅ Upload model 3D keraton
3. ✅ Generate QR Code
4. ✅ Print & pasang QR Code di lokasi
5. ✅ Test dengan pengunjung
6. 🚀 Scale to more locations!

---

**Made with ❤️ for Kacirebonan Cultural Heritage**
