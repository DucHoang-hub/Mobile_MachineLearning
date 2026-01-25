import { useCart } from '@/contexts/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, Modal, Platform, Pressable, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Sample product data for each category
const PRODUCTS_DATA: { [key: string]: any[] } = {
    'Chairs': [
        {
            id: '1',
            name: 'Buddy Chair',
            description: 'Modern saddle arms',
            price: 14,
            oldPrice: 20,
            rating: 4.5,
            image: require('../assets/images/screen3_img1.png')
        },
        {
            id: '2',
            name: 'Wingback Chair',
            description: 'Modern saddle arms',
            price: 15,
            oldPrice: 18,
            rating: 4.5,
            image: require('../assets/images/screen3_img2.png')
        },
        {
            id: '3',
            name: 'Winston Chair',
            description: 'Modern saddle arms',
            price: 20,
            oldPrice: 25,
            rating: 4.5,
            image: require('../assets/images/screen3_img3.png')
        },
        {
            id: '4',
            name: 'Beige Chair',
            description: 'Modern saddle arms',
            price: 16,
            oldPrice: 21,
            rating: 4.5,
            image: require('../assets/images/screen3_img4.png')
        },
        {
            id: '5',
            name: 'Dining Chair',
            description: 'Modern saddle arms',
            price: 12,
            oldPrice: 18,
            rating: 4.5,
            image: require('../assets/images/screen3_img5.png')
        },
        {
            id: '6',
            name: 'Harbour Chair',
            description: 'Modern saddle arms',
            price: 17,
            oldPrice: 23,
            rating: 4.5,
            image: require('../assets/images/screen3_img6.png')
        },
    ],
    'Tables': [
        {
            id: '1',
            name: 'Modern Table',
            description: 'Sleek design',
            price: 120,
            oldPrice: 150,
            rating: 4.5,
            image: require('../assets/images/screen3_img7.png')
        },
        {
            id: '2',
            name: 'Dining Table',
            description: 'Family sized',
            price: 200,
            oldPrice: 250,
            rating: 4.5,
            image: require('../assets/images/screen3_img8.png')
        },
        {
            id: '3',
            name: 'Coffee Table',
            description: 'Minimalist style',
            price: 85,
            oldPrice: 110,
            rating: 4.5,
            image: require('../assets/images/screen3_img9.png')
        },
        {
            id: '4',
            name: 'Side Table',
            description: 'Compact design',
            price: 45,
            oldPrice: 60,
            rating: 4.5,
            image: require('../assets/images/screen3_img10.png')
        },
    ],
    'Sofas': [
        {
            id: '1',
            name: 'Comfort Sofa',
            description: 'Soft cushions',
            price: 350,
            oldPrice: 450,
            rating: 4.5,
            image: require('../assets/images/screen3_img11.png')
        },
        {
            id: '2',
            name: 'Modern Sofa',
            description: 'Contemporary design',
            price: 400,
            oldPrice: 500,
            rating: 4.5,
            image: require('../assets/images/screen3_img12.png')
        },
        {
            id: '3',
            name: 'L-Shape Sofa',
            description: 'Spacious seating',
            price: 550,
            oldPrice: 650,
            rating: 4.5,
            image: require('../assets/images/screen3_img13.png')
        },
        {
            id: '4',
            name: 'Velvet Sofa',
            description: 'Luxury fabric',
            price: 480,
            oldPrice: 600,
            rating: 4.5,
            image: require('../assets/images/screen3_img14.png')
        },
    ],
    'Hanging chairs': [
        {
            id: '1',
            name: 'Swing Chair',
            description: 'Relaxing design',
            price: 95,
            oldPrice: 120,
            rating: 4.5,
            image: require('../assets/images/screen3_img15.png')
        },
        {
            id: '2',
            name: 'Hammock Chair',
            description: 'Outdoor style',
            price: 110,
            oldPrice: 140,
            rating: 4.5,
            image: require('../assets/images/screen3_img16.png')
        },
        {
            id: '3',
            name: 'Pod Chair',
            description: 'Modern hanging',
            price: 150,
            oldPrice: 180,
            rating: 4.5,
            image: require('../assets/images/screen3_img1.png')
        },
        {
            id: '4',
            name: 'Basket Chair',
            description: 'Woven design',
            price: 85,
            oldPrice: 100,
            rating: 4.5,
            image: require('../assets/images/screen3_img2.png')
        },
    ],
    'Cabinets': [
        {
            id: '1',
            name: 'Storage Cabinet',
            description: 'Multiple shelves',
            price: 180,
            oldPrice: 220,
            rating: 4.5,
            image: require('../assets/images/screen3_img17.png')
        },
        {
            id: '2',
            name: 'Display Cabinet',
            description: 'Glass doors',
            price: 250,
            oldPrice: 300,
            rating: 4.5,
            image: require('../assets/images/screen3_img3.png')
        },
        {
            id: '3',
            name: 'TV Cabinet',
            description: 'Media storage',
            price: 200,
            oldPrice: 260,
            rating: 4.5,
            image: require('../assets/images/screen3_img4.png')
        },
        {
            id: '4',
            name: 'File Cabinet',
            description: 'Office organizer',
            price: 120,
            oldPrice: 150,
            rating: 4.5,
            image: require('../assets/images/screen3_img5.png')
        },
    ],
    'Lamps': [
        {
            id: '1',
            name: 'Floor Lamp',
            description: 'Adjustable height',
            price: 65,
            oldPrice: 85,
            rating: 4.5,
            image: require('../assets/images/screen3_img6.png')
        },
        {
            id: '2',
            name: 'Table Lamp',
            description: 'Bedside light',
            price: 35,
            oldPrice: 45,
            rating: 4.5,
            image: require('../assets/images/screen3_img7.png')
        },
        {
            id: '3',
            name: 'Desk Lamp',
            description: 'Study light',
            price: 40,
            oldPrice: 55,
            rating: 4.5,
            image: require('../assets/images/screen3_img8.png')
        },
        {
            id: '4',
            name: 'Wall Lamp',
            description: 'Space saver',
            price: 50,
            oldPrice: 70,
            rating: 4.5,
            image: require('../assets/images/screen3_img9.png')
        },
    ],
    'Cupboards': [
        {
            id: '1',
            name: 'Kitchen Cupboard',
            description: 'Storage solution',
            price: 220,
            oldPrice: 280,
            rating: 4.5,
            image: require('../assets/images/screen3_img10.png')
        },
        {
            id: '2',
            name: 'Bedroom Cupboard',
            description: 'Wardrobe style',
            price: 300,
            oldPrice: 380,
            rating: 4.5,
            image: require('../assets/images/screen3_img11.png')
        },
        {
            id: '3',
            name: 'Corner Cupboard',
            description: 'Space efficient',
            price: 160,
            oldPrice: 200,
            rating: 4.5,
            image: require('../assets/images/screen3_img12.png')
        },
        {
            id: '4',
            name: 'Tall Cupboard',
            description: 'Extra storage',
            price: 240,
            oldPrice: 300,
            rating: 4.5,
            image: require('../assets/images/screen3_img13.png')
        },
    ],
};

