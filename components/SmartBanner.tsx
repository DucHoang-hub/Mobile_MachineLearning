import React, { useEffect, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, CustomerSegment } from '@/contexts/AuthContext';

// ──────────────────────────────────────────────
// Cấu hình nội dung + style cho từng phân khúc
// ──────────────────────────────────────────────
interface BannerConfig {
    icon: keyof typeof Ionicons.glyphMap;
    badge: string;
    title: string;
    subtitle: string;
    buttonText: string;
    /** Gradient effect giả lập bằng 2 màu nền chồng nhau */
    gradientStart: string;
    gradientEnd: string;
    accentColor: string;
    textColor: string;
    subtitleColor: string;
    buttonBg: string;
    buttonTextColor: string;
    iconBgColor: string;
}

const BANNER_CONFIGS: Record<CustomerSegment | 'default', BannerConfig> = {
    // ── VIP: Sang trọng — Vàng gold / Đen sâu ──
    VIP: {
        icon: 'diamond',
        badge: '👑 VIP EXCLUSIVE',
        title: 'Đặc quyền VIP',
        subtitle: 'Miễn phí vận chuyển mọi đơn hàng &\nTrải nghiệm sớm bộ sưu tập Premium.',
        buttonText: 'Xem ngay',
        gradientStart: '#1a1a2e',
        gradientEnd: '#16213e',
        accentColor: '#FFD700',
        textColor: '#FFFFFF',
        subtitleColor: 'rgba(255, 255, 255, 0.8)',
        buttonBg: '#FFD700',
        buttonTextColor: '#1a1a2e',
        iconBgColor: 'rgba(255, 215, 0, 0.15)',
    },

    // ── Dormant: Lôi kéo — Đỏ / Cam ấm ──
    Dormant: {
        icon: 'gift',
        badge: '🎁 ĐẶC BIỆT CHO BẠN',
        title: 'Chúng tôi nhớ bạn!',
        subtitle: 'Tặng bạn Voucher 30% cho lần quay lại này.\nHạn sử dụng: 24h.',
        buttonText: 'Lấy mã ngay',
        gradientStart: '#FF6B6B',
        gradientEnd: '#FF8E53',
        accentColor: '#FFF3E0',
        textColor: '#FFFFFF',
        subtitleColor: 'rgba(255, 255, 255, 0.9)',
        buttonBg: '#FFFFFF',
        buttonTextColor: '#FF6B6B',
        iconBgColor: 'rgba(255, 255, 255, 0.2)',
    },

    // ── Casual / Default: Tươi sáng — Xanh dương nhạt ──
    Casual: {
        icon: 'flash',
        badge: '⚡ FLASH SALE',
        title: 'Flash Sale Nội Thất',
        subtitle: 'Săn ngay các món đồ trang trí\nđang giảm giá sâu hôm nay.',
        buttonText: 'Săn Sale',
        gradientStart: '#4A90D9',
        gradientEnd: '#667eea',
        accentColor: '#E3F2FD',
        textColor: '#FFFFFF',
        subtitleColor: 'rgba(255, 255, 255, 0.9)',
        buttonBg: '#FFFFFF',
        buttonTextColor: '#4A90D9',
        iconBgColor: 'rgba(255, 255, 255, 0.2)',
    },

    // ── Default fallback (chưa đăng nhập) — giống Casual ──
    default: {
        icon: 'flash',
        badge: '⚡ FLASH SALE',
        title: 'Flash Sale Nội Thất',
        subtitle: 'Săn ngay các món đồ trang trí\nđang giảm giá sâu hôm nay.',
        buttonText: 'Săn Sale',
        gradientStart: '#4A90D9',
        gradientEnd: '#667eea',
        accentColor: '#E3F2FD',
        textColor: '#FFFFFF',
        subtitleColor: 'rgba(255, 255, 255, 0.9)',
        buttonBg: '#FFFFFF',
        buttonTextColor: '#4A90D9',
        iconBgColor: 'rgba(255, 255, 255, 0.2)',
    },
};

// ──────────────────────────────────────────────
// Props
// ──────────────────────────────────────────────
interface SmartBannerProps {
    /** Callback khi nhấn nút CTA trên banner */
    onPress?: (segment: CustomerSegment | 'default') => void;
}

