import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    FlatList,
    Image,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { PRODUCTS_DATA, SIMILAR_PRODUCTS } from '@/constants/data';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';

// Helper to flatten products or find by ID
const getAllProducts = () => {
    let allProducts: any[] = [];
    Object.values(PRODUCTS_DATA).forEach((categoryProducts) => {
        allProducts = [...allProducts, ...categoryProducts];
    });
    return [...allProducts, ...SIMILAR_PRODUCTS];
};

export default function FavoritesScreen() {
    const router = useRouter();
    const { favorites, toggleFavorite } = useFavorites();
    const { addToCart } = useCart();

    const allProducts = getAllProducts();
    const favoriteProducts = allProducts.filter((p) => favorites.includes(p.id));

    const handleAddToCart = (product: any) => {
        addToCart({
            id: product.id,
            category: 'Unknown', // We might want to store category in favorites if needed, or lookup
            name: product.name,
            price: product.price,
            oldPrice: product.oldPrice,
            quantity: 1,
            color: product.colors?.[0] || 'Default',
            colorHex: '#000000',
            image: product.productViews?.[0]?.image || product.images?.[0],
        });
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <Image
                    source={item.productViews?.[0]?.image || item.images?.[0]}
                    style={styles.productImage}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.detailsContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.productName} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <TouchableOpacity
                        onPress={() => toggleFavorite(item.id)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="close" size={20} color="#8B9DB8" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.qtyText}>Qty: 1</Text>

                <View style={styles.priceRow}>
                    <View style={styles.prices}>
                        <Text style={styles.price}>${item.price}</Text>
                        {item.oldPrice && (
                            <Text style={styles.oldPrice}>${item.oldPrice}</Text>
                        )}
                    </View>
                    <TouchableOpacity
                        style={styles.cartButton}
                        onPress={() => handleAddToCart(item)}
                    >
                        <Ionicons name="bag-outline" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1a2632" />
                </TouchableOpacity>
                <Text style={styles.title}>Wishlist</Text>
                <View style={{ width: 24 }} />
            </View>

            {favoriteProducts.length > 0 ? (
                <FlatList
                    data={favoriteProducts}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons name="heart-outline" size={64} color="#E5E9F0" />
                    <Text style={styles.emptyText}>Your wishlist is empty</Text>
                    <Text style={styles.emptySubtext}>
                        Save items you love to find them easily later.
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
    },
    backButton: {
        padding: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a2632',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#F7F8FA', // Light grey background like in image
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        gap: 16,
        alignItems: 'center',
    },
    imageContainer: {
        width: 80,
        height: 80,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productImage: {
        width: '80%',
        height: '80%',
    },
    detailsContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a2632',
        flex: 1,
        marginRight: 8,
    },
    qtyText: {
        fontSize: 13,
        color: '#8B9DB8',
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    prices: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a2632',
    },
    oldPrice: {
        fontSize: 13,
        color: '#8B9DB8',
        textDecorationLine: 'line-through',
    },
    cartButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#1a2632',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        marginTop: -50,
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
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 22,
    },
});
