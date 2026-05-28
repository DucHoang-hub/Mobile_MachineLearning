require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { connectDB, getIsConnected } = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ============ MIDDLEWARE ============

// CORS - Allow mobile app to connect
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logger (dev mode)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Static files - serve product images
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// ============ ROUTES ============

// API root - documentation
app.get('/api', (req, res) => {
    res.status(200).json({
        success: true,
        message: '🚀 Fuzzy Furniture API is running!',
        version: '1.0.0',
        mode: getIsConnected() ? 'MongoDB' : 'In-Memory',
        endpoints: {
            auth: '/api/auth',
            products: '/api/products',
            categories: '/api/categories',
            health: '/api/health',
        },
        documentation: {
            getAllProducts: 'GET /api/products?page=1&limit=10&search=chair&category=Chairs&minPrice=50&maxPrice=200&minRating=4&sortBy=price&sortOrder=asc&discount=true',
            getProductById: 'GET /api/products/:productId',
            getProductsByCategory: 'GET /api/products/category/:categoryName',
            searchProducts: 'GET /api/products/search/:query',
            getSimilarProducts: 'GET /api/products/:productId/similar?limit=4',
            getFeaturedProducts: 'GET /api/products/featured/list?limit=8',
            getOfferProducts: 'GET /api/products/offers/list?limit=8',
            createProduct: 'POST /api/products',
            updateProduct: 'PUT /api/products/:productId',
            deleteProduct: 'DELETE /api/products/:productId',
            getAllCategories: 'GET /api/categories',
            getCategoryBySlug: 'GET /api/categories/:slug',
            createCategory: 'POST /api/categories',
            updateCategory: 'PUT /api/categories/:slug',
            deleteCategory: 'DELETE /api/categories/:slug',
        },
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'healthy',
        mode: getIsConnected() ? 'MongoDB' : 'In-Memory',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

// ============ ERROR HANDLING ============
app.use(notFound);
app.use(errorHandler);

// ============ TUNNEL URL (for Expo tunnel mode) ============
let tunnelUrl = null;

app.get('/api/tunnel-url', (req, res) => {
    res.json({
        success: true,
        tunnelUrl: tunnelUrl,
        localUrl: `http://localhost:${PORT}/api`,
    });
});

// ============ START SERVER ============
const startServer = async () => {
    // Try to connect to MongoDB (will fallback to in-memory if unavailable)
    const dbConnected = await connectDB();

    const server = app.listen(PORT, '0.0.0.0', async () => {
        // Get local network IPs
        const os = require('os');
        const interfaces = os.networkInterfaces();
        const lanIPs = [];
        for (const name of Object.keys(interfaces)) {
            for (const iface of interfaces[name]) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    lanIPs.push(iface.address);
                }
            }
        }

        console.log('');
        console.log('═'.repeat(50));
        console.log('  🚀 FUZZY FURNITURE API SERVER');
        console.log('═'.repeat(50));
        console.log(`  🌐 Server:     http://localhost:${PORT}`);
        if (lanIPs.length > 0) {
            lanIPs.forEach(ip => {
                console.log(`  🌐 LAN:        http://${ip}:${PORT}`);
            });
        }
        console.log(`  📡 API Base:   http://localhost:${PORT}/api`);
        console.log(`  🏗️  Mode:       ${process.env.NODE_ENV || 'development'}`);
        console.log(`  💾 Database:   ${dbConnected ? 'MongoDB' : '⚡ In-Memory (28 products loaded)'}`);
        console.log('═'.repeat(50));
        console.log('');
        console.log('  Available Endpoints:');
        console.log('  ───────────────────────────────────────');
        console.log('  POST   /api/auth/register');
        console.log('  POST   /api/auth/login');
        console.log('  GET    /api/auth/me');
        console.log('  GET    /api/products');
        console.log('  GET    /api/products/:id');
        console.log('  GET    /api/products/category/:name');
        console.log('  GET    /api/products/search/:query');
        console.log('  GET    /api/products/:id/similar');
        console.log('  GET    /api/products/featured/list');
        console.log('  GET    /api/products/offers/list');
        console.log('  POST   /api/products');
        console.log('  PUT    /api/products/:id');
        console.log('  DELETE /api/products/:id');
        console.log('  GET    /api/categories');
        console.log('  GET    /api/categories/:slug');
        console.log('  POST   /api/categories');
        console.log('  PUT    /api/categories/:slug');
        console.log('  DELETE /api/categories/:slug');
        console.log('  GET    /api/users');
        console.log('  GET    /api/users/:id');
        console.log('  POST   /api/users');
        console.log('  PUT    /api/users/:id');
        console.log('  DELETE /api/users/:id');
        console.log('');

        // If EXPO_PUBLIC_DEVICE_IP or LAN IPs found, show instructions
        if (lanIPs.length > 0) {
            console.log('  📱 For mobile device, update .env:');
            console.log(`     EXPO_PUBLIC_API_BASE_URL=http://${lanIPs[0]}:${PORT}/api`);
            console.log('');
        }
    });

    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.error(`❌ Port ${PORT} is already in use.`);
            console.error('   Another backend instance may already be running.');
            console.error(`   Stop the existing process or start this server with a different PORT (e.g. PORT=${Number(PORT) + 1}).`);
            process.exit(1);
        }

        console.error('❌ Failed to start server:', error);
        process.exit(1);
    });
};

startServer();
