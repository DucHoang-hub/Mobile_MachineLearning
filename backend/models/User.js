const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false, // Không trả password trong query mặc định
    },
    phone: {
        type: String,
        trim: true,
    },
    address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        zipCode: { type: String, trim: true },
    },
    avatar: {
        type: String,
        default: '/images/avatars/default.png',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    // ============ RFM & Segmentation Fields ============
    // These fields will be computed/updated by the K-Means pipeline
    rfmScores: {
        recency: { type: Number, default: null },    // Days since last purchase
        frequency: { type: Number, default: null },   // Total number of orders
        monetary: { type: Number, default: null },    // Total spend amount
    },
    segment: {
        type: String,
        enum: ['VIP', 'Dormant', 'Casual', null],
        default: null,
    },
    lastPurchaseDate: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// ============ Pre-save Hook — Hash password trước khi lưu ============
userSchema.pre('save', async function (next) {
    // Chỉ hash khi password thực sự thay đổi
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// ============ Instance Method — So sánh password khi login ============
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Index for fast lookup
userSchema.index({ segment: 1 });

module.exports = mongoose.model('User', userSchema);
