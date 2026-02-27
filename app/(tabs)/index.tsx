import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: any;
  discount?: string;
  oldPrice?: number;
}
interface Category {
  id: string;
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

// Mock Data
const CATEGORIES: Category[] = [
  { id: '1', name: 'Sofa', icon: 'sofa' },
  { id: '2', name: 'Chair', icon: 'chair-rolling' },
  { id: '3', name: 'Table', icon: 'table-furniture' },
  { id: '4', name: 'Cabinets', icon: 'file-cabinet' },
  { id: '5', name: 'Cupboard', icon: 'wardrobe' },
  { id: '6', name: 'Lamp', icon: 'floor-lamp' },
];

const BEST_SELLING_IMAGE = require('../../assets/images/screen3_img11.png');
const SECOND_BANNER_IMAGE = require('../../assets/images/screen3_img12.png');
const WINGBACK_CHAIR_1 = require('../../assets/images/screen3_img15.png');
const WINGBACK_CHAIR_2 = require('../../assets/images/screen3_img16.png');

import { PRODUCTS_DATA } from '@/constants/data';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useLocalSearchParams } from 'expo-router';

const NEW_ARRIVALS = [
  PRODUCTS_DATA['Chairs'][0],
  PRODUCTS_DATA['Chairs'][1],
];

const TRENDING = [
  PRODUCTS_DATA['Chairs'][1],
  PRODUCTS_DATA['Sofas'][2],
  PRODUCTS_DATA['Chairs'][3],
];

const OFFER_ZONE = [
  PRODUCTS_DATA['Lamps'][1],
  PRODUCTS_DATA['Chairs'][3],
];

