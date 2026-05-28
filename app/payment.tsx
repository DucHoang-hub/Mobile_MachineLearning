import { useTheme } from '@/contexts/ThemeContext';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
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

  const [cards, setCards] = useState<PaymentOption[]>([
    { id: '1', name: 'Mastercard *** *** 4589', subText: 'Expires on 16/24', icon: 'cc-mastercard', type: 'card' },
    { id: '2', name: 'visa *** *** 4589', subText: 'Expires on 16/24', icon: 'cc-visa', type: 'card' },
  ]);

  const wallets: PaymentOption[] = [
    { id: '3', name: 'Pay Pal', icon: 'paypal', type: 'wallet' },
    { id: '4', name: 'Apple Pay', icon: 'apple', type: 'wallet' },
    { id: '5', name: 'Google Pay', icon: 'google', type: 'wallet' },
    { id: '6', name: 'Cash on Delivery', icon: 'cash-marker', type: 'wallet' },
  ];

  // Add Card Modal State
  const [isAddCardModalVisible, setIsAddCardModalVisible] = useState(false);
  const [newCardData, setNewCardData] = useState({
    cardNumber: '',
    holderName: '',
    cvv: '',
    expDate: '',
  });

  const handleAddCard = () => {
    if (!newCardData.cardNumber || !newCardData.holderName || !newCardData.cvv || !newCardData.expDate) {
      Alert.alert('Error', 'Please fill in all card details');
      return;
    }
    const lastFour = newCardData.cardNumber.slice(-4) || '1234';
    const brand = newCardData.cardNumber.startsWith('4') ? 'cc-visa' : 'cc-mastercard';
    const brandName = newCardData.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard';

    const nextCard: PaymentOption = {
      id: String(cards.length + 1),
      name: `${brandName} *** *** ${lastFour}`,
      subText: `Expires on ${newCardData.expDate}`,
      icon: brand,
      type: 'card'
    };
    setCards([...cards, nextCard]);
    setSelectedId(nextCard.id);
    setNewCardData({ cardNumber: '', holderName: '', cvv: '', expDate: '' });
    setIsAddCardModalVisible(false);
  };

  const renderRadio = (id: string) => (
    <View style={[styles.radioOuter, { borderColor: colors.border }, selectedId === id && { borderColor: colors.primary }]}>
      {selectedId === id && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
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
            style={[
              styles.paymentItem,
              {
                backgroundColor: colors.surface,
                borderColor: selectedId === card.id ? colors.primary : colors.border
              }
            ]}
            onPress={() => setSelectedId(card.id)}
          >
            <View style={styles.itemLeft}>
               <FontAwesome5 name={card.icon} size={24} color={card.id === '1' ? "#EB001B" : card.id === '2' ? "#1A1F71" : colors.text} />
               <View style={styles.textContainer}>
                  <Text style={[styles.itemName, { color: colors.text }]}>{card.name}</Text>
                  <Text style={[styles.itemSubText, { color: colors.textSecondary }]}>{card.subText}</Text>
               </View>
            </View>
            {renderRadio(card.id)}
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.addCardButton}
          onPress={() => setIsAddCardModalVisible(true)}
        >
          <Text style={[styles.addCardText, { color: colors.primary }]}>+ Add New Card</Text>
        </TouchableOpacity>

        {/* Section: Wallet */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>Wallet</Text>
        <View style={[styles.walletContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {wallets.map((wallet) => (
            <TouchableOpacity
              key={wallet.id}
              style={[
                styles.paymentItem,
                {
                  backgroundColor: 'transparent',
                  borderWidth: 0,
                  borderRadius: 0,
                  marginBottom: 0,
                  borderBottomWidth: wallet.id === '6' ? 0 : 0.5,
                  borderBottomColor: colors.border
                }
              ]}
              onPress={() => setSelectedId(wallet.id)}
            >
              <View style={styles.itemLeft}>
                {wallet.id === '6' ? (
                   <MaterialCommunityIcons name="cash-marker" size={24} color="#F39C12" />
                ) : (
                   <FontAwesome5 name={wallet.icon} size={20} color={colors.text} />
                )}
                <Text style={[styles.itemName, { color: colors.text, marginLeft: 15 }]}>{wallet.name}</Text>
              </View>
              {renderRadio(wallet.id)}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <View>
          <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total price</Text>
          <Text style={[styles.totalPrice, { color: colors.text }]}>$324.00</Text>
        </View>
        <TouchableOpacity
          style={[styles.payButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/order-tracking')}
        >
          <Text style={[styles.payButtonText, { color: colors.primaryText }]}>Pay Now</Text>
        </TouchableOpacity>
      </View>

      {/* Add Card Modal */}
      <Modal
        visible={isAddCardModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddCardModalVisible(false)}
      >
        <View style={[modalStyles.modalContainer, { backgroundColor: colors.background }]}>
          {/* Modal Header */}
          <View style={[modalStyles.modalHeader, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setIsAddCardModalVisible(false)}>
              <Ionicons name="chevron-back" size={28} color={colors.text} />
            </TouchableOpacity>
            <Text style={[modalStyles.modalTitle, { color: colors.text }]}>Add New Card</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView
            style={[modalStyles.modalContent, { backgroundColor: colors.background }]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={modalStyles.addCardScrollContent}
          >
            {/* Card Number */}
            <View style={modalStyles.fieldContainer}>
              <Text style={[modalStyles.addCardLabel, { color: colors.text }]}>Card Number</Text>
              <View style={[modalStyles.addCardInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <TextInput
                  style={[modalStyles.addCardTextInput, { color: colors.text }]}
                  placeholder="Enter Card Number"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  value={newCardData.cardNumber}
                  onChangeText={(text) => setNewCardData({ ...newCardData, cardNumber: text })}
                />
              </View>
            </View>

            {/* Card Holder Name */}
            <View style={modalStyles.fieldContainer}>
              <Text style={[modalStyles.addCardLabel, { color: colors.text }]}>Card Holder Name</Text>
              <View style={[modalStyles.addCardInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <TextInput
                  style={[modalStyles.addCardTextInput, { color: colors.text }]}
                  placeholder="Enter Card Holder Name"
                  placeholderTextColor={colors.textSecondary}
                  value={newCardData.holderName}
                  onChangeText={(text) => setNewCardData({ ...newCardData, holderName: text })}
                />
              </View>
            </View>

            {/* CVV and Exp. Date Row */}
            <View style={modalStyles.addCardRow}>
              <View style={[modalStyles.fieldContainer, { flex: 1, marginRight: 12 }]}>
                <Text style={[modalStyles.addCardLabel, { color: colors.text }]}>CVV</Text>
                <View style={[modalStyles.addCardInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <TextInput
                    style={[modalStyles.addCardTextInput, { color: colors.text }]}
                    placeholder="CVV"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="number-pad"
                    secureTextEntry
                    maxLength={4}
                    value={newCardData.cvv}
                    onChangeText={(text) => setNewCardData({ ...newCardData, cvv: text })}
                  />
                </View>
              </View>
              <View style={[modalStyles.fieldContainer, { flex: 1.5 }]}>
                <Text style={[modalStyles.addCardLabel, { color: colors.text }]}>Exp. Date</Text>
                <View style={[modalStyles.addCardInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <TextInput
                    style={[modalStyles.addCardTextInput, { color: colors.text }]}
                    placeholder="MM/YY"
                    placeholderTextColor={colors.textSecondary}
                    value={newCardData.expDate}
                    onChangeText={(text) => setNewCardData({ ...newCardData, expDate: text })}
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Add Card Button */}
          <View style={[modalStyles.addCardFooter, { backgroundColor: colors.background }]}>
            <TouchableOpacity
              style={[modalStyles.addCardButton, { backgroundColor: colors.primary }]}
              onPress={handleAddCard}
            >
              <Text style={[modalStyles.addCardButtonText, { color: colors.primaryText }]}>Add Card</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  textContainer: { marginLeft: 12 },
  itemName: { fontSize: 14, fontWeight: '600' },
  itemSubText: { fontSize: 12, marginTop: 2 },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  addCardButton: { alignSelf: 'flex-end', marginBottom: 10 },
  addCardText: { fontWeight: '600', textDecorationLine: 'underline' },
  walletContainer: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 4,
    overflow: 'hidden',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
  },
  totalLabel: { fontSize: 12 },
  totalPrice: { fontSize: 20, fontWeight: '700' },
  payButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  payButtonText: { fontWeight: '700', fontSize: 16 },
});

const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 45,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 0.5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalContent: {
    flex: 1,
  },
  addCardScrollContent: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  addCardLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  addCardInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 15,
    height: 48,
  },
  addCardTextInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  addCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addCardFooter: {
    padding: 20,
  },
  addCardButton: {
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCardButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default PaymentScreen;