/**
 * In-Memory Data Store
 * Provides a Mongoose-like API for when MongoDB is not available.
 * This allows the API to work immediately without any database setup.
 */

const { CATEGORIES_SEED, PRODUCTS_SEED, USERS_SEED, ORDERS_SEED } = require('../data/seedData');

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

// ============ Generic chainable query builder ============

function createChainableQuery(resultRef, sortRef) {
    let _sort = {};
    let _skip = 0;
    let _limit = 0;
    let _populateFields = [];

    const chain = {
        sort(s) { _sort = s; return chain; },
        skip(n) { _skip = n; return chain; },
        limit(n) { _limit = n; return chain; },
        lean() { return chain; },
        populate(field) { _populateFields.push(field); return chain; },
        then(resolve, reject) {
            try {
                let result = resultRef();
                if (Object.keys(_sort).length > 0) result = sortItems(result, _sort);
                if (_skip > 0) result = result.slice(_skip);
                if (_limit > 0) result = result.slice(0, _limit);
                resolve(result);
            } catch (e) { reject(e); }
        },
        [Symbol.toStringTag]: 'Promise',
    };
    chain.catch = (fn) => Promise.resolve(chain).catch(fn);
    return chain;
}

// ============ In-memory collections ============

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

let users = USERS_SEED.map((u, index) => ({
    _id: `mem_user_${index}`,
    ...u,
    isActive: true,
    rfmScores: { recency: null, frequency: null, monetary: null },
    segment: null,
    lastPurchaseDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
}));

// Map order userIndex → in-memory user _id, then compute RFM
let orders = ORDERS_SEED.map((o, index) => {
    const { userIndex, ...rest } = o;
    return {
        _id: `mem_order_${index}`,
        ...rest,
        user: `mem_user_${userIndex}`,
        orderDate: o.orderDate instanceof Date ? o.orderDate.toISOString() : o.orderDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
});

// Compute RFM scores for in-memory users
(function _computeInMemoryRFM() {
    const refDate = new Date('2026-04-17T00:00:00');
    for (const user of users) {
        const userOrders = orders
            .filter(o => o.user === user._id && o.status === 'Completed')
            .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

        if (userOrders.length > 0) {
            const lastDate = new Date(userOrders[0].orderDate);
            const recency = Math.floor((refDate - lastDate) / (1000 * 60 * 60 * 24));
            const frequency = userOrders.length;
            const monetary = +userOrders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2);

            user.rfmScores = { recency, frequency, monetary };
            user.lastPurchaseDate = lastDate.toISOString();
        }
    }
})();

// ============ Product Store ============

