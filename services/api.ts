import Constants from 'expo-constants';
import { NativeModules, Platform } from 'react-native';

/**
 * API Configuration
 * 
 * - Android Emulator: uses 10.0.2.2 (maps to host machine's localhost)
 * - iOS Simulator: uses localhost
 * - Physical device: uses EXPO_PUBLIC_DEVICE_IP (optional)
 * 
 * ⚠️ Nếu chạy LAN trên thiết bị thật, set EXPO_PUBLIC_DEVICE_IP trong .env/.env.local
 *    Ví dụ: EXPO_PUBLIC_DEVICE_IP=192.168.1.10
 */
const EXPO_PUBLIC_API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
const EXPO_PUBLIC_DEVICE_IP = process.env.EXPO_PUBLIC_DEVICE_IP?.trim();

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, '');

const isPrivateIPv4 = (host: string): boolean => {
    if (/^10\./.test(host)) return true;
    if (/^192\.168\./.test(host)) return true;

    const match = host.match(/^172\.(\d{1,3})\./);
    if (match) {
        const secondOctet = Number(match[1]);
        return secondOctet >= 16 && secondOctet <= 31;
    }

    return false;
};

const extractHost = (value?: string | null): string | null => {
    if (!value) return null;

    const trimmed = value.trim();
    if (!trimmed) return null;

    const candidate = trimmed.includes('://') ? trimmed : `http://${trimmed}`;
    try {
        return new URL(candidate).hostname || null;
    } catch {
        return trimmed.split(':')[0] || null;
    }
};

const getDevServerHost = (): string | null => {
    const hostFromExpoConfig = extractHost((Constants as any)?.expoConfig?.hostUri);
    if (hostFromExpoConfig) return hostFromExpoConfig;

    const hostFromExpoGoConfig = extractHost((Constants as any)?.expoGoConfig?.debuggerHost);
    if (hostFromExpoGoConfig) return hostFromExpoGoConfig;

    const hostFromManifest = extractHost((Constants as any)?.manifest?.debuggerHost);
    if (hostFromManifest) return hostFromManifest;

    const sourceCodeUrl = (NativeModules as any)?.SourceCode?.scriptURL;
    return extractHost(sourceCodeUrl);
};

const getDevHostBaseUrl = (): string | null => {
    const host = getDevServerHost();
    if (!host || host === 'localhost' || host === '127.0.0.1') {
        return null;
    }
    // Chỉ sử dụng host nếu là private IP (LAN).
    // Khi dùng Expo tunnel, host sẽ là domain (*.exp.direct) — KHÔNG thể
    // gắn :5000 vào domain này để truy cập backend local.
    if (!isPrivateIPv4(host)) {
        return null;
    }
    return `http://${host}:5000/api`;
};

const getDefaultDevBaseUrl = (): string => {
    const hostBaseUrl = getDevHostBaseUrl();
    if (hostBaseUrl) return hostBaseUrl;

    if (Platform.OS === 'android') {
        // Android emulator uses 10.0.2.2 to access host machine
        return 'http://10.0.2.2:5000/api';
    }

    if (Platform.OS === 'ios') {
        return 'http://localhost:5000/api';
    }

    // Physical device fallback via optional env var
    if (EXPO_PUBLIC_DEVICE_IP) {
        return `http://${EXPO_PUBLIC_DEVICE_IP}:5000/api`;
    }

    // Web fallback
    return 'http://localhost:5000/api';
};

const getBaseUrl = (): string => {
    // Ưu tiên cấu hình từ Expo env để hỗ trợ thiết bị thật + tunnel
    if (EXPO_PUBLIC_API_BASE_URL) {
        const configuredBaseUrl = normalizeBaseUrl(EXPO_PUBLIC_API_BASE_URL);

        // Dev mode: nếu env đang trỏ tới private IP cũ, tự ưu tiên IP host hiện tại của Expo
        // để tránh timeout trên thiết bị thật khi đổi Wi-Fi.
        if (__DEV__) {
            const configuredHost = extractHost(configuredBaseUrl);
            const devHostBaseUrl = getDevHostBaseUrl();
            const devHost = extractHost(devHostBaseUrl);

            if (
                configuredHost &&
                devHost &&
                configuredHost !== devHost &&
                isPrivateIPv4(configuredHost) &&
                isPrivateIPv4(devHost)
            ) {
                return `http://${devHost}:5000/api`;
            }
        }

        return configuredBaseUrl;
    }

    if (__DEV__) {
        return getDefaultDevBaseUrl();
    }

    // Production URL (thay đổi khi deploy)
    return 'https://your-production-api.com/api';
};