const FURNITURE_DECOR = [
  PRODUCTS_DATA['Hanging chairs'][0],
  PRODUCTS_DATA['Chairs'][2],
  PRODUCTS_DATA['Tables'][1],
  PRODUCTS_DATA['Lamps'][3],
];
export default function HomeScreen() {
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('1');
  const userName = "Hoang Duc";
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  const { isDarkMode, colors } = useTheme();
  const { t } = useLanguage();
  const categoryTitle = params.title as string || "Products";
  const scrollRef = useRef<ScrollView>(null);
  const renderStarRating = (rating: number) => {
    return (
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={12} color="#FFB800" />
        <Text style={[styles.ratingText, { color: colors.text }]}>{rating}</Text>
      </View>
    );
  };

  const handleQuickAddToCart = (item: any, e: any) => {
    e.stopPropagation();

    const cartItem = {
      id: item.id,
      category: 'Home',
      name: item.name,
      price: item.price,
      oldPrice: item.oldPrice || 0,
      quantity: 1,
      color: 'default',
      colorHex: '#1a2632',
      image: item.image,
    };
    addToCart(cartItem);
  };
  const handleCategoryPress = (id: string, index: number) => {
    setActiveCategory(id);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        x: index * 80,
        animated: true,
      });
    }
  };
  const rendersItem1 = (section: string) => ({ item }: { item: Product }) => {
    const isFavorited = isFavorite(item.id);
    return (
      <View style={[styles.card, { backgroundColor: colors.background }]}>
        <View style={styles.cardImageContainer}>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(item.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFavorited ? "heart" : "heart-outline"}
              size={18}
              color={isFavorited ? "#FF4444" : "#1a2632"}
            />
          </TouchableOpacity>
          <Image source={item.image} resizeMode='contain' style={styles.cardImage} />
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={(e) => handleQuickAddToCart(item, e)}
          >
            <Ionicons name="bag-handle-outline" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>{item.description}</Text>
          <View style={styles.cardFooter}>
            <View style={styles.priceContainer}>
              <Text style={[styles.price, { color: colors.text }]}>${item.price}</Text>
              {item.oldPrice && <Text style={styles.oldPrice}>${item.oldPrice}</Text>}
            </View>
            {renderStarRating(item.rating)}
          </View>
        </View>
      </View>
    )
  };
  const renderItem2 = ({ item }: { item: Product }) => (
    <View style={[styles.offerCard, { backgroundColor: colors.background }]}>
      {/* Image */}
      <View style={styles.offerImageBox}>
        <Image source={item.image} style={styles.offerImage} />
      </View>

      {/* Content */}
      <View style={styles.offerContent}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={[styles.offerTitle, { color: colors.text }]}>{item.name}</Text>
          {renderStarRating(item.rating)}
        </View>

        <Text style={[styles.offerDesc, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.description}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={[styles.offerPrice, { color: colors.text }]}>${item.price}</Text>
          {item.discount && (
            <Text style={styles.trendingPriceOld}>{item.discount}</Text>
          )}
        </View>
      </View>

      {/* Add to cart */}
      <TouchableOpacity
        style={[styles.offerAddButton, { backgroundColor: colors.primary }]}
        onPress={(e) => handleQuickAddToCart(item, e)}
      >
        <Ionicons name="bag-outline" size={18} color="#FFF" />
      </TouchableOpacity>
    </View>
  );


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.surface }]}>
          <Ionicons name="menu" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500' }}
            style={styles.avatar}
          />
          <View>
            <Text style={[styles.helloText, { color: colors.textSecondary }]}>{t.hello}</Text>
            <Text style={[styles.userName, { color: colors.text }]}>{userName}</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.surface }]}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchSection}>
        <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
          <Ionicons name="search-outline" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder={t.searchHere}
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
          <MaterialCommunityIcons name="view-grid-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Promo Banner 1 */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerYellowBackground} />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>{t.bestSelling}</Text>
            <Text style={styles.bannerSubtitle}>{t.comfortsModern}</Text>
            <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>{t.viewMore}</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Image source={BEST_SELLING_IMAGE} style={styles.bannerImage} />
          <View style={styles.promoTag}>
            <Text style={styles.promoText}>{t.megaSale}</Text>
          </View>
        </View>

        {/* Categories */}
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((cat, index) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryChip, activeCategory === cat.id && styles.activeCategoryChip]}
              onPress={() => handleCategoryPress(cat.id, index)}
            >
              {activeCategory === cat.id && (
                <MaterialCommunityIcons
                  name={cat.icon}
                  size={20}
                  color={activeCategory === cat.id ? "#FFF" : "#8B9DB8"}
                  style={{ marginRight: 8 }}
                />
              )}
              <Text style={[styles.categoryText, activeCategory === cat.id && styles.activeCategoryText]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* New Arrivals */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.newArrivals}</Text>
          <TouchableOpacity><Text style={[styles.viewAllText, { color: colors.textSecondary }]}>{t.viewAll}</Text></TouchableOpacity>
        </View>
        <FlatList
          data={NEW_ARRIVALS}
          renderItem={rendersItem1('new_arrivals')}
          keyExtractor={item => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />

        {/* Trending Furniture */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.trending}</Text>
          <TouchableOpacity><Text style={[styles.viewAllText, { color: colors.textSecondary }]}>{t.viewAll}</Text></TouchableOpacity>
        </View>
        <FlatList
          data={TRENDING}
          renderItem={renderItem2}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />

        {/* Second Banner */}
        <View style={styles.secondBanner}>
          <Image source={SECOND_BANNER_IMAGE} style={styles.secondBannerImage} resizeMode="cover" />
          <View style={styles.secondBannerOverlay}>
            <Text style={styles.secondBannerTitle}>{t.bestSelling}</Text>
            <Text style={styles.secondBannerSubtitle}>{t.comfortsModern}</Text>
            <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>{t.viewMore}</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Offer Zone */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.offerZone}</Text>
          <TouchableOpacity><Text style={[styles.viewAllText, { color: colors.textSecondary }]}>{t.viewAll}</Text></TouchableOpacity>
        </View>
        <FlatList
          data={OFFER_ZONE}
          renderItem={renderItem2}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
        {/* Furniture And Decor */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.furnitureDecor}</Text>
          <TouchableOpacity><Text style={[styles.viewAllText, { color: colors.textSecondary }]}>{t.viewAll}</Text></TouchableOpacity>
        </View>
        <FlatList
          data={FURNITURE_DECOR}
          renderItem={rendersItem1('furniture_decor')}
          keyExtractor={item => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
        {/* Wingback Chair */}
        {/* Wingback Chair Promo Section */}
        <View style={styles.promoRow}>
          {/* Card 1 */}
          <View style={[styles.promoCard, { backgroundColor: '#8CB9D0' }]}>
            <Image source={WINGBACK_CHAIR_1} style={styles.promoImage} resizeMode="cover" />
            <View style={styles.promoContent}>
              <Text style={styles.promoTitle}>Wingback{"\n"}Chair</Text>
              <TouchableOpacity style={styles.promoButton}>
                <Text style={styles.promoButtonText}>{t.viewMore}</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Card 2 */}
          <View style={[styles.promoCard, { backgroundColor: '#055C70' }]}>
            <Image source={WINGBACK_CHAIR_2} style={styles.promoImage} resizeMode="cover" />
            <View style={styles.promoContent}>
              <Text style={styles.promoTitle}>Wingback{"\n"}Chair</Text>
              <TouchableOpacity style={styles.promoButton}>
                <Text style={styles.promoButtonText}>{t.viewMore}</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ height: 80 }} />
      </ScrollView>

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
    paddingBottom: 10,
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  helloText: {
    fontSize: 12,
    color: '#8B9DB8',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a2632',
  },
  scrollView: {
    flex: 1,
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 10,
    gap: 10,
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
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8ECF0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContainer: {
    margin: 20,
    height: 180,
    borderRadius: 20,
    backgroundColor: '#1a2632',
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  bannerContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    zIndex: 2,
  },
  bannerYellowBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '35%',
    backgroundColor: '#FFB800',
    borderTopLeftRadius: 60,
    borderBottomLeftRadius: 15,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  bannerSubtitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
  },
  bannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginRight: 5,
    fontWeight: '600',
  },
  bannerImage: {
    position: 'absolute',
    right: -20,
    bottom: 0,
    width: '55%',
    height: '100%',
    resizeMode: 'contain',
  },
  promoTag: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#FF4444',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    transform: [{ rotate: '15deg' }],
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  promoText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 15,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#F5F7FA',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#E8ECF0",
  },
  activeCategoryChip: {
    backgroundColor: '#1a2632',
  },
  categoryText: {
    fontSize: 14,
    color: '#8B9DB8',
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a2632',
  },
  viewAllText: {
    fontSize: 12,
    color: '#8B9DB8',
  },
  horizontalList: {
    paddingHorizontal: 20,
    gap: 15,
    paddingBottom: 20,
  },
  card: {
    width: (width - 50) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 20,
  },
  cardImageContainer: {
    width: '100%',
    height: 140,
    backgroundColor: '#F7F8FA',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
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
  },
  cardContent: {
    paddingHorizontal: 5,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a2632',
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 12,
    color: '#8B9DB8',
    marginBottom: 5,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: 12,
    color: '#8B9DB8',
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#1a2632',
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1a2632',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  offerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 15,
  },

  offerImageBox: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  offerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  offerContent: {
    flex: 1,
    marginLeft: 15,
  },

  offerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a2632',
  },

  offerDesc: {
    fontSize: 12,
    color: '#8B9DB8',
    marginVertical: 2,
  },

  offerRating: {
    flexDirection: 'row',
    marginVertical: 4,
  },

  offerPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a2632',
  },

  offerAddButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1a2632',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendingPriceOld: {
    fontSize: 12,
    color: '#FF4444',
    fontWeight: '500',
  },
  secondBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#7A91B5', // Fallback color
  },
  secondBannerImage: {
    width: '100%',
    height: '100%',
  },
  secondBannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)', // Slight dark overlay if text needs pop
  },
  secondBannerTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  secondBannerSubtitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
  },
  promoRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 20,
  },
  promoCard: {
    flex: 1,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  promoContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between', // 👈 KEY
  },
  promoImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  promoTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    zIndex: 1,
    lineHeight: 30,
  },
  promoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    zIndex: 1,
  },
  promoButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
});