// ──────────────────────────────────────────────
// Component chính
// ──────────────────────────────────────────────
export default function SmartBanner({ onPress }: SmartBannerProps) {
    const { user } = useAuth();

    // Xác định phân khúc — fallback 'default' nếu user null hoặc chưa có segment
    const segment: CustomerSegment | 'default' = user?.segment ?? 'default';
    const config = BANNER_CONFIGS[segment];

    // ── Animations ──
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Entrance animation — fade + slide lên + scale nhẹ
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();

        // Shimmer loop cho accent decoration
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [segment]);

    // Shimmer opacity cho các decorative elements
    const shimmerOpacity = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [
                        { translateY: slideAnim },
                        { scale: scaleAnim },
                    ],
                },
            ]}
        >
            <View style={[styles.banner, { backgroundColor: config.gradientStart }]}>
                {/* ── Background decorations ── */}
                <View style={[styles.gradientOverlay, { backgroundColor: config.gradientEnd }]} />
                <Animated.View
                    style={[
                        styles.decorCircle1,
                        {
                            backgroundColor: config.accentColor,
                            opacity: shimmerOpacity,
                        },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.decorCircle2,
                        {
                            backgroundColor: config.accentColor,
                            opacity: shimmerOpacity,
                        },
                    ]}
                />
                {/* Đường viền accent cho VIP */}
                {segment === 'VIP' && (
                    <Animated.View
                        style={[
                            styles.vipAccentBar,
                            { opacity: shimmerOpacity },
                        ]}
                    />
                )}

                {/* ── Content ── */}
                <View style={styles.contentWrapper}>
                    {/* Icon + Badge */}
                    <View style={styles.topRow}>
                        <View style={[styles.iconContainer, { backgroundColor: config.iconBgColor }]}>
                            <Ionicons name={config.icon} size={20} color={config.accentColor} />
                        </View>
                        <View style={[styles.badgeContainer, { backgroundColor: config.iconBgColor }]}>
                            <Text style={[styles.badgeText, { color: config.textColor }]}>
                                {config.badge}
                            </Text>
                        </View>
                    </View>

                    {/* Title */}
                    <Text style={[styles.title, { color: config.textColor }]}>
                        {config.title}
                    </Text>

                    {/* Subtitle */}
                    <Text style={[styles.subtitle, { color: config.subtitleColor }]}>
                        {config.subtitle}
                    </Text>

                    {/* CTA Button */}
                    <TouchableOpacity
                        style={[styles.ctaButton, { backgroundColor: config.buttonBg }]}
                        activeOpacity={0.85}
                        onPress={() => onPress?.(segment)}
                    >
                        <Text style={[styles.ctaText, { color: config.buttonTextColor }]}>
                            {config.buttonText}
                        </Text>
                        <Ionicons
                            name="arrow-forward"
                            size={16}
                            color={config.buttonTextColor}
                            style={{ marginLeft: 6 }}
                        />
                    </TouchableOpacity>
                </View>

                {/* ── Countdown badge cho Dormant ── */}
                {segment === 'Dormant' && (
                    <View style={styles.countdownBadge}>
                        <Ionicons name="time-outline" size={14} color="#FF6B6B" />
                        <Text style={styles.countdownText}>Còn 24:00:00</Text>
                    </View>
                )}
            </View>
        </Animated.View>
    );
}

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    banner: {
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        minHeight: 190,
    },

    // ── Background decorations ──
    gradientOverlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '50%',
        borderTopLeftRadius: 80,
        borderBottomLeftRadius: 30,
        opacity: 0.6,
    },
    decorCircle1: {
        position: 'absolute',
        top: -30,
        right: -20,
        width: 120,
        height: 120,
        borderRadius: 60,
        opacity: 0.15,
    },
    decorCircle2: {
        position: 'absolute',
        bottom: -40,
        right: 60,
        width: 80,
        height: 80,
        borderRadius: 40,
        opacity: 0.1,
    },
    vipAccentBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: '#FFD700',
    },

    // ── Content ──
    contentWrapper: {
        padding: 20,
        zIndex: 2,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 10,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeContainer: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 6,
        letterSpacing: 0.3,
    },
    subtitle: {
        fontSize: 13,
        lineHeight: 20,
        marginBottom: 16,
        fontWeight: '400',
    },

    // ── CTA Button ──
    ctaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    ctaText: {
        fontSize: 14,
        fontWeight: '700',
    },

    // ── Countdown (Dormant) ──
    countdownBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        gap: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    countdownText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FF6B6B',
    },
});
