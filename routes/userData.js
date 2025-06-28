const express = require('express');
const router = express.Router();
const multer = require('multer');

// Koneksi database
const db = require('../config/db');


// Setup multer untuk upload gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Middleware untuk override method _method=PUT
router.use((req, res, next) => {
  if (req.query._method === 'PUT') {
    req.method = 'PUT';
  }
  next();
});

// CREATE data user
router.post('/', upload.single('profile_photo'), (req, res) => {
  const {
    user_id,
    first_name,
    last_name,
    email,
    address,
    phone_number,
    date_of_birth,
    location,
    postal_code,
    gender
  } = req.body;

  const profile_photo = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO data_user 
    (user_id, first_name, last_name, email, address, phone_number, date_of_birth, location, postal_code, gender, profile_photo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    user_id, first_name, last_name, email, address, phone_number,
    date_of_birth, location, postal_code, gender, profile_photo
  ], (err, result) => {
    if (err) return res.status(500).json({ message: 'Gagal menyimpan data', error: err });
    res.json({ message: 'Data berhasil disimpan' });
  });
});

// READ data user
router.get('/:user_id', (req, res) => {
  const user_id = req.params.user_id;
  db.query('SELECT * FROM data_user WHERE user_id = ?', [user_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Gagal mengambil data', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Data tidak ditemukan' });
    res.json(results[0]);
  });
});

// UPDATE data user
router.put('/:user_id', upload.single('profile_photo'), (req, res) => {
  const user_id = req.params.user_id;

  const {
    first_name,
    last_name,
    email,
    address,
    phone_number,
    date_of_birth,
    location,
    postal_code,
    gender
  } = req.body;

  const profile_photo = req.file ? req.file.filename : null;

  let sql = `
    UPDATE data_user SET 
      first_name = ?, 
      last_name = ?, 
      email = ?, 
      address = ?, 
      phone_number = ?, 
      date_of_birth = ?, 
      location = ?, 
      postal_code = ?, 
      gender = ?
  `;

  const params = [
    first_name, last_name, email, address, phone_number,
    date_of_birth, location, postal_code, gender
  ];

  if (profile_photo) {
    sql += `, profile_photo = ?`;
    params.push(profile_photo);
  }

  sql += ` WHERE user_id = ?`;
  params.push(user_id);

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ message: 'Gagal update data', error: err });
    res.json({ message: 'Data berhasil diperbarui' });
  });
});

module.exports = router;
