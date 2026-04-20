import { useTheme } from '@/contexts/ThemeContext';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PaymentOption {
  id: string;
  name: string;
  subText?: string;
  icon: any;
  type: 'card' | 'wallet';
}

const PaymentScreen = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const [selectedId, setSelectedId] = useState('1');

  const cards: PaymentOption[] = [
    { id: '1', name: 'Mastercard *** *** 4589', subText: 'Expires on 16/24', icon: 'cc-mastercard', type: 'card' },
    { id: '2', name: 'visa *** *** 4589', subText: 'Expires on 16/24', icon: 'cc-visa', type: 'card' },
  ];

  const wallets: PaymentOption[] = [
    { id: '3', name: 'Pay Pal', icon: 'paypal', type: 'wallet' },
    { id: '4', name: 'Apple Pay', icon: 'apple', type: 'wallet' },
    { id: '5', name: 'Google Pay', icon: 'google', type: 'wallet' },
    { id: '6', name: 'Cash on Delivery', icon: 'cash-marker', type: 'wallet' },
  ];

  const renderRadio = (id: string) => (
    <View style={[styles.radioOuter, selectedId === id && { borderColor: '#1A2533' }]}>
      {selectedId === id && <View style={styles.radioInner} />}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Payment Method</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Section: Your Card */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Card</Text>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[styles.paymentItem, { backgroundColor: '#FFF', borderColor: selectedId === card.id ? '#1A2533' : '#F0F0F0' }]}
            onPress={() => setSelectedId(card.id)}
          >
            <View style={styles.itemLeft}>
               <FontAwesome5 name={card.icon} size={24} color={card.id === '1' ? "#EB001B" : "#1A1F71"} />
               <View style={styles.textContainer}>
                  <Text style={styles.itemName}>{card.name}</Text>
                  <Text style={styles.itemSubText}>{card.subText}</Text>
               </View>
            </View>
            {renderRadio(card.id)}
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.addCardButton}>
          <Text style={styles.addCardText}>+Add New Card</Text>
        </TouchableOpacity>

        {/* Section: Wallet */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>Wallet</Text>
        <View style={styles.walletContainer}>
          {wallets.map((wallet) => (
            <TouchableOpacity
              key={wallet.id}
              style={[styles.paymentItem, { borderBottomWidth: wallet.id === '6' ? 0 : 0.5, borderBottomColor: '#EEE' }]}
              onPress={() => setSelectedId(wallet.id)}
            >
              <View style={styles.itemLeft}>
                {wallet.id === '6' ? (
                   <MaterialCommunityIcons name="cash-marker" size={24} color="#F39C12" />
                ) : (
                   <FontAwesome5 name={wallet.icon} size={20} color="#1A2533" />
                )}
                <Text style={[styles.itemName, { marginLeft: 15 }]}>{wallet.name}</Text>
              </View>
              {renderRadio(wallet.id)}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <View>
          <Text style={styles.totalLabel}>Total price</Text>
          <Text style={[styles.totalPrice, { color: colors.text }]}>$324.00</Text>
        </View>
        <TouchableOpacity 
          style={styles.payButton}
          onPress={() => router.push('/order-tracking')}
        >
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  backButton: { width: 40 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  scrollContent: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 15 },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    backgroundColor: '#FFF',
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  textContainer: { marginLeft: 12 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#1A2533' },
  itemSubText: { fontSize: 12, color: '#8B9DB8', marginTop: 2 },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1A2533',
  },
  addCardButton: { alignSelf: 'flex-end', marginBottom: 10 },
  addCardText: { color: '#1A2533', fontWeight: '600', textDecorationLine: 'underline' },
  walletContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    paddingHorizontal: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  totalLabel: { color: '#8B9DB8', fontSize: 12 },
  totalPrice: { fontSize: 20, fontWeight: '700' },
  payButton: {
    backgroundColor: '#1A2533',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  payButtonText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});

export default PaymentScreen;