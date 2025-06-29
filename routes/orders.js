const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Ambil semua pesanan (untuk admin)
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      o.id AS order_id,
      o.status,
      o.order_date,
      o.total_price,
      o.user_id,

      oi.id AS item_id,
      oi.product_id,
      oi.quantity,
      oi.size,
      oi.price,

      p.name AS product_name,
      p.images AS product_images

    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    ORDER BY o.order_date DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Gagal ambil semua pesanan', error: err });

    // Grupkan item berdasarkan order_id
    const ordersMap = {};
    results.forEach(row => {
      const orderId = row.order_id;
      if (!ordersMap[orderId]) {
        ordersMap[orderId] = {
          id: orderId,
          status: row.status,
          order_date: row.order_date,
          total_price: row.total_price,
          user_id: row.user_id,
          items: []
        };
      }

      ordersMap[orderId].items.push({
        id: row.item_id,
        name: row.product_name,
        image: JSON.parse(row.product_images || '[]')[0],
        size: row.size,
        quantity: row.quantity,
        price: row.price
      });
    });

    const orders = Object.values(ordersMap);
    res.json(orders);
  });
});


// Ambil semua pesanan berdasarkan user_id
router.get('/:user_id', (req, res) => {
  const user_id = req.params.user_id;

  const sql = `
    SELECT 
      o.id AS order_id,
      o.status,
      o.order_date,
      o.total_price,
      o.shipping_address,
      o.payment_method,

      oi.id AS item_id,
      oi.product_id,
      oi.quantity,
      oi.size,
      oi.price,

      p.name AS product_name,
      p.images AS product_images

    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    ORDER BY o.order_date DESC
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Gagal ambil pesanan', error: err });

    // Grupkan item berdasarkan order_id
    const ordersMap = {};
    results.forEach(row => {
      const orderId = row.order_id;
      if (!ordersMap[orderId]) {
        ordersMap[orderId] = {
          id: orderId,
          status: row.status,
          order_date: row.order_date,
          total_price: row.total_price,
          shipping_address: row.shipping_address,
          payment_method: row.payment_method,
          items: []
        };
      }

      ordersMap[orderId].items.push({
        id: row.item_id,
        name: row.product_name,
        image: JSON.parse(row.product_images || '[]')[0], // ambil gambar pertama
        size: row.size,
        quantity: row.quantity,
        price: row.price
      });
    });

    const orders = Object.values(ordersMap);
    res.json(orders);
  });
});


// Ambil detail satu pesanan (termasuk item-itemnya)
router.get('/detail/:order_id', (req, res) => {
  const { order_id } = req.params;

  const orderQuery = 'SELECT * FROM orders WHERE id = ?';
  const itemsQuery = `
    SELECT oi.*, p.name AS product_name, p.images 
    FROM order_items oi 
    JOIN products p ON oi.product_id = p.id 
    WHERE oi.order_id = ?
  `;

  db.query(orderQuery, [order_id], (err, orderResults) => {
    if (err) return res.status(500).json({ message: 'Gagal mengambil data pesanan', error: err });
    if (orderResults.length === 0) return res.status(404).json({ message: 'Pesanan tidak ditemukan' });

    db.query(itemsQuery, [order_id], (err2, itemResults) => {
      if (err2) return res.status(500).json({ message: 'Gagal mengambil item pesanan', error: err2 });

      // Parse image JSON jika perlu
      const items = itemResults.map(item => ({
        ...item,
        images: JSON.parse(item.images || '[]')
      }));

      res.status(200).json({
        order: orderResults[0],
        items
      });
    });
  });
});

// Update status pesanan (misal: packed, delivered, done, canceled)
router.put('/status/:order_id', (req, res) => {
  const { order_id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ message: 'Status tidak boleh kosong' });

  db.query(
    'UPDATE orders SET status = ? WHERE id = ?',
    [status, order_id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Gagal memperbarui status pesanan', error: err });
      res.status(200).json({ message: 'Status pesanan berhasil diperbarui' });
    }
  );
});

// Ubah status order ke 'PACKED' dan kirim notifikasi
router.put('/:order_id/accept', (req, res) => {
  const { order_id } = req.params;

  const updateSql = `UPDATE orders SET status = 'PACKED' WHERE id = ?`;

  db.query(updateSql, [order_id], (err) => {
    if (err) return res.status(500).json({ message: 'Gagal update status', error: err });

    // Ambil user_id dari order
    db.query(`SELECT user_id FROM orders WHERE id = ?`, [order_id], (err2, result) => {
      if (err2 || result.length === 0) return res.status(500).json({ message: 'Gagal ambil user' });

      const user_id = result[0].user_id;

      // Simpan notifikasi
      const notifSql = `INSERT INTO notifications (user_id, message) VALUES (?, ?)`;
      const message = 'Your order is being packed';
      db.query(notifSql, [user_id, message], (err3) => {
        if (err3) return res.status(500).json({ message: 'Gagal kirim notifikasi', error: err3 });
        res.status(200).json({ message: 'Pesanan diupdate ke PACKED dan notifikasi dikirim' });
      });
    });
  });
});

router.put('/:order_id/next-status', (req, res) => {
  const { order_id } = req.params;

  // Urutan status
  const statusFlow = ['pending', 'PACKED', 'DELIVERED', 'DONE'];

  // Ambil status sekarang
  db.query('SELECT status, user_id FROM orders WHERE id = ?', [order_id], (err, result) => {
    if (err || result.length === 0) return res.status(500).json({ message: 'Gagal ambil status', error: err });

    const currentStatus = result[0].status;
    const user_id = result[0].user_id;
    const currentIndex = statusFlow.indexOf(currentStatus);

    if (currentIndex === -1 || currentIndex === statusFlow.length - 1) {
      return res.status(400).json({ message: 'Status tidak dapat diperbarui' });
    }

    const nextStatus = statusFlow[currentIndex + 1];

    db.query('UPDATE orders SET status = ? WHERE id = ?', [nextStatus, order_id], (err2) => {
      if (err2) return res.status(500).json({ message: 'Gagal update status', error: err2 });

      // Kirim notifikasi ke user
      const notifMessage = nextStatus === 'PACKED'
        ? 'Your order is being packed'
        : nextStatus === 'DELIVERED'
        ? 'Your order is on delivery'
        : nextStatus === 'DONE'
        ? 'Your order has arrived'
        : '';

      if (!notifMessage) return res.status(200).json({ message: `Status updated to ${nextStatus}` });

      db.query('INSERT INTO notifications (user_id, message) VALUES (?, ?)', [user_id, notifMessage], (err3) => {
        if (err3) return res.status(500).json({ message: 'Gagal kirim notifikasi', error: err3 });
        res.status(200).json({ message: `Status updated to ${nextStatus}` });
      });
    });
  });
});



module.exports = router;
