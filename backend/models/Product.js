const mongoose = require('mongoose');

const productViewSchema = new mongoose.Schema({
    label: { type: String, required: true },
    image: { type: String, required: true },
}, { _id: false });

const dimensionSchema = new mongoose.Schema({
    height: { type: String, required: true },
    width: { type: String, required: true },
    depth: { type: String, required: true },
    weight: { type: String, required: true },
}, { _id: false });

const ratingBreakdownSchema = new mongoose.Schema({
    5: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    1: { type: Number, default: 0 },
}, { _id: false });

const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        index: true,
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative'],
    },
    oldPrice: {
        type: Number,
        min: [0, 'Old price cannot be negative'],
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, 'Discount cannot be negative'],
        max: [100, 'Discount cannot exceed 100%'],
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    totalRatings: {
        type: Number,
        default: 0,
    },
    reviews: {
        type: Number,
        default: 0,
    },
    dimensions: dimensionSchema,
    colors: [{ type: String }],
    image: {
        type: String,
        required: [true, 'Product image is required'],
    },
    productViews: [productViewSchema],
    ratingBreakdown: ratingBreakdownSchema,
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Text index for search
productSchema.index({ name: 'text', description: 'text' });

// Virtual for formatted price
productSchema.virtual('formattedPrice').get(function () {
    return `$${this.price.toFixed(2)}`;
});

// Virtual for savings
productSchema.virtual('savings').get(function () {
    if (this.oldPrice) {
        return parseFloat((this.oldPrice - this.price).toFixed(2));
    }
    return 0;
});

module.exports = mongoose.model('Product', productSchema);
