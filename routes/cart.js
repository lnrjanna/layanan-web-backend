const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Tambah ke keranjang
router.post('/', (req, res) => {
  const { user_id, product_id, size, quantity, checked } = req.body;

  if (!user_id || !product_id || !size) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  const sql = `
    INSERT INTO carts (user_id, product_id, size, quantity, checked)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
  `;

  db.query(sql, [user_id, product_id, size, quantity || 1, checked ?? true], (err) => {
    if (err) return res.status(500).json({ message: 'Gagal tambah ke keranjang', error: err });
    res.status(200).json({ message: 'Berhasil ditambahkan ke keranjang' });
  });
});

// Ambil isi keranjang berdasarkan user_id
router.get('/:user_id', (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT 
      c.id AS cart_id,
      c.quantity,
      c.size,
      c.checked,
      p.id AS product_id,
      p.name AS product_name,
      p.price,
      p.images
    FROM carts c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;

  db.query(query, [user_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Gagal ambil keranjang', error: err });

    // parse images
    const data = result.map(item => ({
      ...item,
      images: JSON.parse(item.images || '[]')
    }));

    res.status(200).json(data);
  });
});

// Proses checkout (konfirmasi pembayaran)
router.post('/checkout', (req, res) => {
  const { user_id, items, total_price, address, payment_method } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Keranjang kosong' });
  }

  db.query(
    'INSERT INTO orders (user_id, total_price, shipping_address, payment_method) VALUES (?, ?, ?, ?)',
    [user_id, total_price, address, payment_method],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Gagal membuat pesanan', error: err });

      const orderId = result.insertId;
      const values = items.map(item => [orderId, item.product_id, item.quantity, item.size, item.price]);

      db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, size, price) VALUES ?',
        [values],
        (err2) => {
          if (err2) return res.status(500).json({ message: 'Gagal menyimpan item pesanan', error: err2 });

          // Hapus item dari keranjang
          db.query('DELETE FROM carts WHERE user_id = ?', [user_id], () => {
            res.status(200).json({ message: 'Checkout berhasil' });
          });
        }
      );
    }
  );
});


module.exports = router;
