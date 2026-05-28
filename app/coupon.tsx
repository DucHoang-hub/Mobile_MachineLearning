import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface CouponItem {
  id: string;
  offText: string;
  title: string;
  description: string;
  code: string;
}

const COUPONS: CouponItem[] = [
  {
    id: '1',
    offText: '60% OFF',
    title: 'Google Pay',
    description: 'Buy 1 phone and get 10% off on second phone.',
    code: '#GOOGLE20',
  },
  {
    id: '2',
    offText: '60% OFF',
    title: 'Google Pay',
    description: 'Buy 1 phone and get 10% off on second phone.',
    code: '#GOOGLE20',
  },
  {
    id: '3',
    offText: '60% OFF',
    title: 'Google Pay',
    description: 'Buy 1 phone and get 10% off on second phone.',
    code: '#GOOGLE20',
  },
  {
    id: '4',
    offText: '60% OFF',
    title: 'Google Pay',
    description: 'Buy 1 phone and get 10% off on second phone.',
    code: '#GOOGLE20',
  },
  {
    id: '5',
    offText: '60% OFF',
    title: 'Google Pay',
    description: 'Buy 1 phone and get 10% off on second phone.',
    code: '#GOOGLE20',
  },
];

export default function CouponScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();

  const handleApply = (code: string) => {
    Alert.alert('Coupon Applied', `Promo code ${code} has been applied successfully!`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Coupons</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Coupon List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {COUPONS.map((coupon, index) => (
          <View
            key={coupon.id + '-' + index}
            style={[
              styles.ticketContainer,
              {
                backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
                borderColor: colors.border,
                shadowColor: isDarkMode ? '#000000' : '#8B9DB8',
              }
            ]}
          >
            {/* Left Box (60% OFF rotated) */}
            <View style={[styles.leftPart, { backgroundColor: isDarkMode ? colors.surfaceSecondary : '#0F1B28' }]}>
              <Text style={styles.leftText}>{coupon.offText}</Text>
            </View>

            {/* Dashed Separator Divider */}
            <View style={[styles.divider, { borderColor: isDarkMode ? colors.border : '#E8EEF5' }]} />

            {/* Circular Ticket Cutouts */}
            <View style={[styles.cutoutTop, { backgroundColor: colors.background, borderColor: colors.border }]} />
            <View style={[styles.cutoutBottom, { backgroundColor: colors.background, borderColor: colors.border }]} />

            {/* Right Box (Details) */}
            <View style={styles.rightPart}>
              <View>
                <Text style={[styles.couponTitle, { color: colors.text }]}>{coupon.title}</Text>
                <Text style={[styles.couponDesc, { color: colors.textSecondary }]}>
                  {coupon.description}
                </Text>
              </View>

              <View style={styles.couponFooter}>
                <Text style={[styles.couponCode, { color: colors.textSecondary }]}>
                  {coupon.code}
                </Text>
                <TouchableOpacity onPress={() => handleApply(coupon.code)}>
                  <Text style={[styles.applyText, { color: colors.text }]}>apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 0.5,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  ticketContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    height: 120,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  leftPart: {
    width: '28%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftText: {
    color: '#FFB800',
    fontSize: 18,
    fontWeight: '800',
    transform: [{ rotate: '-90deg' }],
    width: 90,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: '100%',
    borderStyle: 'dashed',
    borderWidth: 1,
    position: 'absolute',
    left: '28%',
  },
  cutoutTop: {
    position: 'absolute',
    top: -12,
    left: '28%',
    marginLeft: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    zIndex: 2,
  },
  cutoutBottom: {
    position: 'absolute',
    bottom: -12,
    left: '28%',
    marginLeft: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    zIndex: 2,
  },
  rightPart: {
    flex: 1,
    padding: 14,
    paddingLeft: 24,
    justifyContent: 'space-between',
  },
  couponTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  couponDesc: {
    fontSize: 11,
    lineHeight: 14,
  },
  couponFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  couponCode: {
    fontSize: 12,
    fontWeight: '500',
  },
  applyText: {
    fontSize: 14,
    fontWeight: '700',
    paddingLeft: 10,
  },
});
