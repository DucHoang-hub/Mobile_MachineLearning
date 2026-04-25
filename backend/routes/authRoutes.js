const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');

// POST /api/auth/register — Tạo tài khoản mới
router.post('/register', register);

// POST /api/auth/login — Đăng nhập bằng email + password
router.post('/login', login);

// GET /api/auth/me?userId=xxx — Lấy thông tin user hiện tại
router.get('/me', getMe);

module.exports = router;
