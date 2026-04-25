import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

// ──────────────────────────────────────────────
// Types — Phân khúc khách hàng từ K-Means AI
// ──────────────────────────────────────────────
export type CustomerSegment = 'VIP' | 'Dormant' | 'Casual';

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    /** Phân khúc khách hàng do AI (K-Means) xác định */
    segment?: CustomerSegment;
    /** Điểm RFM do AI tính toán */
    rfmScores?: {
        recency: number | null;
        frequency: number | null;
        monetary: number | null;
    };
}

interface AuthContextType {
    /** Thông tin user hiện tại, null nếu chưa đăng nhập */
    user: UserProfile | null;
    /** Trạng thái đăng nhập */
    isAuthenticated: boolean;
    /** Gọi khi đăng nhập thành công — lưu thông tin user vào global state */
    login: (userData: UserProfile) => void;
    /** Gọi khi đăng xuất — xóa toàn bộ thông tin user */
    logout: () => void;
}

// ──────────────────────────────────────────────
// Context — Khởi tạo với giá trị mặc định undefined
// để bắt lỗi khi dùng hook ngoài Provider
// ──────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ──────────────────────────────────────────────
// Provider — Bọc ở root layout để cung cấp
// state xác thực cho toàn bộ ứng dụng
// ──────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null);

    // useCallback để tránh re-render không cần thiết cho các component con
    const login = useCallback((userData: UserProfile) => {
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
    }, []);

    // useMemo để ổn định reference của value object,
    // chỉ tạo lại khi user thay đổi
    const value = useMemo<AuthContextType>(() => ({
        user,
        isAuthenticated: user !== null,
        login,
        logout,
    }), [user, login, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// ──────────────────────────────────────────────
// Custom Hook — Truy cập auth state an toàn
// với kiểm tra lỗi khi dùng ngoài Provider
// ──────────────────────────────────────────────
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error(
            'useAuth must be used within an AuthProvider. ' +
            'Wrap your app with <AuthProvider> in _layout.tsx.'
        );
    }
    return context;
};
