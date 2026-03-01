const express = require('express');
const router = express.Router();
const {
    getCategories,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryController');

router.route('/')
    .get(getCategories)
    .post(createCategory);

router.route('/:slug')
    .get(getCategoryBySlug)
    .put(updateCategory)
    .delete(deleteCategory);

module.exports = router;
