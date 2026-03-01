require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const Product = require('./models/Product');
const Category = require('./models/Category');
const { CATEGORIES_SEED, PRODUCTS_SEED } = require('./data/seedData');

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log('🗑️  Clearing existing data...');
        await Product.deleteMany({});
        await Category.deleteMany({});

        console.log('📦 Seeding categories...');
        const categories = await Category.insertMany(CATEGORIES_SEED);
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

        console.log('\n🎉 Database seeded successfully!');
        console.log('─'.repeat(40));
        console.log(`   Categories: ${categories.length}`);
        console.log(`   Products:   ${products.length}`);
        console.log('─'.repeat(40));

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
};

seedDatabase();
