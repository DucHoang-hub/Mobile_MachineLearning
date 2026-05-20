import { useCart } from '@/contexts/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

import { useFavorites } from '@/contexts/FavoritesContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ProductService, ProductApi } from '@/services/api';
import { resolveProductImage, resolveProductViews } from '@/utils/imageMap';

export default function ProductDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { addToCart } = useCart();
    const { isFavorite, toggleFavorite } = useFavorites();

    const categoryTitle = params.category as string || 'Chairs';
    const productId = params.id as string || '1';

    const {isDarkMode, colors} = useTheme();

    // ── State cho sản phẩm từ API ──
    const [product, setProduct] = useState<any>(null);
    const [similarProducts, setSimilarProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // ── Fetch chi tiết sản phẩm từ API ──
    const fetchProduct = useCallback(async () => {
        try {
            setLoading(true);
            const [productRes, similarRes] = await Promise.all([
                ProductService.getById(productId),
                ProductService.getSimilar(productId, 4),
            ]);

            if (productRes?.data) {
                const p = productRes.data;
                setProduct({
                    id: p.productId,
                    name: p.name,
                    description: p.description,
                    price: p.price,
                    oldPrice: p.oldPrice,
                    discount: p.discount,
                    rating: p.rating,
                    totalRatings: p.totalRatings,
                    reviews: p.reviews,
                    dimensions: p.dimensions,
                    colors: p.colors,
                    image: resolveProductImage(p.image),
                    productViews: resolveProductViews(p.productViews),
                    ratingBreakdown: p.ratingBreakdown,
                    category: p.category,
                });
            }

            if (similarRes?.data) {
                setSimilarProducts(similarRes.data.map((p: ProductApi) => ({
                    id: p.productId,
                    name: p.name,
                    description: p.description,
                    price: p.price,
                    oldPrice: p.oldPrice,
                    rating: p.rating,
                    image: resolveProductImage(p.image),
                })));
            }
        } catch (error) {
            console.error('Failed to fetch product detail:', error);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [pincode, setPincode] = useState('');
    const [showFullDetails, setShowFullDetails] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [addedProductName, setAddedProductName] = useState('');

    // Review states
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [userRating, setUserRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [reviews, setReviews] = useState<any[]>([
        {
            id: '1',
            userName: 'Rina Jones',
            userAvatar: '👩',
            rating: 4.0,
            comment: 'I adore this item. Just fantastic!! they create the actual seen in the picture !!',
            timestamp: 'Just Now',
        },
        {
            id: '2',
            userName: 'Smith Williams',
            userAvatar: '👨',
            rating: 4.2,
            comment: 'The best product quality.! It\'s amazing, Love it...!!',
            timestamp: '1 min ago',
        },
    ]);

    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);

    // Animation values for success modal
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const tickScaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const totalPrice = product ? (product.price * quantity).toFixed(2) : '0.00';

    useEffect(() => {
        if (showSuccessModal) {
            // Reset animations
            scaleAnim.setValue(0);
            tickScaleAnim.setValue(0);
            fadeAnim.setValue(0);

            // Start animations
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // Delayed tick animation
            setTimeout(() => {
                Animated.spring(tickScaleAnim, {
                    toValue: 1,
                    tension: 100,
                    friction: 7,
                    useNativeDriver: true,
                }).start();
            }, 200);

            // Auto close after 2 seconds
            setTimeout(() => {
                setShowSuccessModal(false);
            }, 2000);
        }
    }, [showSuccessModal]);

    const handleAddToCart = () => {
        const cartItem = {
            id: product.id,
            category: categoryTitle,
            name: product.name,
            price: product.price,
            oldPrice: product.oldPrice,
            quantity: quantity,
            color: getColorName(selectedColor),
            colorHex: product.colors[selectedColor],
            image: product.productViews?.[0]?.image || product.images?.[0],
        };

        addToCart(cartItem);

        Alert.alert(
            'Added to Cart',
            `${product.name} has been added to your cart!`,
            [
                { text: 'Continue Shopping', style: 'cancel' },
                { text: 'View Cart', onPress: () => router.push('/(tabs)/cart') }
            ]
        );
    };

    const getColorName = (index: number): string => {
        const colorNames = ['Yellow', 'Blue', 'Gold', 'Black', 'Brown', 'Beige', 'Purple', 'Navy'];
        return colorNames[index] || `Color ${index + 1}`;
    };

    const handleSubmitReview = () => {
        if (reviewText.trim() === '') {
            Alert.alert('Error', 'Please write a review comment');
            return;
        }

        const newReview = {
            id: Date.now().toString(),
            userName: 'Current User', // In real app, get from auth context
            userAvatar: '😊',
            rating: userRating,
            comment: reviewText,
            timestamp: 'Just Now',
        };

        setReviews(prev => [newReview, ...prev]);
        setShowReviewModal(false);
        setReviewText('');
        setUserRating(5);

        Alert.alert('Success', 'Your review has been submitted!');
    };


    const handleQuantityChange = (increment: boolean) => {
        if (increment) {
            setQuantity(prev => prev + 1);
        } else if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleImageScroll = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / SCREEN_WIDTH);
        setCurrentImageIndex(index);
    };

    const goToImage = (index: number) => {
        flatListRef.current?.scrollToIndex({ index, animated: true });
        setCurrentImageIndex(index);
    };

    const renderImageCarousel = () => (
        <View style={styles.carouselContainer}>
            {/* View label indicator */}
            <View style={styles.viewLabelContainer}>
                <Text style={styles.viewLabelText}>
                    {product.productViews?.[currentImageIndex]?.label || 'View'}
                </Text>
            </View>

            {/* Thumbnail navigation with labels */}
            <View style={styles.thumbnailRow}>
                {(product.productViews || []).map((view: any, index: number) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.thumbnailWithLabel,
                            currentImageIndex === index && styles.thumbnailActiveWithLabel
                        ]}
                        onPress={() => goToImage(index)}
                    >
                        <View style={[
                            styles.thumbnailImageBox,
                            currentImageIndex === index && { borderColor: '#1a2632' }
                        ]}>
                            <Image source={view.image} style={styles.thumbnail} resizeMode="contain" />
                        </View>
                        <Text style={[
                            styles.thumbnailLabelText,
                            currentImageIndex === index && styles.thumbnailLabelTextActive
                        ]}>
                            {view.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Main image carousel */}
            <View style={styles.mainImageContainer}>
                <FlatList
                    ref={flatListRef}
                    data={product.productViews || []}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleImageScroll}
                    scrollEventThrottle={16}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.imageSlide}>
                            <View style={styles.mainImageCircle}>
                                <Image source={item.image} style={styles.mainImage} resizeMode="contain" />
                            </View>
                        </View>
                    )}
                />

                {/* Navigation arrows */}
                <TouchableOpacity
                    style={[styles.navArrow, styles.navArrowLeft]}
                    onPress={() => currentImageIndex > 0 && goToImage(currentImageIndex - 1)}
                >
                    <Ionicons name="chevron-back" size={20} color="#8B9DB8" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.navArrow, styles.navArrowRight]}
                    onPress={() => currentImageIndex < (product.productViews?.length || 1) - 1 && goToImage(currentImageIndex + 1)}
                >
                    <Ionicons name="chevron-forward" size={20} color="#8B9DB8" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderColorOptions = () => (
        <View style={styles.colorSection}>
            {product.colors.map((color: string, index: number) => (
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        selectedColor === index && styles.colorOptionSelected
                    ]}
                    onPress={() => setSelectedColor(index)}
                />
            ))}
        </View>
    );

    const renderDimensions = () => (
        <View style={styles.dimensionsContainer}>
            <View style={styles.dimensionItem}>
                <View style={styles.dimensionIcon}>
                    <Ionicons name="resize-outline" size={20} color="#1a2632" />
                </View>
                <Text style={styles.dimensionValue}>{product.dimensions.height}</Text>
            </View>
            <View style={styles.dimensionItem}>
                <View style={styles.dimensionIcon}>
                    <Ionicons name="scan-outline" size={20} color="#1a2632" />
                </View>
                <Text style={styles.dimensionValue}>{product.dimensions.width}</Text>
            </View>
            <View style={styles.dimensionItem}>
                <View style={styles.dimensionIcon}>
                    <Ionicons name="cube-outline" size={20} color="#1a2632" />
                </View>
                <Text style={styles.dimensionValue}>{product.dimensions.depth}</Text>
            </View>
            <View style={styles.dimensionItem}>
                <View style={styles.dimensionIcon}>
                    <Ionicons name="barbell-outline" size={20} color="#1a2632" />
                </View>
                <Text style={styles.dimensionValue}>{product.dimensions.weight}</Text>
            </View>
        </View>
    );

    const renderDeliverySection = () => (
        <View style={styles.deliverySection}>
            <Text style={styles.sectionTitle}>Check Delivery</Text>
            <Text style={styles.deliverySubtitle}>Enter pincode to check delivery date / pickup</Text>

            <View style={styles.pincodeContainer}>
                <TextInput
                    style={styles.pincodeInput}
                    placeholder="Pincode"
                    placeholderTextColor="#8B9DB8"
                    value={pincode}
                    onChangeText={setPincode}
                    keyboardType="numeric"
                />
                <TouchableOpacity style={styles.checkButton}>
                    <Text style={styles.checkButtonText}>Check</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.deliveryOptions}>
                <View style={styles.deliveryOption}>
                    <View style={styles.deliveryIconCircle}>
                        <Ionicons name="car-outline" size={24} color="#1a2632" />
                    </View>
                    <Text style={styles.deliveryOptionText}>Free</Text>
                    <Text style={styles.deliveryOptionText}>Delivery</Text>
                </View>
                <View style={styles.deliveryOption}>
                    <View style={styles.deliveryIconCircle}>
                        <Ionicons name="cash-outline" size={24} color="#1a2632" />
                    </View>
                    <Text style={styles.deliveryOptionText}>Cash</Text>
                    <Text style={styles.deliveryOptionText}>On</Text>
                    <Text style={styles.deliveryOptionText}>Delivery</Text>
                </View>
                <View style={styles.deliveryOption}>
                    <View style={styles.deliveryIconCircle}>
                        <Ionicons name="refresh-outline" size={24} color="#1a2632" />
                    </View>
                    <Text style={styles.deliveryOptionText}>21 days</Text>
                    <Text style={styles.deliveryOptionText}>Return</Text>
                </View>
            </View>
        </View>
    );

    const renderRatingBreakdown = () => (
        <View style={styles.ratingSection}>
            <View style={styles.ratingLeft}>
                <Text style={styles.ratingScore}>{product.rating.toFixed(1)}</Text>
                <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons
                            key={star}
                            name={star <= Math.floor(product.rating) ? "star" : "star-outline"}
                            size={14}
                            color="#FFB800"
                        />
                    ))}
                </View>
                <Text style={styles.ratingCount}>
                    {product.totalRatings.toLocaleString()}
                </Text>
                <Text style={styles.ratingLabel}>Rating \ {product.reviews}</Text>
                <Text style={styles.ratingLabel}>Reviews</Text>
            </View>

            <View style={styles.ratingBreakdown}>
                {[5, 4, 3, 2, 1].map((star) => (
                    <View key={star} style={styles.ratingBar}>
                        <Text style={styles.ratingStarNum}>{star}</Text>
                        <Ionicons name="star" size={12} color="#FFB800" />
                        <View style={styles.ratingBarBg}>
                            <View
                                style={[
                                    styles.ratingBarFill,
                                    { width: `${product.ratingBreakdown[star]}%` }
                                ]}
                            />
                        </View>
                        <Text style={styles.ratingPercent}>{product.ratingBreakdown[star]}%</Text>
                    </View>
                ))}
            </View>
        </View>
    );

    const renderSimilarProducts = () => (
        <View style={styles.similarSection}>
            <View style={styles.similarHeader}>
                <Text style={styles.similarTitle}>Similar Products</Text>
                <TouchableOpacity>
                    <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {similarProducts.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.similarCard}
                        onPress={() => router.push({
                            pathname: '/product-detail',
                            params: { category: categoryTitle, id: item.id }
                        })}
                    >
                        <View style={styles.similarImageContainer}>
                            <Image source={item.image} style={styles.similarImage} resizeMode="contain" />
                            <TouchableOpacity style={styles.similarAddButton}>
                                <Ionicons name="bag-add" size={18} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.similarName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.similarDesc} numberOfLines={1}>{item.description}</Text>
                        <View style={styles.similarPriceRow}>
                            <View style={styles.similarPrices}>
                                <Text style={styles.similarPrice}>${item.price}</Text>
                                <Text style={styles.similarOldPrice}>${item.oldPrice}</Text>
                            </View>
                            <View style={styles.similarRating}>
                                <Ionicons name="star" size={12} color="#FFB800" />
                                <Text style={styles.similarRatingText}>{item.rating}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    // ── Loading state ──
    if (loading || !product) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
                <ActivityIndicator size="large" color={colors.primary || '#1a2632'} />
                <Text style={{ marginTop: 12, color: colors.textSecondary || '#8B9DB8', fontSize: 14 }}>Đang tải sản phẩm...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, {backgroundColor: colors.background}]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#1a2632" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>{categoryTitle}</Text>

                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.headerButton}>
                        <Ionicons name="search-outline" size={24} color="#1a2632" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => toggleFavorite(product.id)}
                    >
                        <Ionicons
                            name={isFavorite(product.id) ? "heart" : "heart-outline"}
                            size={24}
                            color={isFavorite(product.id) ? "#FF4444" : "#1a2632"}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Image Carousel */}
                {renderImageCarousel()}

                {/* Color Options */}
                {renderColorOptions()}

                {/* Product Info */}
                <View style={styles.productInfo}>
                    <View style={styles.nameRow}>
                        <Text style={styles.productName}>{product.name}</Text>
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>{product.discount}% OFF</Text>
                        </View>
                    </View>

                    <Text style={styles.productDescription}>{product.description}</Text>

                    {/* Price and Quantity */}
                    <View style={styles.priceQuantityRow}>
                        <View style={styles.priceContainer}>
                            <Text style={styles.currentPrice}>${product.price.toFixed(2)}</Text>
                            <Text style={styles.oldPrice}>${product.oldPrice.toFixed(2)}</Text>
                        </View>

                        <View style={styles.quantitySelector}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => handleQuantityChange(false)}
                            >
                                <Ionicons name="remove" size={20} color="#1a2632" />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => handleQuantityChange(true)}
                            >
                                <Ionicons name="add" size={20} color="#1a2632" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Dimensions */}
                {renderDimensions()}

                {/* Delivery Section */}
                {renderDeliverySection()}

                {/* Details Section */}
                <View style={styles.detailsSection}>
                    <Text style={styles.sectionTitle}>Details :</Text>
                    <Text style={styles.detailsText}>
                        This product is eligible for returns and size replacements from the 'My Orders' section.
                        {showFullDetails && ' Additional details about the product materials, care instructions, and warranty information can be found here.'}
                        ...{' '}
                        <Text
                            style={styles.readMoreText}
                            onPress={() => setShowFullDetails(!showFullDetails)}
                        >
                            {showFullDetails ? 'Show Less' : 'Read More'}
                        </Text>
                    </Text>
                </View>

                {/* Rating Breakdown */}
                {renderRatingBreakdown()}

                {/* Write Review */}
                <TouchableOpacity
                    style={styles.writeReviewButton}
                    onPress={() => setShowReviewModal(true)}
                >
                    <Ionicons name="add" size={20} color="#1a2632" />
                    <Text style={styles.writeReviewText}>Write Your Review</Text>
                </TouchableOpacity>

                {/* Reviews List */}
                <View style={styles.reviewsSection}>
                    <View style={styles.reviewsHeader}>
                        <Text style={styles.reviewsTitle}>{reviews.length} Reviews</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAllText}>View all</Text>
                        </TouchableOpacity>
                    </View>

                    {reviews.slice(0, 3).map((review) => (
                        <View key={review.id} style={styles.reviewCard}>
                            <View style={styles.reviewHeader}>
                                <View style={styles.reviewUserInfo}>
                                    <View style={styles.reviewAvatar}>
                                        <Text style={styles.reviewAvatarText}>{review.userAvatar}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.reviewUserName}>{review.userName}</Text>
                                        <Text style={styles.reviewTimestamp}>{review.timestamp}</Text>
                                    </View>
                                </View>
                                <View style={styles.reviewRatingBadge}>
                                    <Ionicons name="star" size={14} color="#FFB800" />
                                    <Text style={styles.reviewRatingText}>{review.rating}</Text>
                                </View>
                            </View>
                            <Text style={styles.reviewComment}>{review.comment}</Text>
                        </View>
                    ))}
                </View>

                {/* Similar Products */}
                {renderSimilarProducts()}

                {/* Bottom spacing for Add to Cart button */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Fixed Add to Cart Button */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                    <View style={styles.cartIconCircle}>
                        <Ionicons name="bag-outline" size={20} color="#FFFFFF" />
                    </View>
                    <Text style={styles.addToCartText}>Add to cart</Text>
                    <Text style={styles.cartPrice}>${totalPrice}</Text>
                </TouchableOpacity>
            </View>

            {/* Success Modal with Animation */}
            <Modal
                transparent
                visible={showSuccessModal}
                animationType="none"
                onRequestClose={() => setShowSuccessModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowSuccessModal(false)}
                >
                    <Animated.View
                        style={[
                            styles.modalContent,
                            {
                                opacity: fadeAnim,
                                transform: [{ scale: scaleAnim }]
                            }
                        ]}
                    >
                        <Animated.View
                            style={[
                                styles.successCircle,
                                {
                                    transform: [{ scale: tickScaleAnim }]
                                }
                            ]}
                        >
                            <Ionicons name="checkmark" size={48} color="#FFFFFF" />
                        </Animated.View>

                        <Text style={styles.successTitle}>Added to Cart!</Text>
                        <Text style={styles.successMessage}>{addedProductName}</Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={() => setShowSuccessModal(false)}
                            >
                                <Text style={styles.continueButtonText}>Continue Shopping</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.viewCartButton}
                                onPress={() => {
                                    setShowSuccessModal(false);
                                    router.push('/(tabs)/cart');
                                }}
                            >
                                <Text style={styles.viewCartButtonText}>View Cart</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </TouchableOpacity>
            </Modal>

            {/* Write Review Modal */}
            <Modal
                transparent
                visible={showReviewModal}
                animationType="slide"
                onRequestClose={() => setShowReviewModal(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.reviewModalOverlay}
                >
                    <View style={styles.reviewModalContent}>
                        <View style={styles.reviewModalHeader}>
                            <Text style={styles.reviewModalTitle}>Write Your Review</Text>
                            <TouchableOpacity onPress={() => setShowReviewModal(false)}>
                                <Ionicons name="close" size={24} color="#1a2632" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            {/* Star Rating */}
                            <View style={styles.ratingInputSection}>
                                <Text style={styles.ratingLabel}>Your Rating</Text>
                                <View style={styles.starRatingInput}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <TouchableOpacity
                                            key={star}
                                            onPress={() => setUserRating(star)}
                                            style={styles.starButton}
                                        >
                                            <Ionicons
                                                name={star <= userRating ? "star" : "star-outline"}
                                                size={36}
                                                color={star <= userRating ? "#FFB800" : "#D0D0D0"}
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Review Text */}
                            <View style={styles.reviewTextSection}>
                                <Text style={styles.reviewTextLabel}>Your Review</Text>
                                <TextInput
                                    style={styles.reviewTextInput}
                                    placeholder="Share your thoughts about this product..."
                                    placeholderTextColor="#8B9DB8"
                                    multiline
                                    numberOfLines={6}
                                    value={reviewText}
                                    onChangeText={setReviewText}
                                    textAlignVertical="top"
                                />
                            </View>

                            {/* Buttons */}
                            <View style={styles.reviewModalButtons}>
                                <TouchableOpacity
                                    style={styles.cancelReviewButton}
                                    onPress={() => {
                                        setShowReviewModal(false);
                                        setReviewText('');
                                        setUserRating(5);
                                    }}
                                >
                                    <Text style={styles.cancelReviewText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.submitReviewButton}
                                    onPress={handleSubmitReview}
                                >
                                    <Text style={styles.submitReviewText}>Submit Review</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
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
        paddingBottom: 15,
        backgroundColor: '#FFFFFF',
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F7FA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a2632',
    },
    headerRight: {
        flexDirection: 'row',
        gap: 10,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },

    // Image Carousel
    carouselContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    viewLabelContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    viewLabelText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a2632',
        backgroundColor: '#F5F7FA',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    thumbnailRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 20,
    },
    thumbnailWithLabel: {
        alignItems: 'center',
        gap: 6,
    },
    thumbnailActiveWithLabel: {
        // Active state handled by inner elements
    },
    thumbnailImageBox: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#F5F7FA',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    thumbnailColumn: {
        width: 50,
        gap: 10,
        alignItems: 'center',
    },
    thumbnailImage: {
        width: 45,
        height: 45,
        borderRadius: 10,
        backgroundColor: '#F5F7FA',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    thumbnailActive: {
        borderWidth: 2,
        borderColor: '#1a2632',
    },
    thumbnail: {
        width: '80%',
        height: '80%',
    },
    thumbnailLabelText: {
        fontSize: 11,
        fontWeight: '500',
        color: '#8B9DB8',
    },
    thumbnailLabelTextActive: {
        color: '#1a2632',
        fontWeight: '700',
    },
    mainImageContainer: {
        height: 220,
        position: 'relative',
    },
    imageSlide: {
        width: SCREEN_WIDTH - 40,
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainImageCircle: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: '#F5F7FA',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    mainImage: {
        width: '85%',
        height: '85%',
    },
    navArrow: {
        position: 'absolute',
        top: '50%',
        marginTop: -15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navArrowLeft: {
        left: 0,
    },
    navArrowRight: {
        right: 0,
    },

    // Color Options
    colorSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
        paddingVertical: 15,
    },
    colorOption: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    colorOptionSelected: {
        borderColor: '#1a2632',
        borderWidth: 3,
    },

    // Product Info
    productInfo: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    productName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1a2632',
    },
    discountBadge: {
        backgroundColor: '#FFE8E8',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    discountText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FF4444',
    },
    productDescription: {
        fontSize: 14,
        color: '#8B9DB8',
        lineHeight: 20,
        marginBottom: 15,
    },
    priceQuantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 10,
    },
    currentPrice: {
        fontSize: 26,
        fontWeight: '700',
        color: '#1a2632',
    },
    oldPrice: {
        fontSize: 16,
        color: '#8B9DB8',
        textDecorationLine: 'line-through',
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E9F0',
        borderRadius: 10,
        overflow: 'hidden',
    },
    quantityButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
    },
    quantityText: {
        width: 40,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        color: '#1a2632',
    },

    // Dimensions
    dimensionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: '#FFFFFF',
    },
    dimensionItem: {
        alignItems: 'center',
        gap: 8,
    },
    dimensionIcon: {
        width: 50,
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E9F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dimensionValue: {
        fontSize: 12,
        color: '#1a2632',
        fontWeight: '500',
    },

    // Delivery Section
    deliverySection: {
        backgroundColor: '#F5F7FA',
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 20,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a2632',
        marginBottom: 5,
    },
    deliverySubtitle: {
        fontSize: 13,
        color: '#8B9DB8',
        marginBottom: 15,
    },
    pincodeContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    pincodeInput: {
        flex: 1,
        height: 48,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 14,
        color: '#1a2632',
    },
    checkButton: {
        height: 48,
        paddingHorizontal: 25,
        backgroundColor: '#1a2632',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    deliveryOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    deliveryOption: {
        alignItems: 'center',
        gap: 5,
    },
    deliveryIconCircle: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    deliveryOptionText: {
        fontSize: 11,
        color: '#1a2632',
        textAlign: 'center',
    },

    // Details Section
    detailsSection: {
        paddingHorizontal: 20,
        paddingTop: 25,
        paddingBottom: 15,
    },
    detailsText: {
        fontSize: 14,
        color: '#8B9DB8',
        lineHeight: 22,
    },
    readMoreText: {
        color: '#1a2632',
        fontWeight: '600',
    },

    // Rating Section
    ratingSection: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    ratingLeft: {
        alignItems: 'center',
        marginRight: 30,
    },
    ratingScore: {
        fontSize: 36,
        fontWeight: '700',
        color: '#1a2632',
    },
    starsRow: {
        flexDirection: 'row',
        gap: 2,
        marginVertical: 5,
    },
    ratingCount: {
        fontSize: 14,
        color: '#1a2632',
        fontWeight: '500',
    },
    ratingLabel: {
        fontSize: 12,
        color: '#8B9DB8',
    },
    ratingBreakdown: {
        flex: 1,
        gap: 8,
    },
    ratingBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    ratingStarNum: {
        width: 10,
        fontSize: 12,
        color: '#1a2632',
        fontWeight: '500',
    },
    ratingBarBg: {
        flex: 1,
        height: 6,
        backgroundColor: '#E5E9F0',
        borderRadius: 3,
        overflow: 'hidden',
    },
    ratingBarFill: {
        height: '100%',
        backgroundColor: '#1a2632',
        borderRadius: 3,
    },
    ratingPercent: {
        width: 35,
        fontSize: 12,
        color: '#8B9DB8',
        textAlign: 'right',
    },

    // Write Review
    writeReviewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 15,
        marginHorizontal: 20,
        borderTopWidth: 1,
        borderColor: '#E5E9F0',
    },
    writeReviewText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1a2632',
    },

    // Similar Products
    similarSection: {
        paddingTop: 20,
    },
    similarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    similarTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a2632',
    },
    viewAllText: {
        fontSize: 14,
        color: '#8B9DB8',
    },
    similarCard: {
        width: 160,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        marginLeft: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    similarImageContainer: {
        width: '100%',
        height: 120,
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    similarImage: {
        width: '80%',
        height: '80%',
    },
    similarAddButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#1a2632',
        justifyContent: 'center',
        alignItems: 'center',
    },
    similarName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1a2632',
        marginBottom: 3,
    },
    similarDesc: {
        fontSize: 12,
        color: '#8B9DB8',
        marginBottom: 8,
    },
    similarPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    similarPrices: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    similarPrice: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1a2632',
    },
    similarOldPrice: {
        fontSize: 12,
        color: '#8B9DB8',
        textDecorationLine: 'line-through',
    },
    similarRating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    similarRatingText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#1a2632',
    },

    // Bottom Bar
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingBottom: Platform.OS === 'ios' ? 30 : 15,
        backgroundColor: '#FFFFFF',
    },
    addToCartButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a2632',
        borderRadius: 16,
        paddingVertical: 16,
        gap: 12,
    },
    cartIconCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addToCartText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    cartPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginLeft: 20,
    },

    // Success Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        width: '100%',
        maxWidth: 320,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    successCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    successTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1a2632',
        marginBottom: 8,
    },
    successMessage: {
        fontSize: 15,
        color: '#8B9DB8',
        textAlign: 'center',
        marginBottom: 24,
    },
    modalButtons: {
        width: '100%',
        gap: 12,
    },
    continueButton: {
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    continueButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1a2632',
    },
    viewCartButton: {
        backgroundColor: '#1a2632',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    viewCartButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },

    // Reviews Section
    reviewsSection: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: '#F8F9FA',
    },
    reviewsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    reviewsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a2632',
    },
    reviewCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    reviewUserInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    reviewAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F7FA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    reviewAvatarText: {
        fontSize: 20,
    },
    reviewUserName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1a2632',
    },
    reviewTimestamp: {
        fontSize: 12,
        color: '#8B9DB8',
        marginTop: 2,
    },
    reviewRatingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FFF9E6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    reviewRatingText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#FFB800',
    },
    reviewComment: {
        fontSize: 14,
        color: '#5A6B7F',
        lineHeight: 20,
    },

    // Review Modal
    reviewModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    reviewModalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: '85%',
    },
    reviewModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    reviewModalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a2632',
    },
    ratingInputSection: {
        marginBottom: 24,
    },
    starRatingInput: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
    },
    starButton: {
        padding: 4,
    },
    reviewTextSection: {
        marginBottom: 24,
    },
    reviewTextLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1a2632',
        marginBottom: 12,
    },
    reviewTextInput: {
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 12,
        padding: 16,
        fontSize: 15,
        color: '#1a2632',
        minHeight: 120,
    },
    reviewModalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelReviewButton: {
        flex: 1,
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    cancelReviewText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1a2632',
    },
    submitReviewButton: {
        flex: 1,
        backgroundColor: '#1a2632',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    submitReviewText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
