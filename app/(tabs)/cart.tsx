import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function CartScreen() {
    const router = useRouter();
    const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();
    const { isDarkMode, colors } = useTheme();
    const [ menuVisible, setMenuVisible ] = useState(false);
    const { t } = useLanguage();

    const {width} = Dimensions.get('window');
    const slideAmin = useRef(new Animated.Value(-width)).current;

    const totalPrice = getTotalPrice();    

    const handleQuantityChange = (id: string, color: string, currentQty: number, increment: boolean) => {
        if (increment) {
            updateQuantity(id, color, currentQty + 1);
        } else if (currentQty > 1) {
            updateQuantity(id, color, currentQty - 1);
        }
    };

    const closedMenu = () => {
        setMenuVisible(true);
        Animated.timing(slideAmin, {
            toValue: -width,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setMenuVisible(false));
    }

    if (cartItems.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
                <View style={[styles.header, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.title, { color: colors.text, textAlign: 'center' }]}>{t.cart}</Text>
                </View>
                <View style={styles.emptyContent}>
                    <Ionicons name="bag-handle-outline" size={64} color={colors.textSecondary} />
                    <Text style={[styles.emptyText, { color: colors.text }]}>{t.emptyCart}</Text>
                    <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>{t.emptyCartMsg}</Text>
                    <TouchableOpacity
                        style={[styles.shopNowButton, { backgroundColor: colors.primary }]}
                        onPress={() => router.push('/(tabs)/categories')}
                    >
                        <Text style={[styles.shopNowText, { color: colors.primaryText }]}>{t.startShopping}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface }]}>
                <TouchableOpacity
                    style={[styles.backButton, { backgroundColor: colors.surfaceSecondary }]}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>{t.cart}</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Cart Items */}
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {cartItems.map((item, index) => (
                    <View key={`${item.id}-${item.colorHex}-${index}`} style={[styles.cartCard, { backgroundColor: colors.surface }]}>
                        {/* Product Image */}
                        <View style={[styles.imageContainer, { backgroundColor: colors.surfaceSecondary }]}>
                            <Image
                                source={item.image}
                                style={styles.productImage}
                                resizeMode="contain"
                            />
                        </View>

                        {/* Product Info */}
                        <View style={styles.productInfo}>
                            <View style={styles.nameRow}>
                                <Text style={[styles.productName, { color: colors.text }]} numberOfLines={1}>
                                    {item.name}
                                </Text>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => removeFromCart(item.id, item.colorHex)}
                                >
                                    <Ionicons name="trash-outline" size={20} color="#FF4444" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.detailsRow}>
                                <Text style={[styles.qtyLabel, { color: colors.textSecondary }]}>{t.qty} : {item.quantity}</Text>
                                <View style={styles.colorIndicator}>
                                    <View
                                        style={[
                                            styles.colorDot,
                                            { backgroundColor: item.colorHex }
                                        ]}
                                    />
                                    <Text style={[styles.colorText, { color: colors.text }]}>{item.color}</Text>
                                </View>
                            </View>

                            <View style={styles.priceRow}>
                                <View style={styles.priceContainer}>
                                    <Text style={[styles.price, { color: colors.text }]}>${item.price}</Text>
                                    <Text style={[styles.oldPrice, { color: colors.textSecondary }]}>${item.oldPrice}</Text>
                                </View>

                                <View style={styles.quantityControls}>
                                    <TouchableOpacity
                                        style={[styles.quantityButton, { backgroundColor: colors.primary }]}
                                        onPress={() => handleQuantityChange(item.id, item.colorHex, item.quantity, false)}
                                    >
                                        <Ionicons name="remove" size={16} color={colors.primaryText} />
                                    </TouchableOpacity>

                                    <Text style={[styles.quantityText, { color: colors.text }]}>{item.quantity}</Text>

                                    <TouchableOpacity
                                        style={[styles.quantityButton, { backgroundColor: colors.primary }]}
                                        onPress={() => handleQuantityChange(item.id, item.colorHex, item.quantity, true)}
                                    >
                                        <Ionicons name="add" size={16} color={colors.primaryText} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}

                {/* Bottom spacing */}
                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Bottom Total and Checkout */}
            <View style={[styles.bottomBar, { backgroundColor: colors.surface }]}>
                <View style={styles.totalSection}>
                    <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>{t.total}</Text>
                    <Text style={[styles.totalPrice, { color: colors.text }]}>${totalPrice.toFixed(2)}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.checkoutButton, { backgroundColor: colors.primary }]}
                    onPress={() => {
                        closedMenu(),
                        router.replace('/check_out');
                    }}
                >
                    <Text style={[styles.checkoutText, { color: colors.primaryText }]}>{t.checkout}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F7FA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        flex: 1,
        fontSize: 24,
        fontWeight: '700',
        color: '#1a2632',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },

    // Cart Card
    cartCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    imageContainer: {
        width: 100,
        height: 100,
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    productImage: {
        width: '80%',
        height: '80%',
    },

    // Product Info
    productInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    productName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a2632',
        flex: 1,
        marginRight: 8,
    },
    deleteButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFE8E8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 12,
    },
    qtyLabel: {
        fontSize: 13,
        color: '#8B9DB8',
    },
    colorIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    colorDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    colorText: {
        fontSize: 13,
        color: '#1a2632',
        fontWeight: '500',
    },

    // Price Row
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    price: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a2632',
    },
    oldPrice: {
        fontSize: 14,
        color: '#8B9DB8',
        textDecorationLine: 'line-through',
    },

    // Quantity Controls
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    quantityButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#1a2632',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a2632',
        minWidth: 20,
        textAlign: 'center',
    },

    // Bottom Bar
    bottomBar: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingBottom: Platform.OS === 'ios' ? 30 : 16,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 8,
    },
    totalSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 14,
        color: '#8B9DB8',
    },
    totalPrice: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1a2632',
    },
    checkoutButton: {
        backgroundColor: '#1a2632',
        borderRadius: 16,
        paddingVertical: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },

    // Empty State
    emptyContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a2632',
        marginTop: 20,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#8B9DB8',
        marginTop: 8,
        marginBottom: 32,
    },
    shopNowButton: {
        backgroundColor: '#1a2632',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
    },
    shopNowText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
