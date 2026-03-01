/**
 * In-Memory Data Store
 * Provides a Mongoose-like API for when MongoDB is not available.
 * This allows the API to work immediately without any database setup.
 */

const { CATEGORIES_SEED, PRODUCTS_SEED } = require('../data/seedData');

// In-memory collections
let products = PRODUCTS_SEED.map((p, index) => ({
    _id: `mem_product_${index}`,
    ...p,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
}));

let categories = CATEGORIES_SEED.map((c, index) => ({
    _id: `mem_category_${index}`,
    ...c,
    slug: c.name.toLowerCase().replace(/\s+/g, '-'),
    isActive: true,
    productCount: products.filter(p => p.category === c.name).length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
}));

// ============ Helper Functions ============

function matchesFilter(item, filter) {
    for (const [key, value] of Object.entries(filter)) {
        if (key === '$or') {
            const orMatch = value.some(condition => matchesFilter(item, condition));
            if (!orMatch) return false;
            continue;
        }

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            // Handle Mongo-like operators
            if (value.$regex) {
                const regex = new RegExp(value.$regex, value.$options || '');
                if (!regex.test(item[key])) return false;
            }
            if (value.$gte !== undefined && item[key] < value.$gte) return false;
            if (value.$lte !== undefined && item[key] > value.$lte) return false;
            if (value.$gt !== undefined && item[key] <= value.$gt) return false;
            if (value.$lt !== undefined && item[key] >= value.$lt) return false;
            if (value.$ne !== undefined && item[key] === value.$ne) return false;
        } else {
            if (item[key] !== value) return false;
        }
    }
    return true;
}

function sortItems(items, sortObj) {
    const [field, order] = Object.entries(sortObj)[0] || ['createdAt', -1];
    return [...items].sort((a, b) => {
        if (a[field] < b[field]) return -1 * order;
        if (a[field] > b[field]) return 1 * order;
        return 0;
    });
}

// ============ Product Store ============

const ProductStore = {
    find(filter = {}) {
        let result = products.filter(p => matchesFilter(p, filter));
        let _sort = {};
        let _skip = 0;
        let _limit = 0;

        const chain = {
            sort(s) { _sort = s; return chain; },
            skip(n) { _skip = n; return chain; },
            limit(n) { _limit = n; return chain; },
            lean() { return chain; },
            then(resolve, reject) {
                try {
                    if (Object.keys(_sort).length > 0) result = sortItems(result, _sort);
                    if (_skip > 0) result = result.slice(_skip);
                    if (_limit > 0) result = result.slice(0, _limit);
                    resolve(result);
                } catch (e) { reject(e); }
            },
            [Symbol.toStringTag]: 'Promise', // Make it thenable
        };
        // Make chain awaitable
        chain.catch = (fn) => Promise.resolve(chain).catch(fn);
        return chain;
    },

    async findOne(filter = {}) {
        return products.find(p => matchesFilter(p, filter)) || null;
    },

    async countDocuments(filter = {}) {
        return products.filter(p => matchesFilter(p, filter)).length;
    },

    async create(data) {
        const newProduct = {
            _id: `mem_product_${Date.now()}`,
            ...data,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        products.push(newProduct);
        return newProduct;
    },

    async findOneAndUpdate(filter, update, options = {}) {
        const index = products.findIndex(p => matchesFilter(p, filter));
        if (index === -1) return null;
        products[index] = { ...products[index], ...update, updatedAt: new Date().toISOString() };
        return products[index];
    },

    async insertMany(data) {
        const newProducts = data.map((d, i) => ({
            _id: `mem_product_${Date.now()}_${i}`,
            ...d,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }));
        products.push(...newProducts);
        return newProducts;
    },

    async deleteMany() {
        const count = products.length;
        products = [];
        return { deletedCount: count };
    },
};

// ============ Category Store ============

const CategoryStore = {
    find(filter = {}) {
        let result = categories.filter(c => matchesFilter(c, filter));
        let _sort = {};

        const chain = {
            sort(s) { _sort = s; return chain; },
            lean() { return chain; },
            then(resolve, reject) {
                try {
                    if (Object.keys(_sort).length > 0) result = sortItems(result, _sort);
                    resolve(result);
                } catch (e) { reject(e); }
            },
            [Symbol.toStringTag]: 'Promise',
        };
        chain.catch = (fn) => Promise.resolve(chain).catch(fn);
        return chain;
    },

    async findOne(filter = {}) {
        return categories.find(c => matchesFilter(c, filter)) || null;
    },

    async countDocuments(filter = {}) {
        return categories.filter(c => matchesFilter(c, filter)).length;
    },

    async create(data) {
        const newCategory = {
            _id: `mem_category_${Date.now()}`,
            ...data,
            slug: data.name.toLowerCase().replace(/\s+/g, '-'),
            isActive: true,
            productCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        categories.push(newCategory);
        return newCategory;
    },

    async findOneAndUpdate(filter, update, options = {}) {
        const index = categories.findIndex(c => matchesFilter(c, filter));
        if (index === -1) return null;
        categories[index] = { ...categories[index], ...update, updatedAt: new Date().toISOString() };
        return categories[index];
    },

    async findByIdAndUpdate(id, update) {
        const index = categories.findIndex(c => c._id === id);
        if (index === -1) return null;
        categories[index] = { ...categories[index], ...update };
        return categories[index];
    },

    async insertMany(data) {
        const newCategories = data.map((d, i) => ({
            _id: `mem_category_${Date.now()}_${i}`,
            ...d,
            slug: d.name.toLowerCase().replace(/\s+/g, '-'),
            isActive: true,
            productCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }));
        categories.push(...newCategories);
        return newCategories;
    },

    async deleteMany() {
        const count = categories.length;
        categories = [];
        return { deletedCount: count };
    },
};

module.exports = { ProductStore, CategoryStore };