const ProductStore = {
    find(filter = {}) {
        return createChainableQuery(() => products.filter(p => matchesFilter(p, filter)));
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
        return createChainableQuery(() => categories.filter(c => matchesFilter(c, filter)));
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

// ============ User Store ============

const UserStore = {
    find(filter = {}) {
        return createChainableQuery(() => users.filter(u => matchesFilter(u, filter)));
    },

    async findOne(filter = {}) {
        return users.find(u => matchesFilter(u, filter)) || null;
    },

    async findById(id) {
        return users.find(u => u._id === id) || null;
    },

    async countDocuments(filter = {}) {
        return users.filter(u => matchesFilter(u, filter)).length;
    },

    async create(data) {
        const newUser = {
            _id: `mem_user_${Date.now()}`,
            ...data,
            isActive: true,
            rfmScores: data.rfmScores || { recency: null, frequency: null, monetary: null },
            segment: data.segment || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        users.push(newUser);
        return newUser;
    },

    async findByIdAndUpdate(id, update) {
        const index = users.findIndex(u => u._id === id);
        if (index === -1) return null;
        // Handle $set-like updates
        const flatUpdate = update.$set || update;
        users[index] = { ...users[index], ...flatUpdate, updatedAt: new Date().toISOString() };
        return users[index];
    },

    async findOneAndUpdate(filter, update, options = {}) {
        const index = users.findIndex(u => matchesFilter(u, filter));
        if (index === -1) return null;
        const flatUpdate = update.$set || update;
        users[index] = { ...users[index], ...flatUpdate, updatedAt: new Date().toISOString() };
        return users[index];
    },

    async insertMany(data) {
        const newUsers = data.map((d, i) => ({
            _id: `mem_user_${Date.now()}_${i}`,
            ...d,
            isActive: true,
            rfmScores: d.rfmScores || { recency: null, frequency: null, monetary: null },
            segment: d.segment || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }));
        users.push(...newUsers);
        return newUsers;
    },

    async deleteMany() {
        const count = users.length;
        users = [];
        return { deletedCount: count };
    },
};

// ============ Order Store ============

const OrderStore = {
    find(filter = {}) {
        return createChainableQuery(() => orders.filter(o => matchesFilter(o, filter)));
    },

    async findOne(filter = {}) {
        return orders.find(o => matchesFilter(o, filter)) || null;
    },

    async findById(id) {
        return orders.find(o => o._id === id) || null;
    },

    async countDocuments(filter = {}) {
        return orders.filter(o => matchesFilter(o, filter)).length;
    },

    async create(data) {
        const newOrder = {
            _id: `mem_order_${Date.now()}`,
            ...data,
            orderNumber: data.orderNumber || `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        orders.push(newOrder);
        return newOrder;
    },

    async findOneAndUpdate(filter, update, options = {}) {
        const index = orders.findIndex(o => matchesFilter(o, filter));
        if (index === -1) return null;
        const flatUpdate = update.$set || update;
        orders[index] = { ...orders[index], ...flatUpdate, updatedAt: new Date().toISOString() };
        return orders[index];
    },

    async insertMany(data) {
        const newOrders = data.map((d, i) => ({
            _id: `mem_order_${Date.now()}_${i}`,
            ...d,
            orderNumber: d.orderNumber || `ORD-${Date.now()}-${i}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }));
        orders.push(...newOrders);
        return newOrders;
    },

    async deleteMany() {
        const count = orders.length;
        orders = [];
        return { deletedCount: count };
    },

    // Aggregate-like helper for RFM computation
    async aggregate(pipeline) {
        // Simple aggregation support for RFM grouping
        // Supports: $match, $group, $sort stages
        let result = [...orders];

        for (const stage of pipeline) {
            if (stage.$match) {
                result = result.filter(o => matchesFilter(o, stage.$match));
            }
            if (stage.$group) {
                const groups = {};
                for (const item of result) {
                    const key = typeof stage.$group._id === 'string'
                        ? item[stage.$group._id.replace('$', '')]
                        : 'all';

                    if (!groups[key]) {
                        groups[key] = { _id: key };
                        // Initialize accumulators
                        for (const [field, op] of Object.entries(stage.$group)) {
                            if (field === '_id') continue;
                            if (op.$sum) groups[key][field] = 0;
                            if (op.$max) groups[key][field] = null;
                            if (op.$count) groups[key][field] = 0;
                        }
                    }

                    for (const [field, op] of Object.entries(stage.$group)) {
                        if (field === '_id') continue;
                        if (op.$sum) {
                            const val = typeof op.$sum === 'string'
                                ? item[op.$sum.replace('$', '')]
                                : op.$sum;
                            groups[key][field] += val;
                        }
                        if (op.$max) {
                            const val = item[op.$max.replace('$', '')];
                            if (groups[key][field] === null || val > groups[key][field]) {
                                groups[key][field] = val;
                            }
                        }
                        if (op.$count) {
                            groups[key][field]++;
                        }
                    }
                }
                result = Object.values(groups);
            }
            if (stage.$sort) {
                result = sortItems(result, stage.$sort);
            }
        }
        return result;
    },
};

module.exports = { ProductStore, CategoryStore, UserStore, OrderStore };
