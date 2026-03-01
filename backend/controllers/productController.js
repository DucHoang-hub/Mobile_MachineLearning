const ProductModel = require('../models/Product');
const { ProductStore } = require('../data/memoryStore');
const { getIsConnected } = require('../config/database');

// Dynamic model selector - MongoDB or In-Memory
const getProduct = () => getIsConnected() ? ProductModel : ProductStore;

// @desc    Get all products (with pagination, search, filter, sort)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const Product = getProduct();
        const {
            page = 1,
            limit = 10,
            search,
            category,
            minPrice,
            maxPrice,
            minRating,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            discount,
        } = req.query;

        // Build filter query
        const filter = { isActive: true };

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        if (category) {
            filter.category = { $regex: `^${category}$`, $options: 'i' };
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        if (minRating) {
            filter.rating = { $gte: parseFloat(minRating) };
        }

        if (discount === 'true') {
            filter.discount = { $gt: 0 };
        }

        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const [products, total] = await Promise.all([
            Product.find(filter).sort(sort).skip(skip).limit(limitNum).lean(),
            Product.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            data: products,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalItems: total,
                itemsPerPage: limitNum,
                hasNextPage: pageNum < Math.ceil(total / limitNum),
                hasPrevPage: pageNum > 1,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products',
            error: error.message,
        });
    }
};

// @desc    Get single product by productId
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const Product = getProduct();
        const product = await Product.findOne({
            productId: req.params.id,
            isActive: true,
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product',
            error: error.message,
        });
    }
};

// @desc    Get products by category
// @route   GET /api/products/category/:categoryName
// @access  Public
const getProductsByCategory = async (req, res) => {
    try {
        const Product = getProduct();
        const { categoryName } = req.params;
        const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc' } = req.query;

        const filter = {
            category: { $regex: `^${categoryName}$`, $options: 'i' },
            isActive: true,
        };

        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const [products, total] = await Promise.all([
            Product.find(filter).sort(sort).skip(skip).limit(limitNum).lean(),
            Product.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            category: categoryName,
            data: products,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalItems: total,
                itemsPerPage: limitNum,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products by category',
            error: error.message,
        });
    }
};

// @desc    Search products
// @route   GET /api/products/search/:query
// @access  Public
const searchProducts = async (req, res) => {
    try {
        const Product = getProduct();
        const { query } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const filter = {
            isActive: true,
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
            ],
        };

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const [products, total] = await Promise.all([
            Product.find(filter).skip(skip).limit(limitNum).lean(),
            Product.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            query,
            data: products,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalItems: total,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Search failed',
            error: error.message,
        });
    }
};

// @desc    Get similar products
// @route   GET /api/products/:id/similar
// @access  Public
const getSimilarProducts = async (req, res) => {
    try {
        const Product = getProduct();
        const product = await Product.findOne({ productId: req.params.id });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        const limit = parseInt(req.query.limit) || 4;

        const similarProducts = await Product.find({
            category: product.category,
            productId: { $ne: product.productId },
            isActive: true,
        }).limit(limit).lean();

        res.status(200).json({
            success: true,
            data: similarProducts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch similar products',
            error: error.message,
        });
    }
};

// @desc    Get featured/trending products
// @route   GET /api/products/featured/list
// @access  Public
const getFeaturedProducts = async (req, res) => {
    try {
        const Product = getProduct();
        const limit = parseInt(req.query.limit) || 8;

        const products = await Product.find({ isActive: true })
            .sort({ rating: -1 })
            .limit(limit)
            .lean();

        res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch featured products',
            error: error.message,
        });
    }
};

// @desc    Get offer/discounted products
// @route   GET /api/products/offers/list
// @access  Public
const getOfferProducts = async (req, res) => {
    try {
        const Product = getProduct();
        const limit = parseInt(req.query.limit) || 8;

        const products = await Product.find({
            isActive: true,
            discount: { $gt: 0 },
        }).sort({ discount: -1 }).limit(limit).lean();

        res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch offer products',
            error: error.message,
        });
    }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Public
const createProduct = async (req, res) => {
    try {
        const Product = getProduct();
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Product with this ID already exists',
            });
        }
        res.status(400).json({
            success: false,
            message: 'Failed to create product',
            error: error.message,
        });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public
const updateProduct = async (req, res) => {
    try {
        const Product = getProduct();
        const product = await Product.findOneAndUpdate(
            { productId: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to update product',
            error: error.message,
        });
    }
};

// @desc    Delete a product (soft delete)
// @route   DELETE /api/products/:id
// @access  Public
const deleteProduct = async (req, res) => {
    try {
        const Product = getProduct();
        const product = await Product.findOneAndUpdate(
            { productId: req.params.id },
            { isActive: false },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete product',
            error: error.message,
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    getProductsByCategory,
    searchProducts,
    getSimilarProducts,
    getFeaturedProducts,
    getOfferProducts,
    createProduct,
    updateProduct,
    deleteProduct,
};
