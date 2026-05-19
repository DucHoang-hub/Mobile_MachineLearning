/**
 * Image Mapping Utility
 * 
 * Maps API image paths (e.g., '/images/products/screen3_img1.png')
 * to local require() assets for offline-compatible display.
 * 
 * Khi deploy production với CDN, có thể thay bằng URL trực tiếp.
 */

// ── Product Images ──
const PRODUCT_IMAGE_MAP: { [key: string]: any } = {
    '/images/products/screen3_img1.png': require('../assets/images/screen3_img1.png'),
    '/images/products/screen3_img2.png': require('../assets/images/screen3_img2.png'),
    '/images/products/screen3_img3.png': require('../assets/images/screen3_img3.png'),
    '/images/products/screen3_img4.png': require('../assets/images/screen3_img4.png'),
    '/images/products/screen3_img5.png': require('../assets/images/screen3_img5.png'),
    '/images/products/screen3_img6.png': require('../assets/images/screen3_img6.png'),
    '/images/products/screen3_img7.png': require('../assets/images/screen3_img7.png'),
    '/images/products/screen3_img8.png': require('../assets/images/screen3_img8.png'),
    '/images/products/screen3_img9.png': require('../assets/images/screen3_img9.png'),
    '/images/products/screen3_img10.png': require('../assets/images/screen3_img10.png'),
    '/images/products/screen3_img11.png': require('../assets/images/screen3_img11.png'),
    '/images/products/screen3_img12.png': require('../assets/images/screen3_img12.png'),
    '/images/products/screen3_img13.png': require('../assets/images/screen3_img13.png'),
    '/images/products/screen3_img14.png': require('../assets/images/screen3_img14.png'),
    '/images/products/screen3_img15.png': require('../assets/images/screen3_img15.png'),
    '/images/products/screen3_img16.png': require('../assets/images/screen3_img16.png'),
    '/images/products/screen3_img17.png': require('../assets/images/screen3_img17.png'),
};

// ── Category Images ──
const CATEGORY_IMAGE_MAP: { [key: string]: any } = {
    '/images/categories/chairs.png': require('../assets/images/screen4_img1.png'),
    '/images/categories/tables.png': require('../assets/images/screen4_img2.png'),
    '/images/categories/sofas.png': require('../assets/images/screen4_img3.png'),
    '/images/categories/hanging-chairs.png': require('../assets/images/screen4_img7.png'),
    '/images/categories/cabinets.png': require('../assets/images/screen4_img4.png'),
    '/images/categories/lamps.png': require('../assets/images/screen4_img5.png'),
    '/images/categories/cupboards.png': require('../assets/images/screen4_img6.png'),
};

// Fallback image
const FALLBACK_IMAGE = require('../assets/images/screen3_img1.png');

/**
 * Resolve an API image path to a local require() source.
 * Falls back to a default image if path is not found.
 */
export function resolveProductImage(apiPath: string | undefined | null): any {
    if (!apiPath) return FALLBACK_IMAGE;
    return PRODUCT_IMAGE_MAP[apiPath] || FALLBACK_IMAGE;
}

/**
 * Resolve a category image path to a local require() source.
 */
export function resolveCategoryImage(apiPath: string | undefined | null): any {
    if (!apiPath) return FALLBACK_IMAGE;
    return CATEGORY_IMAGE_MAP[apiPath] || FALLBACK_IMAGE;
}

/**
 * Resolve product views from API format to local image sources.
 * API format: [{ label: 'Front', image: '/images/products/screen3_img1.png' }]
 * Returns:    [{ label: 'Front', image: require(...) }]
 */
export function resolveProductViews(
    views: { label: string; image: string }[] | undefined | null
): { label: string; image: any }[] {
    if (!views || views.length === 0) return [];
    return views.map((view) => ({
        label: view.label,
        image: resolveProductImage(view.image),
    }));
}
