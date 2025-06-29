const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const db = require('../config/db');


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/products/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Tambah produk
router.post('/', upload.array('images', 6), (req, res) => {
  const { name, category, stock, price, weight, description, sizes } = req.body;
  if (!name || !category || !price) {
    return res.status(400).json({ message: 'Data wajib diisi' });
  }

  const imageList = req.files.map(f => f.path.replace(/\\/g, '/'));
  const imageJson = JSON.stringify(imageList);
  const sizeJson = JSON.stringify(JSON.parse(sizes));

  db.query(
    `INSERT INTO products 
    (name, category, stock, price, weight, description, sizes, images, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, category, stock, price, weight, description, sizeJson, imageJson, 'active'],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(200).json({ id: result.insertId });
    }
  );
});

// Hapus permanen
router.delete('/:id', (req, res) => {
  const productId = req.params.id;
  db.query('DELETE FROM products WHERE id = ?', [productId], (err, result) => {
    if (err) {
      console.error('Gagal menghapus produk:', err);
      return res.status(500).json({ message: 'Gagal menghapus produk', error: err });
    }
    res.status(200).json({ message: 'Produk berhasil dihapus permanen' });
  });
});



// Update data produk + gambar
// route PUT /api/products/:id (update teks + gambar)
router.put('/:id', upload.array('images', 6), (req, res) => {
  const { name, category, stock, price, weight, description, sizes, oldImages } = req.body;
  let imagesArr = Array.isArray(oldImages) ? oldImages : JSON.parse(oldImages || '[]');
  const newImages = req.files.map(f => f.path.replace(/\\/g, '/'));
  imagesArr = [...imagesArr, ...newImages];

  const imageJson = JSON.stringify(imagesArr);
  const sizeJson = JSON.stringify(JSON.parse(sizes));

  db.query(
    `UPDATE products SET
      name=?, category=?, stock=?, price=?, weight=?, description=?, sizes=?, images=?
     WHERE id=?`,
    [name, category, stock, price, weight, description, sizeJson, imageJson, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Gagal update produk', error: err });
      res.json({ message: 'Produk berhasil diperbarui' });
    }
  );
});


// Get produk by ID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM products WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Gagal ambil produk:', err);
      return res.status(500).json({ message: 'Gagal ambil produk', error: err });
    }
    if (result.length === 0) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.status(200).json(result[0]);
  });
});

router.get('/recommended/top-selling', (req, res) => {
  const sql = `
    SELECT 
      p.id, p.name, p.price, p.images,
      SUM(oi.quantity) AS total_sold
    FROM products p
    JOIN order_items oi ON p.id = oi.product_id
    GROUP BY p.id
    ORDER BY total_sold DESC
    LIMIT 6
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Gagal mengambil produk rekomendasi', error: err });

    const formatted = results.map(row => ({
      id: row.id,
      name: row.name,
      price: row.price,
      image: JSON.parse(row.images || '[]')[0] || null, // ambil gambar pertama
    }));

    res.json(formatted);
  });
});


module.exports = router;
