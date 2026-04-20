import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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

interface TrackingStep {
  title: string;
  time: string;
  date: string;
  status: 'completed' | 'pending' | 'current';
  icon: any;
}

const OrderTrackingScreen = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();

  const steps: TrackingStep[] = [
    { title: 'Order Information Received', time: '5:30 pm', date: '25 Nov, 2022', status: 'completed', icon: 'check' },
    { title: 'The Parcel is being collected', time: '8:00 am', date: '28 Nov, 2022', status: 'completed', icon: 'check' },
    { title: 'Ready To be Send', time: '9:45 am', date: '29 Nov, 2022', status: 'current', icon: 'package-variant-closed' },
    { title: 'Dispatch in Local Wear House', time: '2:20 pm', date: '30 Nov, 2022', status: 'pending', icon: 'truck-delivery-outline' },
    { title: 'Parcel Delivered', time: '5:30 pm', date: '01 Dec, 2022', status: 'pending', icon: 'store-outline' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Order Tracker</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Order Info Summary */}
        <View style={styles.orderSummary}>
          <View>
            <Text style={styles.dateText}>01 Dec, 2022</Text>
            <Text style={[styles.orderId, { color: colors.text }]}>Order ID : #1245035000</Text>
          </View>
          <Text style={[styles.amountLabel, { color: '#8B9DB8' }]}>
            Amount : <Text style={[styles.amountValue, { color: colors.text }]}>$112</Text>
          </Text>
        </View>

        {/* Order Journey Card */}
        <View style={[styles.card, { backgroundColor: isDarkMode ? colors.surface : '#F8F9FB' }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Order Journey</Text>
          
          {steps.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.timelineContainer}>
                <View style={[
                  styles.iconCircle, 
                  step.status === 'completed' ? styles.completedCircle : styles.pendingCircle,
                  step.status === 'current' && styles.currentCircle
                ]}>
                  {step.status === 'completed' ? (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  ) : (
                    <MaterialCommunityIcons 
                        name={step.icon} 
                        size={18} 
                        color={step.status === 'current' ? colors.text : '#A0AEC0'} 
                    />
                  )}
                </View>
                {index !== steps.length - 1 && (
                  <View style={[styles.line, { backgroundColor: '#E2E8F0', borderStyle: 'dashed' }]} />
                )}
              </View>
              
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: colors.text }]}>{step.title}</Text>
                <Text style={styles.stepTime}>{step.time} | {step.date}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Price Details */}
        <View style={[styles.priceDetails, { backgroundColor: isDarkMode ? colors.surface : '#F8F9FB' }]}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Sub Total</Text>
            <Text style={[styles.priceValue, { color: colors.text }]}>$112</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Shipping charge</Text>
            <Text style={[styles.priceValue, { color: colors.text }]}>$20.00</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Discount (10%)</Text>
            <Text style={[styles.priceValue, { color: colors.text }]}>$0.00</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border || '#E2E8F0' }]} />
          <View style={styles.priceRow}>
            <Text style={[styles.grandTotalLabel, { color: colors.text }]}>Grand Total</Text>
            <Text style={[styles.grandTotalValue, { color: colors.text }]}>$132</Text>
          </View>
        </View>

        {/* Button */}
        <TouchableOpacity 
          style={[styles.continueButton, { backgroundColor: '#1A2533' }]}
          onPress={() => router.replace('/(tabs)/cart')}
        >
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  backButton: { 
    width: 40, 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '700' 
  },
  scrollContent: { 
    padding: 20 
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  dateText: { 
    color: '#A0AEC0', 
    fontSize: 12 
  },
  orderId: { 
    fontSize: 15, 
    fontWeight: '700', 
    marginTop: 4 
  },
  amountLabel: { 
    fontSize: 14 
  },
  amountValue: { 
    fontWeight: '700' 
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    marginBottom: 20 
  },
  stepRow: { 
    flexDirection: 'row', 
    minHeight: 70 
  },
  timelineContainer: { 
    alignItems: 'center', 
    marginRight: 15 
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  completedCircle: { 
    backgroundColor: '#1A2533', 
    borderColor: '#1A2533' 
  },
  currentCircle: { 
    backgroundColor: '#FFF', 
    borderColor: '#1A2533', 
    borderWidth: 2 
  },
  pendingCircle: { 
    backgroundColor: '#FFF' 
  },
  line: { 
    width: 1, 
    flex: 1, 
    marginVertical: 4 
  },
  stepContent: { 
    flex: 1, 
    paddingTop: 4 
  },
  stepTitle: { 
    fontSize: 14, 
    fontWeight: '600' 
  },
  stepTime: { 
    fontSize: 12, 
    color: '#8B9DB8', 
    marginTop: 4 
  },
  priceDetails: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: { 
    color: '#8B9DB8', 
    fontSize: 14 
  },
  priceValue: { 
    fontWeight: '600', 
    fontSize: 14 
  },
  divider: { 
    height: 1, 
    marginVertical: 12 
  },
  grandTotalLabel: { 
    fontSize: 16, 
    fontWeight: '700' 
  },
  grandTotalValue: { 
    fontSize: 16, 
    fontWeight: '700' 
  },
  continueButton: {
    height: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  continueButtonText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: '700'
  },
});

export default OrderTrackingScreen;