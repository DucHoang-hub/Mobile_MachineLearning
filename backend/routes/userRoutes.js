const express = require('express');
const router = express.Router();
// 🌟 Import file Model User bạn vừa gửi (hãy check lại chính xác đường dẫn từ file route đến file model nhé)
const User = require('../models/User');

// API: GET /api/users - Lấy toàn bộ danh sách người dùng từ MongoDB
router.get('/', async (req, res, next) => {
    try {
        // Sử dụng phương thức find() của Mongoose để lấy toàn bộ bản ghi
        const users = await User.find({});

        // Trả về kết quả cho Postman
        res.status(200).json({
            success: true,
            count: users.length,
            users: users
        });
    } catch (error) {
        // Nếu có lỗi (ví dụ: mất kết nối db), chuyển lỗi qua middleware errorHandler xử lý
        next(error);
    }
});

module.exports = router;