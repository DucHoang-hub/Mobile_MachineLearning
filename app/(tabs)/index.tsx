import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
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

const NEW_ARRIVALS: Product[] = [
  {
    id: '1',
    name: 'Buddy Chair',
    description: 'Modern saddle arms',
    price: 14,
    oldPrice: 20,
    rating: 4.5,
    image: require('../../assets/images/screen3_img1.png'),
  },
  {
    id: '2',
    name: 'Wingback Chair',
    description: 'Modern saddle arms',
    price: 14,
    oldPrice: 20,
    rating: 4.5,
    image: require('../../assets/images/screen3_img15.png'),
  },
];

const TRENDING: Product[] = [
  {
    id: '1',
    name: 'Wingback Chair',
    description: 'Modern arms chairs',
    price: 25,
    rating: 4.5,
    oldPrice: 35,
    discount: 'Save $10',
    image: require('../../assets/images/screen3_img2.png'),
  },
  {
    id: '2',
    name: 'Mid Century Sofa',
    description: 'Modern arms Sofa',
    price: 998,
    rating: 4.0,
    image: require('../../assets/images/screen3_img13.png'),
  },
  {
    id: '3',
    name: 'Beige Chair',
    description: 'Modern arms chair',
    price: 37,
    rating: 4.5,
    image: require('../../assets/images/screen3_img14.png'),
  },
];

const OFFER_ZONE: Product[] = [
  {
    id: '1',
    name: 'Table Lamp',
    description: 'Bedroom Study Table...',
    price: 37,
    rating: 5,
    image: require('../../assets/images/screen3_img4.png'),
  },
  {
    id: '2',
    name: 'Lounge Chair',
    description: 'Modern arms chair',
    price: 37,
    rating: 4,
    image: require('../../assets/images/screen3_img10.png'),
  },
];
const FURNITURE_DECOR: Product[] = [
  {
    id: '1',
    name: 'Bubble Swing chair',
    description: 'Modern fading chair',
    price: 120,
    rating: 4.8,
    image: require('../../assets/images/screen3_img6.png'),
  },
  {
    id: '2',
    name: 'Lounge Chair',
    description: 'Modern arms chair',
    price: 130,
    rating: 4.5,
    image: require('../../assets/images/screen3_img7.png'), 
  },
  {
    id: '3',
    name: 'Double Bed Sheet',
    description: 'Modern double bed sheet',
    price: 120,
    rating: 4.6,
    image: require('../../assets/images/screen3_img8.png'),
  },
  {
    id: '4',
    name: 'Hanging Light',
    description: 'Metal hanging light',
    price: 120,
    rating: 4.7,
    image: require('../../assets/images/screen3_img9.png'),
  }
];
export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('1');
  const userName = "Hoang Duc";
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const renderStarRating = (rating: number) => {
    return (
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={12} color="#FFB800" />
        <Text style={styles.ratingText}>{rating}</Text>
      </View>
    );
  };


  const rendersItem1 = (section: string) => ({ item }: { item: Product }) => {
    const uniqueId = `${section}-${item.id}`;
    const isFavorite = favorites.includes(uniqueId);
    return (
    <View style={styles.card}>
      <View style={styles.cardImageContainer}>
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
        <Image source={item.image} resizeMode='contain' style={styles.cardImage} />
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="bag-handle-outline" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <View style={styles.cardFooter}>
          <View style={styles.priceContainer}>
             <Text style={styles.price}>${item.price}</Text>
             {item.oldPrice && <Text style={styles.oldPrice}>${item.oldPrice}</Text>}
          </View>
          {renderStarRating(item.rating)}
        </View>
      </View>
    </View>
  )};
  const renderItem2 = ({ item }: { item: Product }) => (
    <View style={styles.offerCard}>
      {/* Image */}
      <View style={styles.offerImageBox}>
        <Image source={item.image} style={styles.offerImage} />
      </View>

      {/* Content */}
      <View style={styles.offerContent}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.offerTitle}>{item.name}</Text>
          {renderStarRating(item.rating)}
        </View>

        <Text style={styles.offerDesc} numberOfLines={1}>
          {item.description}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={styles.offerPrice}>${item.price}</Text>
          {item.discount && (
            <Text style={styles.trendingPriceOld}>{item.discount}</Text>
          )}
        </View>
      </View>

      {/* Add to cart */}
      <TouchableOpacity style={styles.offerAddButton}>
        <Ionicons name="bag-outline" size={18} color="#FFF" />
      </TouchableOpacity>
    </View>
  );


  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="menu" size={24} color="#1a2632" />
        </TouchableOpacity>
        
        <View style={styles.userInfo}>
           <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500' }} 
            style={styles.avatar}
          />
          <View>
            <Text style={styles.helloText}>Hello</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={24} color="#1a2632" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

        {/* Search */}
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
          <TouchableOpacity style={styles.filterButton}>
            <MaterialCommunityIcons name="view-grid-outline" size={24} color="#1a2632" />
          </TouchableOpacity>
        </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>  
        {/* Promo Banner 1 */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerYellowBackground} />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Best Selling</Text>
            <Text style={styles.bannerSubtitle}>Comforts & Modern{"\n"}Life Stylish Sofa</Text>
            <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>View More</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Image source={BEST_SELLING_IMAGE} style={styles.bannerImage} />
          <View style={styles.promoTag}>
            <Text style={styles.promoText}>MEGA SALE{"\n"}50% OFF</Text>
          </View>
        </View>

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity 
              key={cat.id} 
              style={[styles.categoryChip, activeCategory === cat.id && styles.activeCategoryChip]}
              onPress={() => setActiveCategory(cat.id)}
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
            <Text style={styles.sectionTitle}>New Arrivals</Text>
            <TouchableOpacity><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
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
            <Text style={styles.sectionTitle}>Trending Furniture</Text>
            <TouchableOpacity><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
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
              <Text style={styles.secondBannerTitle}>Best Selling</Text>
              <Text style={styles.secondBannerSubtitle}>Comforts & Modern{"\n"}Life Stylish Sofa</Text>
              <TouchableOpacity style={styles.bannerButton}>
                  <Text style={styles.bannerButtonText}>View More</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
              {/* Offer Zone */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Offer Zone</Text>
            <TouchableOpacity><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
          </View>
          <FlatList
              data={OFFER_ZONE}
              renderItem={renderItem2}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
                {/* Furniture And Decor */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Furniture And Decor</Text>
            <TouchableOpacity><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
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
          <View style={{ height: 100 }} />
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
    borderRadius: 0, 
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
  verticalList: {
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 20,
  },
  offerCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
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

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 8,
  },
  trendingPriceOld: {
    fontSize: 12,
    color: '#FF4444',
    fontWeight: '500',
  },
  trendingAction: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    paddingVertical: 5,
  },
  smallAddButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1a2632',
    justifyContent: 'center',
    alignItems: 'center',
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
  // Reusing bannerButton* styles for second banner
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  gridCard: {
    width: (width - 55) / 2, // 20 padding * 2 + 15 gap = 55
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    marginBottom: 20,
  },
  // Reusing card styles for grid where possible
});
