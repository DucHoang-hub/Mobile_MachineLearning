const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/productController');

// Special routes (must be before /:id)
router.get('/featured/list', getFeaturedProducts);
router.get('/offers/list', getOfferProducts);
router.get('/search/:query', searchProducts);
router.get('/category/:categoryName', getProductsByCategory);

// CRUD routes
router.route('/')
    .get(getProducts)
    .post(createProduct);

router.route('/:id')
    .get(getProductById)
    .put(updateProduct)
    .delete(deleteProduct);

// Similar products for a specific product
router.get('/:id/similar', getSimilarProducts);

module.exports = router;
