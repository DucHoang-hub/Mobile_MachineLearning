require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('./config/database');
const Product = require('./models/Product');
const Category = require('./models/Category');
const User = require('./models/User');
const Order = require('./models/Order');
const { CATEGORIES_SEED, PRODUCTS_SEED, USERS_SEED, ORDERS_SEED } = require('./data/seedData');

const seedDatabase = async () => {
    try {
        const dbConnected = await connectDB();
        if (!dbConnected) {
            console.error('❌ Seeding requires MongoDB. Please set MONGODB_URI and ensure MongoDB is running.');
            process.exit(1);
        }

        console.log('🗑️  Clearing existing data...');
        await Order.deleteMany({});
        await User.deleteMany({});
        await Product.deleteMany({});
        await Category.deleteMany({});

        console.log('📦 Seeding categories...');
        const categories = await Promise.all(
            CATEGORIES_SEED.map(catData => Category.create(catData))
        );
        console.log(`   ✅ ${categories.length} categories created`);

        console.log('🛋️  Seeding products...');
        const products = await Product.insertMany(PRODUCTS_SEED);
        console.log(`   ✅ ${products.length} products created`);

        // Update product counts for each category
        console.log('🔄 Updating category product counts...');
        for (const cat of categories) {
            const count = await Product.countDocuments({ category: cat.name });
            await Category.findByIdAndUpdate(cat._id, { productCount: count });
        }

        // ============ NEW: Seed Users & Orders for RFM ============

        console.log('👥 Seeding users (hashing passwords)...');
        // Dùng User.create() thay vì insertMany() để pre-save hook hash password
        const users = await Promise.all(
            USERS_SEED.map(userData => User.create(userData))
        );
        console.log(`   ✅ ${users.length} users created (passwords hashed)`);

        console.log('🛒 Seeding orders...');
        // Map userIndex → actual MongoDB ObjectId
        const ordersWithRefs = ORDERS_SEED.map(order => {
            const { userIndex, ...rest } = order;
            return {
                ...rest,
                user: users[userIndex]._id,
            };
        });
        const orders = await Order.insertMany(ordersWithRefs);
        console.log(`   ✅ ${orders.length} orders created`);

        // ============ Update User RFM snapshot fields ============

        console.log('📊 Computing RFM snapshots for users...');
        const referenceDate = new Date('2026-04-17T00:00:00');

        for (const user of users) {
            const userOrders = await Order.find({
                user: user._id,
                status: 'Completed',
            }).sort({ orderDate: -1 });

            if (userOrders.length > 0) {
                const lastOrder = userOrders[0];
                const recency = Math.floor(
                    (referenceDate - new Date(lastOrder.orderDate)) / (1000 * 60 * 60 * 24)
                );
                const frequency = userOrders.length;
                const monetary = +userOrders
                    .reduce((sum, o) => sum + o.totalAmount, 0)
                    .toFixed(2);

                await User.findByIdAndUpdate(user._id, {
                    rfmScores: { recency, frequency, monetary },
                    lastPurchaseDate: lastOrder.orderDate,
                });
            }
        }
        console.log('   ✅ RFM scores computed');

        // ============ Summary ============

        console.log('\n🎉 Database seeded successfully!');
        console.log('─'.repeat(45));
        console.log(`   Categories: ${categories.length}`);
        console.log(`   Products:   ${products.length}`);
        console.log(`   Users:      ${users.length}`);
        console.log(`   Orders:     ${orders.length}`);
        console.log('─'.repeat(45));

        // Print RFM summary per group
        console.log('\n📊 RFM Distribution Preview:');
        const updatedUsers = await User.find({}).lean();
        const groups = {
            'VIP (0-4)': updatedUsers.slice(0, 5),
            'Dormant (5-11)': updatedUsers.slice(5, 12),
            'Casual (12-19)': updatedUsers.slice(12, 20),
        };
        for (const [label, group] of Object.entries(groups)) {
            const avgR = (group.reduce((s, u) => s + (u.rfmScores?.recency || 0), 0) / group.length).toFixed(1);
            const avgF = (group.reduce((s, u) => s + (u.rfmScores?.frequency || 0), 0) / group.length).toFixed(1);
            const avgM = (group.reduce((s, u) => s + (u.rfmScores?.monetary || 0), 0) / group.length).toFixed(0);
            console.log(`   ${label}: R=${avgR} days, F=${avgF} orders, M=$${avgM}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
};

seedDatabase();
