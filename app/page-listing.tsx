import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PageItem {
  name: string;
  route: string;
  params?: { [key: string]: string}; // dau ? nghia la khong bat buoc phai co
}

interface PageSection{
  title: string;
  data: PageItem[];
}
const PAGE_SECTIONS: PageSection[] = [
  {
    title: 'Onboarding & Authentication',
    data: [
      { name: 'Create Account', route: '/signup' },
      { name: 'Forgot Password', route: '/forgot-password' },
      { name: 'Login', route: '/login' },
      { name: 'Otp', route: '/otp-verification' },
      { name: 'Reset Password', route: '/reset-password' },
    ],
  },
  {
    title: 'Main Pages',
    data: [
      { name: 'Categories', route: '/categories' },
      { name: 'Home Page', route: '/' },
      { name: 'Product Details Page', route: '/product-detail' },
    ],
  },
  {
    title: 'Cart, Order & Payment Pages',
    data: [
      { name: 'Cart', route: '/cart' },
      { name: 'Coupon', route: '/coupon' },
      { name: 'New Address', route: '/new-address' },
      { name: 'Order Tracking', route: '/order-tracking' },
      { name: 'Payment', route: '/payment' },
      { name: 'Shipping Address', route: '/shipping-address' },
      { name: 'Shipping Page', route: '/shipping' },
    ],
  },
  {
    title: 'Profile, Settings Pages',
    data: [
      { name: 'Help', route: '/help' },
      { name: 'Language', route: '/language' },
      { name: 'Manage-delivery-address', route: '/manage-address' },
      { name: 'Manage Payment', route: '/manage-payment' },
      { name: 'Notification', route: '/notifications' },
      { name: 'Order History', route: '/order-history' },
      { name: 'Other Setting', route: '/other-settings' },
      { name: 'Profile', route: '/profile' },
      { name: 'Profile Setting', route: '/profile-setting' },
      { name: 'Setting', route: '/settings' },
      { name: 'Terms & Conditions Page', route: '/terms' },
      { name: 'Voucher', route: '/voucher' },
      { name: 'Wishlist', route: '/wishlist' },
    ],
  },
];

export default function PageListingScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{headerShown: false}}/>

      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      <View style={[styles.header, { borderBottomColor: colors.border || '#E8ECF0' }]}>
        <TouchableOpacity 
          onPress={() => 
            router.replace('/(tabs)')
          } 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Page-Listing</Text>
        </View>
        
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {PAGE_SECTIONS.map((section, index) => (
          <View key={index} style={styles.sectionContainer}>
            {/* Category Header */}
            <View style={[styles.sectionHeader, { backgroundColor: isDarkMode ? colors.surface : '#F9FAFB' }]}>
              <Text style={[styles.sectionHeaderText, { color: colors.text }]}>
                {section.title}
              </Text>
            </View>

            {/* List Items */}
            {section.data.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[styles.itemRow, { borderBottomColor: colors.border || '#F0F0F0' }]}
                onPress={() => {
                      router.push({
                        pathname: item.route as any,
                        params: item.params
                      });
                  }
                }
              >
                <Text style={[styles.itemText, { color: '#8B9DB8' }]}>
                  {item.name}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#8B9DB8" />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionContainer: {
    marginTop: 0,
  },
  sectionHeader: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '700',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
  },
  itemText: {
    fontSize: 15,
    fontWeight: '400',
  },
});