const User = require('../models/User');
const { getIsConnected } = require('../config/database');
const { UserStore } = require('../data/memoryStore');

const toUserProfile = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || null,
    avatar: user.avatar || null,
    segment: user.segment || null,
    rfmScores: user.rfmScores || null,
});

// ============================================================
// Helper — Chọn data source (MongoDB hoặc In-Memory fallback)
// ============================================================
const getDataSource = () => (getIsConnected() ? User : UserStore);

// ============================================================
// POST /api/auth/register
// Tạo tài khoản mới và trả về profile để app auto-login
// ============================================================
const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const normalizedName = name?.trim();
        const normalizedEmail = email?.trim().toLowerCase();
        const normalizedPassword = password?.trim();
        const normalizedPhone = phone?.trim() || null;

        if (!normalizedName || !normalizedEmail || !normalizedPassword) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập đầy đủ họ tên, email và mật khẩu.',
            });
        }

        if (normalizedPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu phải có ít nhất 6 ký tự.',
            });
        }

        const DataSource = getDataSource();
        const existingUser = getIsConnected()
            ? await User.findOne({ email: normalizedEmail })
            : await DataSource.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email đã được sử dụng. Vui lòng dùng email khác.',
            });
        }

        const newUser = getIsConnected()
            ? await User.create({
                name: normalizedName,
                email: normalizedEmail,
                password: normalizedPassword,
                phone: normalizedPhone,
            })
            : await DataSource.create({
                name: normalizedName,
                email: normalizedEmail,
                password: normalizedPassword,
                phone: normalizedPhone,
            });

        const userProfile = toUserProfile(newUser);
        console.log(`✅ Register success: ${userProfile.email}`);

        return res.status(201).json({
            success: true,
            message: 'Đăng ký thành công!',
            data: {
                user: userProfile,
            },
        });
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Email đã được sử dụng. Vui lòng dùng email khác.',
            });
        }

        console.error('❌ Register error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server. Vui lòng thử lại sau.',
        });
    }
};

// ============================================================
// POST /api/auth/login
// Xác thực user bằng email + password, trả về profile kèm segment
// ============================================================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();

        // ── Validate input ──
        if (!normalizedEmail || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập email và mật khẩu.',
            });
        }

        const DataSource = getDataSource();
        let user;

        if (getIsConnected()) {
            // ── MongoDB Mode ──
            // Cần .select('+password') vì password có select: false trong schema
            user = await User.findOne({ email: normalizedEmail }).select('+password');

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Email hoặc mật khẩu không đúng.',
                });
            }

            // So sánh password đã hash
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Email hoặc mật khẩu không đúng.',
                });
            }
        } else {
            // ── In-Memory Mode (dev/demo) ──
            // Trong memory mode, chấp nhận mọi password vì seed data không có hash
            user = await DataSource.findOne({ email: normalizedEmail });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Email không tồn tại trong hệ thống.',
                });
            }
        }

        // ── Trả về profile user (KHÔNG bao gồm password) ──
        const userProfile = toUserProfile(user);

        console.log(`✅ Login success: ${user.email} (segment: ${user.segment || 'none'})`);

        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công!',
            data: {
                user: userProfile,
            },
        });

    } catch (error) {
        console.error('❌ Login error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Lỗi server. Vui lòng thử lại sau.',
        });
    }
};

// ============================================================
// GET /api/auth/me
// Lấy thông tin user hiện tại (dùng cho session check sau này)
// ============================================================
const getMe = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu userId.',
            });
        }

        const DataSource = getDataSource();
        const user = getIsConnected()
            ? await User.findById(userId)
            : await DataSource.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy user.',
            });
        }

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone || null,
                    avatar: user.avatar || null,
                    segment: user.segment || null,
                    rfmScores: user.rfmScores || null,
                },
            },
        });
    } catch (error) {
        console.error('❌ GetMe error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Lỗi server.',
        });
    }
};

module.exports = { register, login, getMe };
