import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, Modal, Platform, Pressable, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { PRODUCTS_DATA } from '@/constants/data';
import { useFavorites } from '@/contexts/FavoritesContext';

export default function CategoryProductsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { addToCart } = useCart();
    const { isDarkMode, colors } = useTheme();
    const categoryTitle = params.title as string || 'Products';
    const [searchQuery, setSearchQuery] = useState('');
    const { isFavorite, toggleFavorite } = useFavorites();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [addedProductName, setAddedProductName] = useState('');

    // Get products for this category or use default
    const categoryProducts = PRODUCTS_DATA[categoryTitle] || PRODUCTS_DATA['Chairs'];

    const filteredProducts = categoryProducts.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );



    const handleQuickAddToCart = (item: any, e: any) => {
        e.stopPropagation(); // Prevent navigation to detail page

        const cartItem = {
            id: item.id,
            category: categoryTitle,
            name: item.name,
            price: item.price,
            oldPrice: item.oldPrice,
            quantity: 1,
            color: 'Default',
            colorHex: '#1a2632',
            image: item.image,
        };

        addToCart(cartItem);
        setAddedProductName(item.name);
        setShowSuccessModal(true);

        // Auto close after 1.5 seconds
        setTimeout(() => {
            setShowSuccessModal(false);
        }, 1500);
    };

    const renderRating = (rating: number) => {
        return (
            <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#FFB800" />
                <Text style={[styles.ratingText, { color: colors.text }]}>{rating}</Text>
            </View>
        );
    };

    const renderProductCard = ({ item, index }: { item: any; index: number }) => {
        const isLeftColumn = index % 2 === 0;
        const favorited = isFavorite(item.id);
        return (
            <Pressable
                style={[styles.productCard, { backgroundColor: colors.surface }, isLeftColumn ? styles.cardLeft : styles.cardRight]}
                onPress={() => router.push({
                    pathname: '/product-detail',
                    params: { category: categoryTitle, id: item.id }
                })}
            >
                <View style={[styles.imageContainer, { backgroundColor: colors.surfaceSecondary }]}>
                    <TouchableOpacity
                        style={[styles.favoriteButton, { backgroundColor: colors.surface }]}
                        onPress={() => toggleFavorite(item.id)}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={favorited ? "heart" : "heart-outline"}
                            size={18}
                            color={favorited ? "#FF4444" : colors.text}
                        />
                    </TouchableOpacity>
                    <Image source={item.image} style={styles.productImage} resizeMode="contain" />
                    <TouchableOpacity
                        style={[styles.addButton, { backgroundColor: colors.surface }]}
                        onPress={(e) => handleQuickAddToCart(item, e)}
                    >
                        <Ionicons name="add-circle" size={32} color={colors.text} />
                    </TouchableOpacity>
                </View>

                <View style={styles.productInfo}>
                    <Text style={[styles.productName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
                    <Text style={[styles.productDescription, { color: colors.textSecondary }]} numberOfLines={1}>{item.description}</Text>

                    <View style={styles.priceRow}>
                        <View style={styles.priceContainer}>
                            <Text style={[styles.price, { color: colors.text }]}>${item.price}</Text>
                            {item.oldPrice && (
                                <Text style={[styles.oldPrice, { color: colors.textSecondary }]}>${item.oldPrice}</Text>
                            )}
                        </View>
                        {renderRating(item.rating)}
                    </View>
                </View>
            </Pressable>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

            {/* Header with Back Button */}
            <View style={[styles.header, { backgroundColor: colors.surface }]}>
                <TouchableOpacity
                    style={[styles.backButton, { backgroundColor: colors.surfaceSecondary }]}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>

                <Text style={[styles.title, { color: colors.text }]}>{categoryTitle}</Text>

                <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.surfaceSecondary }]}>
                    <Ionicons name="notifications-outline" size={24} color={colors.text} />
                    <View style={styles.notificationBadge} />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={[styles.searchSection, { backgroundColor: colors.surface }]}>
                <View style={[styles.searchContainer, { backgroundColor: colors.surfaceSecondary }]}>
                    <Ionicons name="search-outline" size={20} color={colors.textSecondary} style={styles.searchIcon} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Search here..."
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Product Grid */}
            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                renderItem={renderProductCard}
            />

            {/* Quick Add Success Toast */}
            <Modal
                transparent
                visible={showSuccessModal}
                animationType="fade"
                onRequestClose={() => setShowSuccessModal(false)}
            >
                <View style={styles.toastContainer}>
                    <View style={[styles.toast, { backgroundColor: colors.surface }]}>
                        <View style={styles.toastIcon}>
                            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                        </View>
                        <View style={styles.toastTextContainer}>
                            <Text style={[styles.toastTitle, { color: colors.text }]}>Added to Cart!</Text>
                            <Text style={[styles.toastMessage, { color: colors.textSecondary }]} numberOfLines={1}>{addedProductName}</Text>
                        </View>
                    </View>
                </View>
            </Modal>
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
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
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
        fontSize: 20,
        fontWeight: '700',
        color: '#1a2632',
        textAlign: 'center',
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F7FA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF4444',
        borderWidth: 1.5,
        borderColor: '#FFFFFF',
    },
    searchSection: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 48,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#1a2632',
    },
    listContent: {
        paddingHorizontal: 12,
        paddingTop: 16,
        paddingBottom: 20,
    },
    productCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        width: '47%',

        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    cardLeft: {
        marginRight: 8,
        marginLeft: 8,
    },
    cardRight: {
        marginLeft: 8,
        marginRight: 8,
    },
    imageContainer: {
        width: '100%',
        height: 140,
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        marginBottom: 12,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    productImage: {
        width: '90%',
        height: '90%',
    },
    addButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    favoriteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    productInfo: {
        gap: 4,
    },
    productName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1a2632',
    },
    productDescription: {
        fontSize: 12,
        color: '#8B9DB8',
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a2632',
    },
    oldPrice: {
        fontSize: 13,
        fontWeight: '400',
        color: '#8B9DB8',
        textDecorationLine: 'line-through',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1a2632',
    },

    // Toast Notification
    toastContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
    },
    toast: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
        minWidth: 280,
        maxWidth: '90%',
    },
    toastIcon: {
        marginRight: 12,
    },
    toastTextContainer: {
        flex: 1,
    },
    toastTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1a2632',
        marginBottom: 2,
    },
    toastMessage: {
        fontSize: 13,
        color: '#8B9DB8',
    },
});
