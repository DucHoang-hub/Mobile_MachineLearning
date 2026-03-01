import { Platform } from 'react-native';

/**
 * API Configuration
 * 
 * - Android Emulator: uses 10.0.2.2 (maps to host machine's localhost)
 * - iOS Simulator: uses localhost
 * - Physical device: uses your computer's local IP address
 * 
 * ⚠️ Nếu chạy trên thiết bị thật, hãy đổi DEVICE_IP thành IP máy tính của bạn
 *    Tìm IP bằng lệnh: ipconfig (Windows) hoặc ifconfig (Mac/Linux)
 */
const DEVICE_IP = '192.168.1.100'; // 👈 Đổi thành IP máy tính của bạn nếu dùng thiết bị thật

const getBaseUrl = (): string => {
    if (__DEV__) {
        if (Platform.OS === 'android') {
            // Android emulator uses 10.0.2.2 to access host machine
            return 'http://10.0.2.2:5000/api';
        } else if (Platform.OS === 'ios') {
            return 'http://localhost:5000/api';
        }
        // Physical device or web
        return `http://${DEVICE_IP}:5000/api`;
    }
    // Production URL (thay đổi khi deploy)
    return 'https://your-production-api.com/api';
};

export const API_BASE_URL = getBaseUrl();

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `API Error: ${response.status}`);
        }

        return data;
    } catch (error: any) {
        if (error.message === 'Network request failed') {
            throw new Error('Không thể kết nối đến server. Hãy kiểm tra backend đang chạy.');
        }
        throw error;
    }
}

// ============ Types ============

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface ProductApi {
    _id: string;
    productId: string;
    name: string;
    description: string;
    category: string;
    price: number;
    oldPrice: number;
    discount: number;
    rating: number;
    totalRatings: number;
    reviews: number;
    dimensions: {
        height: string;
        width: string;
        depth: string;
        weight: string;
    };
    colors: string[];
    image: string;
    productViews: { label: string; image: string }[];
    ratingBreakdown: { [key: number]: number };
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryApi {
    _id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    productCount: number;
    isActive: boolean;
}

// ============ Product API ============

export const ProductService = {
    /**
     * Lấy tất cả sản phẩm (có phân trang, filter, sort)
     */
    getAll: (params?: {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        minRating?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        discount?: boolean;
    }) => {
        const query = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    query.append(key, String(value));
                }
            });
        }
        const queryStr = query.toString();
        return apiFetch<PaginatedResponse<ProductApi>>(`/products${queryStr ? `?${queryStr}` : ''}`);
    },

    /**
     * Lấy chi tiết sản phẩm
     */
    getById: (productId: string) => {
        return apiFetch<ApiResponse<ProductApi>>(`/products/${productId}`);
    },

    /**
     * Lấy sản phẩm theo danh mục
     */
    getByCategory: (categoryName: string, params?: { page?: number; limit?: number; sortBy?: string; sortOrder?: string }) => {
        const query = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) query.append(key, String(value));
            });
        }
        const queryStr = query.toString();
        return apiFetch<PaginatedResponse<ProductApi>>(`/products/category/${encodeURIComponent(categoryName)}${queryStr ? `?${queryStr}` : ''}`);
    },

    /**
     * Tìm kiếm sản phẩm
     */
    search: (query: string, params?: { page?: number; limit?: number }) => {
        const searchParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) searchParams.append(key, String(value));
            });
        }
        const queryStr = searchParams.toString();
        return apiFetch<PaginatedResponse<ProductApi>>(`/products/search/${encodeURIComponent(query)}${queryStr ? `?${queryStr}` : ''}`);
    },

    /**
     * Lấy sản phẩm tương tự
     */
    getSimilar: (productId: string, limit: number = 4) => {
        return apiFetch<ApiResponse<ProductApi[]>>(`/products/${productId}/similar?limit=${limit}`);
    },

    /**
     * Lấy sản phẩm nổi bật (rating cao nhất)
     */
    getFeatured: (limit: number = 8) => {
        return apiFetch<ApiResponse<ProductApi[]>>(`/products/featured/list?limit=${limit}`);
    },

    /**
     * Lấy sản phẩm đang giảm giá
     */
    getOffers: (limit: number = 8) => {
        return apiFetch<ApiResponse<ProductApi[]>>(`/products/offers/list?limit=${limit}`);
    },
};

// ============ Category API ============

export const CategoryService = {
    /**
     * Lấy tất cả danh mục
     */
    getAll: () => {
        return apiFetch<{ success: boolean; data: CategoryApi[]; total: number }>('/categories');
    },

    /**
     * Lấy danh mục theo slug (kèm sản phẩm)
     */
    getBySlug: (slug: string) => {
        return apiFetch<ApiResponse<CategoryApi & { products: ProductApi[] }>>(`/categories/${slug}`);
    },
};