export default function CategoryProductsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { addToCart } = useCart();
    const categoryTitle = params.title as string || 'Products';
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState<string[]>([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [addedProductName, setAddedProductName] = useState('');

    // Get products for this category or use default
    const categoryProducts = PRODUCTS_DATA[categoryTitle] || PRODUCTS_DATA['Chairs'];

    const filteredProducts = categoryProducts.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleFavorite = (id: string) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
        );
    };

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
                <Text style={styles.ratingText}>{rating}</Text>
            </View>
        );
    };

    const renderProductCard = ({ item, index }: { item: any; index: number }) => {
        const isLeftColumn = index % 2 === 0;
        const uniqueId = `${categoryTitle}-${item.id}`;
        const isFavorite = favorites.includes(uniqueId);
        return (
            <Pressable
                style={[styles.productCard, isLeftColumn ? styles.cardLeft : styles.cardRight]}
                onPress={() => router.push({
                    pathname: '/product-detail',
                    params: { category: categoryTitle, id: item.id }
                })}
            >
                <View style={styles.imageContainer}>
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={() => toggleFavorite(uniqueId)}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={18}
                            color="#FF4444"
                        />
                    </TouchableOpacity>
                    <Image source={item.image} style={styles.productImage} resizeMode="contain" />
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={(e) => handleQuickAddToCart(item, e)}
                    >
                        <Ionicons name="add-circle" size={32} color="#1a2632" />
                    </TouchableOpacity>
                </View>

                <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.productDescription} numberOfLines={1}>{item.description}</Text>

                    <View style={styles.priceRow}>
                        <View style={styles.priceContainer}>
                            <Text style={styles.price}>${item.price}</Text>
                            {item.oldPrice && (
                                <Text style={styles.oldPrice}>${item.oldPrice}</Text>
                            )}
                        </View>
                        {renderRating(item.rating)}
                    </View>
                </View>
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.push('/(tabs)/categories')}
                >
                    <Ionicons name="arrow-back" size={24} color="#1a2632" />
                </TouchableOpacity>

                <Text style={styles.title}>{categoryTitle}</Text>

                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="notifications-outline" size={24} color="#1a2632" />
                    <View style={styles.notificationBadge} />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchSection}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#8B9DB8" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search here..."
                        placeholderTextColor="#8B9DB8"
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
                    <View style={styles.toast}>
                        <View style={styles.toastIcon}>
                            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                        </View>
                        <View style={styles.toastTextContainer}>
                            <Text style={styles.toastTitle}>Added to Cart!</Text>
                            <Text style={styles.toastMessage} numberOfLines={1}>{addedProductName}</Text>
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
