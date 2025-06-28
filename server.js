require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;


// ===== Middleware =====
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const productRoutes = require('./routes/product');
app.use('/api/products', productRoutes);

const userDataRoutes = require('./routes/userData');
app.use('/api/userdata', userDataRoutes);

const cartRoutes = require('./routes/cart');
app.use('/api/carts', cartRoutes);

const orderRoutes = require('./routes/orders');
app.use('/api/orders', orderRoutes);

// ===== Koneksi Database =====
const db = require('./config/db');

// ===== Konfigurasi Upload Gambar Produk =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/products'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// ===== API: Tambah Produk =====
app.post('/api/products', upload.array('images', 6), (req, res) => {
  const { name, category, stock, price, weight, description, sizes } = req.body;

  if (!name || !category || !price) {
    return res.status(400).json({ message: 'Nama, kategori, dan harga wajib diisi' });
  }

  const imagePaths = req.files.map(file => file.path.replace(/\\/g, '/'));
  const sizeArray = JSON.parse(sizes);

  db.query(
    'INSERT INTO products (name, category, stock, price, weight, description, images, sizes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, category, stock, price, weight, description, JSON.stringify(imagePaths), JSON.stringify(sizeArray), 'active'],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Gagal tambah produk', error: err });
      res.status(200).json({ message: 'Produk berhasil ditambahkan', productId: result.insertId });
    }
  );
});

// ===== API: Ambil Semua Produk =====
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, result) => {
    if (err) return res.status(500).json({ message: 'Gagal ambil produk', error: err });
    res.status(200).json(result);
  });
});

// ===== API: Hapus Produk Permanen =====
app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  db.query('DELETE FROM products WHERE id = ?', [productId], (err, result) => {
    if (err) {
      console.error('Gagal menghapus produk:', err);
      return res.status(500).json({ message: 'Gagal menghapus produk', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    res.status(200).json({ message: 'Produk berhasil dihapus' });
  });
});

// ===== API: Update Status Produk =====
//app.put('/api/products/:id/status', (req, res) => {
//  const { status } = req.body;
//  const productId = req.params.id;
//  db.query(
//    'UPDATE products SET status = ? WHERE id = ?',
//    [status, productId],
//    err => {
//      if (err) return res.status(500).json({ message: 'Gagal update status', error: err });
//      res.status(200).json({ message: `Status produk berhasil diubah ke ${status}` });
//    }
//  );
//});

// === SIGNUP
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  const hashed = bcrypt.hashSync(password, 10);
  const role = 'user';

  db.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashed, role],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Gagal daftar', error: err });

      const userId = result.insertId;
      db.query(
        'INSERT INTO data_user (user_id, email) VALUES (?, ?)',
        [userId, email],
        (err2) => {
          if (err2) return res.status(500).json({ message: 'Gagal insert ke data_user', error: err2 });
          res.status(200).json({ message: 'Signup berhasil', user: { id: userId, name, email, role } });
        }
      );
    }
  );
});

// === SIGNIN
app.post('/api/signin', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ message: 'User tidak ditemukan' });

    const valid = bcrypt.compareSync(password, results[0].password);
    if (!valid) return res.status(401).json({ message: 'Password salah' });

    const { id, name, email: userEmail, role } = results[0];
    res.json({ message: 'Login berhasil', user: { id, name, email: userEmail, role } });
  });
});

// Ambil detail satu produk
app.get('/api/products/:id', (req, res) => {
  db.query('SELECT * FROM products WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Gagal ambil produk' });
    if (result.length === 0) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.status(200).json(result[0]);
  });
});




// === Tambah admin default
function tambahAdminJikaBelumAda() {
  const emailAdmin = 'dsapatuan@admin.com';
  const namaAdmin = 'Admin';
  const passwordAdmin = 'admin123';
  const roleAdmin = 'admin';

  db.query('SELECT * FROM users WHERE email = ?', [emailAdmin], (err, results) => {
    if (err) return console.error('Gagal mengecek admin:', err);
    if (results.length > 0) return console.log('Admin sudah terdaftar.');

    const hashedPassword = bcrypt.hashSync(passwordAdmin, 10);
    db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [namaAdmin, emailAdmin, hashedPassword, roleAdmin],
      (err2) => {
        if (err2) return console.error('Gagal menambahkan admin:', err2);
        console.log('Admin berhasil ditambahkan.');
      }
    );
  });
}
tambahAdminJikaBelumAda();

app.listen(PORT, () => {
  console.log(`Backend berjalan di http://localhost:${PORT}`);
});
