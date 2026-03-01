const CategoryModel = require('../models/Category');
const ProductModel = require('../models/Product');
const { CategoryStore, ProductStore } = require('../data/memoryStore');
const { getIsConnected } = require('../config/database');

// Dynamic model selector
const getCategory = () => getIsConnected() ? CategoryModel : CategoryStore;
const getProduct = () => getIsConnected() ? ProductModel : ProductStore;

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        const Category = getCategory();
        const Product = getProduct();

        const categories = await Category.find({ isActive: true }).sort({ name: 1 }).lean();

        const categoriesWithCount = await Promise.all(
            categories.map(async (cat) => {
                const count = await Product.countDocuments({
                    category: cat.name,
                    isActive: true,
                });
                return { ...cat, productCount: count };
            })
        );

        res.status(200).json({
            success: true,
            data: categoriesWithCount,
            total: categoriesWithCount.length,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
            error: error.message,
        });
    }
};

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
// @access  Public
const getCategoryBySlug = async (req, res) => {
    try {
        const Category = getCategory();
        const Product = getProduct();

        const category = await Category.findOne({
            slug: req.params.slug,
            isActive: true,
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        const products = await Product.find({
            category: category.name,
            isActive: true,
        }).lean();

        res.status(200).json({
            success: true,
            data: {
                ...category,
                productCount: products.length,
                products,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch category',
            error: error.message,
        });
    }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Public
const createCategory = async (req, res) => {
    try {
        const Category = getCategory();
        const category = await Category.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Category already exists',
            });
        }
        res.status(400).json({
            success: false,
            message: 'Failed to create category',
            error: error.message,
        });
    }
};

// @desc    Update a category
// @route   PUT /api/categories/:slug
// @access  Public
const updateCategory = async (req, res) => {
    try {
        const Category = getCategory();
        const category = await Category.findOneAndUpdate(
            { slug: req.params.slug },
            req.body,
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: category,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to update category',
            error: error.message,
        });
    }
};

// @desc    Delete a category (soft delete)
// @route   DELETE /api/categories/:slug
// @access  Public
const deleteCategory = async (req, res) => {
    try {
        const Category = getCategory();
        const category = await Category.findOneAndUpdate(
            { slug: req.params.slug },
            { isActive: false },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete category',
            error: error.message,
        });
    }
};

module.exports = {
    getCategories,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory,
};