export const API_BASE_URL = getBaseUrl();
let activeApiBaseUrl = API_BASE_URL;

export const getActiveApiBaseUrl = (): string => activeApiBaseUrl;

const getDevFallbackBaseUrls = (primaryBaseUrl: string): string[] => {
    const candidates = new Set<string>();

    if (EXPO_PUBLIC_API_BASE_URL) {
        candidates.add(normalizeBaseUrl(EXPO_PUBLIC_API_BASE_URL));
    }

    const hostBaseUrl = getDevHostBaseUrl();
    if (hostBaseUrl) {
        candidates.add(hostBaseUrl);
    }

    if (Platform.OS === 'android') {
        candidates.add('http://10.0.2.2:5000/api');
    }
    if (Platform.OS === 'ios' || Platform.OS === 'web') {
        candidates.add('http://localhost:5000/api');
    }

    if (EXPO_PUBLIC_DEVICE_IP) {
        candidates.add(`http://${EXPO_PUBLIC_DEVICE_IP}:5000/api`);
    }
    candidates.delete(primaryBaseUrl);

    return Array.from(candidates);
};

const isNetworkError = (error: unknown): boolean => {
    if (error instanceof Error && error.name === 'AbortError') return true;
    const message = error instanceof Error ? error.message : String(error || '');
    return message === 'Network request failed' || /timed out/i.test(message);
};

const isRecoverableDevHttpError = (status?: number): boolean => {
    if (!__DEV__ || typeof status !== 'number') return false;
    return status === 404 || status >= 500;
};

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const candidateBaseUrls = [
        activeApiBaseUrl,
        ...(__DEV__ ? getDevFallbackBaseUrls(activeApiBaseUrl) : []),
    ];

    let lastError: unknown = null;

    for (const baseUrl of candidateBaseUrls) {
        const url = `${baseUrl}${endpoint}`;

        try {
            // Timeout sau 8 giây để không chờ quá lâu khi IP không khả dụng
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'bypass-tunnel-reminder': 'true',
                    ...options?.headers,
                },
                ...options,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const responseText = await response.text();
            let data: any = {};

            if (responseText) {
                try {
                    data = JSON.parse(responseText);
                } catch {
                    data = {};
                }
            }

            if (!response.ok) {
                const httpError = new Error(
                    data.message || `API Error: ${response.status}`,
                ) as Error & { status?: number };
                httpError.status = response.status;
                throw httpError;
            }

            activeApiBaseUrl = baseUrl;
            return data;
        } catch (error) {
            const status = (error as Error & { status?: number })?.status;
            const shouldTryNext = isNetworkError(error) || isRecoverableDevHttpError(status);

            if (!shouldTryNext) {
                throw error;
            }

            lastError = error;
        }
    }

    if (isNetworkError(lastError)) {
        throw new Error(
            `Không thể kết nối đến server. Các địa chỉ đã thử: ${candidateBaseUrls.join(', ')}. ` +
            `Hãy kiểm tra: (1) Backend đang chạy? (2) IP trong .env đúng chưa? (3) Nếu dùng Expo tunnel, chuyển sang LAN mode (npx expo start).`,
        );
    }

    const lastErrorStatus = (lastError as Error & { status?: number })?.status;
    if (isRecoverableDevHttpError(lastErrorStatus)) {
        throw new Error(
            `Không thể truy cập API. Các địa chỉ đã thử: ${candidateBaseUrls.join(', ')}. Lỗi cuối: HTTP ${lastErrorStatus}.`,
        );
    }

    throw lastError instanceof Error ? lastError : new Error('Đã xảy ra lỗi không xác định.');
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

// ============ Auth API ============

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
            avatar: string | null;
            segment: 'VIP' | 'Dormant' | 'Casual' | null;
            rfmScores: {
                recency: number | null;
                frequency: number | null;
                monetary: number | null;
            } | null;
        };
    };
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    phone?: string;
}

export const AuthService = {
    /**
     * Đăng nhập bằng email + password
     * Trả về user profile kèm segment từ K-Means AI
     */
    login: (email: string, password: string) => {
        return apiFetch<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },

    /**
     * Đăng ký tài khoản mới
     */
    register: (payload: RegisterRequest) => {
        return apiFetch<LoginResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    /**
     * Lấy thông tin user hiện tại
     */
    getMe: (userId: string) => {
        return apiFetch<LoginResponse>(`/auth/me?userId=${userId}`);
    },
};
