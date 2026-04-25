const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative'],
    },
}, { _id: false });

const orderSchema = new mongoose.Schema({
    // ============ RFM-Critical Fields ============
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required'],
        index: true,
    },
    orderDate: {
        type: Date,
        required: [true, 'Order date is required'],
        index: true,
    },
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required'],
        min: [0, 'Total amount cannot be negative'],
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'],
        default: 'Completed',
    },
    // ============ Additional Order Details ============
    items: [orderItemSchema],
    shippingAddress: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
    },
    paymentMethod: {
        type: String,
        enum: ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash on Delivery'],
        default: 'Credit Card',
    },
    orderNumber: {
        type: String,
        unique: true,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Compound index for RFM queries
orderSchema.index({ user: 1, orderDate: -1 });
orderSchema.index({ status: 1 });

// Pre-save: auto-generate order number
orderSchema.pre('save', function (next) {
    if (!this.orderNumber) {
        this.orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
