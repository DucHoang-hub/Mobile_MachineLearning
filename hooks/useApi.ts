import { PRODUCTS_DATA, SIMILAR_PRODUCTS } from '@/constants/data';
import { CategoryService, ProductApi, ProductService, getActiveApiBaseUrl } from '@/services/api';
import { useCallback, useEffect, useState } from 'react';

/**
 * Custom hook: Lấy sản phẩm theo danh mục
 * Tự động fallback sang mock data nếu API không khả dụng
 */
export function useProductsByCategory(categoryName: string) {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFromApi, setIsFromApi] = useState(false);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await ProductService.getByCategory(categoryName, { limit: 50 });
            if (response.success && response.data.length > 0) {
                // Convert API images to require() format is not possible at runtime,
                // so we keep image as string URL from API
                setProducts(response.data.map(mapApiProductToLocal));
                setIsFromApi(true);
            } else {
                throw new Error('No data from API');
            }
        } catch (err) {
            // Fallback to local mock data
            console.log(`⚡ Using local data for category: ${categoryName}`);
            const localProducts = PRODUCTS_DATA[categoryName] || PRODUCTS_DATA['Chairs'] || [];
            setProducts(localProducts);
            setIsFromApi(false);
        } finally {
            setLoading(false);
        }
    }, [categoryName]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, loading, error, isFromApi, refetch: fetchProducts };
}

/**
 * Custom hook: Lấy chi tiết sản phẩm
 */
export function useProductDetail(productId: string, category: string) {
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isFromApi, setIsFromApi] = useState(false);

    const fetchProduct = useCallback(async () => {
        setLoading(true);
        try {
            const response = await ProductService.getById(productId);
            if (response.success && response.data) {
                setProduct(mapApiProductToLocal(response.data));
                setIsFromApi(true);
            } else {
                throw new Error('Product not found from API');
            }
        } catch (err) {
            // Fallback to local data
            console.log(`⚡ Using local data for product: ${productId}`);
            const categoryProducts = PRODUCTS_DATA[category] || PRODUCTS_DATA['Chairs'] || [];
            const localProduct = categoryProducts.find((p: any) => p.id === productId) || categoryProducts[0];
            setProduct(localProduct);
            setIsFromApi(false);
        } finally {
            setLoading(false);
        }
    }, [productId, category]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    return { product, loading, isFromApi, refetch: fetchProduct };
}

/**
 * Custom hook: Lấy sản phẩm tương tự
 */
export function useSimilarProducts(productId: string) {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSimilar = async () => {
            setLoading(true);
            try {
                const response = await ProductService.getSimilar(productId, 4);
                if (response.success && response.data.length > 0) {
                    setProducts(response.data.map(mapApiProductToLocal));
                } else {
                    throw new Error('No similar products');
                }
            } catch {
                setProducts(SIMILAR_PRODUCTS);
            } finally {
                setLoading(false);
            }
        };
        fetchSimilar();
    }, [productId]);

    return { products, loading };
}

/**
 * Custom hook: Lấy sản phẩm featured
 */
export function useFeaturedProducts(limit: number = 8) {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            setLoading(true);
            try {
                const response = await ProductService.getFeatured(limit);
                if (response.success && response.data.length > 0) {
                    setProducts(response.data.map(mapApiProductToLocal));
                } else {
                    throw new Error('No featured products');
                }
            } catch {
                // Fallback: use first few products from local data
                const fallback = [
                    ...(PRODUCTS_DATA['Chairs'] || []).slice(0, 2),
                    ...(PRODUCTS_DATA['Sofas'] || []).slice(0, 2),
                ];
                setProducts(fallback.slice(0, limit));
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, [limit]);

    return { products, loading };
}

/**
 * Custom hook: Lấy sản phẩm deals/offers
 */
export function useOfferProducts(limit: number = 8) {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffers = async () => {
            setLoading(true);
            try {
                const response = await ProductService.getOffers(limit);
                if (response.success && response.data.length > 0) {
                    setProducts(response.data.map(mapApiProductToLocal));
                } else {
                    throw new Error('No offer products');
                }
            } catch {
                const fallback = [
                    ...(PRODUCTS_DATA['Lamps'] || []).slice(0, 2),
                    ...(PRODUCTS_DATA['Chairs'] || []).slice(2, 4),
                ];
                setProducts(fallback.slice(0, limit));
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, [limit]);

    return { products, loading };
}

/**
 * Custom hook: Lấy tất cả danh mục
 */
export function useCategories() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const response = await CategoryService.getAll();
                if (response.success) {
                    setCategories(response.data);
                } else {
                    throw new Error('Failed to fetch categories');
                }
            } catch {
                // Fallback categories (hardcoded like current app)
                setCategories([
                    { name: 'Chairs', slug: 'chairs', productCount: 4 },
                    { name: 'Tables', slug: 'tables', productCount: 4 },
                    { name: 'Sofas', slug: 'sofas', productCount: 4 },
                    { name: 'Hanging chairs', slug: 'hanging-chairs', productCount: 4 },
                    { name: 'Cabinets', slug: 'cabinets', productCount: 4 },
                    { name: 'Lamps', slug: 'lamps', productCount: 4 },
                    { name: 'Cupboards', slug: 'cupboards', productCount: 4 },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return { categories, loading };
}

/**
 * Custom hook: Tìm kiếm sản phẩm
 */
export function useSearchProducts(query: string) {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query || query.trim().length < 2) {
            setProducts([]);
            return;
        }

        const searchTimeout = setTimeout(async () => {
            setLoading(true);
            try {
                const response = await ProductService.search(query);
                if (response.success) {
                    setProducts(response.data.map(mapApiProductToLocal));
                } else {
                    throw new Error('Search failed');
                }
            } catch {
                // Fallback: search in local data
                const allProducts: any[] = [];
                Object.values(PRODUCTS_DATA).forEach(categoryProducts => {
                    allProducts.push(...categoryProducts);
                });
                const filtered = allProducts.filter(p =>
                    p.name.toLowerCase().includes(query.toLowerCase()) ||
                    p.description.toLowerCase().includes(query.toLowerCase())
                );
                setProducts(filtered);
            } finally {
                setLoading(false);
            }
        }, 300); // Debounce 300ms

        return () => clearTimeout(searchTimeout);
    }, [query]);

    return { products, loading };
}

// ============ Helpers ============

/**
 * Map API product (image as URL string) to local format
 * Note: When API is used, images will be URLs instead of require() objects.
 * The Image component in React Native can handle both { uri: string } and require().
 */
function mapApiProductToLocal(apiProduct: ProductApi): any {
    return {
        ...apiProduct,
        id: apiProduct.productId,
        // Convert string image paths to { uri } format for React Native Image
        image: { uri: `${getImageBaseUrl()}${apiProduct.image}` },
        productViews: apiProduct.productViews?.map(view => ({
            ...view,
            image: { uri: `${getImageBaseUrl()}${view.image}` },
        })),
    };
}

function getImageBaseUrl(): string {
    const activeApiBaseUrl = getActiveApiBaseUrl().replace(/\/+$/, '');
    return activeApiBaseUrl.endsWith('/api')
        ? activeApiBaseUrl.slice(0, -4)
        : activeApiBaseUrl;
}
