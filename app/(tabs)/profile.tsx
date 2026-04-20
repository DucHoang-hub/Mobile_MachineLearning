import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, Modal, Platform, ScrollView, StatusBar, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface OrderItem {
    id: string;
    name: string;
    image: any;
    qty: number;
    status: 'Ongoing' | 'Delivered';
    orderDate: string;
    dispatchStatus: string;
}

interface HelpItem {
    id: string;
    question: string;
    answer: string;
}

interface MenuItem {
    id: string;
    icon: string;
    title: string;
    description: string;
    route?: string;
}


const HELP_ITEMS: HelpItem[] = [
    {
        id: '1',
        question: 'I want to track my order',
        answer: 'To track your order, you will need to have the tracking number or order ID provided by the seller or shipping carrier. Once you have this information, you can usually track your order online by visiting the carrier\'s website and entering the tracking number or order ID in the designated tracking field.',
    },
    {
        id: '2',
        question: 'I want to manage my order',
        answer: '1. Check your order confirmation email or account. This should contain information about your order, including the expected delivery date, tracking number (if applicable), and contact information for the seller.\n\n2. Contact the seller: If you have any questions about your order or need to make changes, the best way to do so is to contact the seller directly. You can typically find their contact information on their website or in your order confirmation email.\n\n3. Check the order status: Many online retailers provide a way for you to check the status of your order. Depending on the retailer, you may be able to track your order\'s location, check when it was shipped, when it\'s expected to arrive, and any tracking information.\n\n4. Make changes to your order: Depending on the seller\'s policies, you may be able to make changes to your order such as adding or removing items, changing the shipping address, or canceling the order altogether. Contact the seller to see if this is possible.',
    },
    {
        id: '3',
        question: 'I did not receive Instant Cashback',
        answer: 'I\'m sorry to hear that you did not receive an instant cashback. To help you with this issue, I need more information.\n\n1. What type of purchase did you make?\n\n2. From which website or store did you make the purchase?\n\n3. Did you receive any confirmation or receipt for your purchase?\n\n4. Did you check the terms and conditions of the cashback offer before making the purchase?\n\n5. Have you contacted the website or store\'s customer support regarding the issue?',
    },
    {
        id: '4',
        question: 'I am unable to pay using wallet',
        answer: 'I\'m sorry to hear that you did not receive an instant cashback. To help you with this issue, I need more information.\n\n1. What type of purchase did you make?\n\n2. From which website or store did you make the purchase?\n\n3. Did you receive any confirmation or receipt for your purchase?\n\n4. Did you check the terms and conditions of the cashback offer before making the purchase?\n\n5. What type of purchase did you make? Have you contacted the website or store\'s customer support regarding the issue?',
    },
    {
        id: '5',
        question: 'I want help with returns & refunds',
        answer: 'I\'m sorry to hear that you did not receive an instant cashback. To help you with this issue, I need more information.\n\n1. What type of purchase did you make?\n\n2. From which website or store did you make the purchase?\n\n3. Did you receive any confirmation or receipt for your purchase?\n\n4. Did you check the terms and conditions of the cashback offer before making the purchase?\n\n5. What type of purchase did you make? Have you contacted the website or store\'s customer support regarding the issue?',
    },
];

export default function ProfileScreen() {
    const router = useRouter();
    const { isDarkMode, setDarkMode, colors } = useTheme();
    const { language, setLanguage: setSelectedLanguage, t } = useLanguage();
    const selectedLanguage = language;

    const { openModal } = useLocalSearchParams();

    useEffect(() => {
        if(openModal === 'orders'){
            setIsOrdersModalVisible(true);
        } else if (openModal === 'payment'){
            setIsPaymentModalVisible(true);
        } else if (openModal === 'help'){
            setIsHelpModalVisible(true);
        } else if (openModal === 'language'){
            setIsLanguageModalVisible(true);
        } else if (openModal === 'address'){
            setIsAddressModalVisible(true);
        }else if (openModal === 'settings'){
            setIsSettingsModalVisible(true);
        } 
    }, [openModal]);

    const MENU_ITEMS: MenuItem[] = [
        { id: '1', icon: 'cube-outline', title: t.orders, description: t.ordersDesc },
        { id: '2', icon: 'heart-outline', title: t.wishlist, description: t.wishlistDesc },
        { id: '3', icon: 'card-outline', title: t.payment, description: t.paymentDesc },
        { id: '4', icon: 'location-outline', title: t.savedAddress, description: t.savedAddressDesc },
        { id: '5', icon: 'globe-outline', title: t.language, description: t.languageDesc },
        { id: '6', icon: 'notifications-outline', title: t.notification, description: t.notificationDesc },
        { id: '7', icon: 'settings-outline', title: t.settings, description: t.settingsDesc },
        { id: '8', icon: 'information-circle-outline', title: t.termsConditions, description: t.termsDesc },
        { id: '9', icon: 'call-outline', title: t.help, description: t.helpDesc },
    ];
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isHelpModalVisible, setIsHelpModalVisible] = useState(false);
    const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
    const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
    const [isOrdersModalVisible, setIsOrdersModalVisible] = useState(false);
    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
    const [isAddCardModalVisible, setIsAddCardModalVisible] = useState(false);
    const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
    const [isEditAddressVisible, setIsEditAddressVisible] = useState(false);
    const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState('home');
    const [addressData, setAddressData] = useState([
        {
            id: 'home',
            label: 'Home',
            address: '3501 Maloy Court, East Emhurst, New York City, NY 11369',
            phone: '78596 0000',
        },
        {
            id: 'office',
            label: 'Office',
            address: '8502-8503 Preston Rd. Inglewood Street, Maine 98380',
            phone: '12100 0023',
        },
    ]);
    const [editingAddress, setEditingAddress] = useState({ id: '', label: '', address: '', phone: '' });
    const [selectedPaymentCard, setSelectedPaymentCard] = useState('1');
    const [orderSearchQuery, setOrderSearchQuery] = useState('');
    const [expandedHelpId, setExpandedHelpId] = useState<string | null>(null);
    const [newCardData, setNewCardData] = useState({
        cardNumber: '',
        holderName: '',
        cvv: '',
        expDate: '',
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [settings, setSettings] = useState({
        rtl: false,
        notification: false,
    });
    const [profileData, setProfileData] = useState({
        name: 'Marlin Watkin',
        email: 'marlinw25@gmail.com',
        phone: '+4498456215',
        avatar: null as string | null,
    });
    const [editData, setEditData] = useState({ ...profileData });

    const ORDER_ITEMS: OrderItem[] = [
        {
            id: '1',
            name: 'Wingback Chair',
            image: require('../../assets/images/screen3_img15.png'),
            qty: 1,
            status: 'Ongoing',
            orderDate: "26 Jan'23",
            dispatchStatus: 'Dispatched',
        },
        {
            id: '2',
            name: 'Table Lamp',
            image: require('../../assets/images/screen3_img5.png'),
            qty: 1,
            status: 'Ongoing',
            orderDate: "26 Jan'23",
            dispatchStatus: 'Dispatched',
        },
        {
            id: '3',
            name: 'Side Table',
            image: require('../../assets/images/screen3_img7.png'),
            qty: 1,
            status: 'Delivered',
            orderDate: "26 Jan'23",
            dispatchStatus: 'Dispatched',
        },
        {
            id: '4',
            name: 'Modern Sofa',
            image: require('../../assets/images/screen3_img3.png'),
            qty: 2,
            status: 'Delivered',
            orderDate: "20 Jan'23",
            dispatchStatus: 'Delivered',
        },
    ];

    const filteredOrders = ORDER_ITEMS.filter(order =>
        order.name.toLowerCase().includes(orderSearchQuery.toLowerCase())
    );

    const handleMenuPress = (item: MenuItem) => {
        // Handle menu item press
        if (item.id === '1') {
            setIsOrdersModalVisible(true);
        } else if (item.id === '2') {
            router.push('/(tabs)/favorites');
        } else if (item.id === '3') {
            setIsPaymentModalVisible(true);
        } else if (item.id === '4') {
            setIsAddressModalVisible(true);
        } else if (item.id === '5') {
            setIsLanguageModalVisible(true);
        } else if (item.id === '9') {
            setIsHelpModalVisible(true);
        } else if (item.id === '8') {
            setIsTermsModalVisible(true);
        } else if (item.id === '7') {
            setIsSettingsModalVisible(true);
        }
        console.log('Pressed:', item.title);
    };

    const handleEditPress = () => {
        setEditData({ ...profileData });
        setIsEditModalVisible(true);
    };

    const handleSaveProfile = () => {
        setProfileData({ ...editData });
        setIsEditModalVisible(false);
    };

    const handleCancel = () => {
        setIsEditModalVisible(false);
    };

    const handleAddCard = () => {
        // Save card logic here
        setNewCardData({ cardNumber: '', holderName: '', cvv: '', expDate: '' });
        setIsAddCardModalVisible(false);
    };

    const renderPaymentModal = () => (
        <Modal
            visible={isPaymentModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setIsPaymentModalVisible(false)}
        >
            <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                {/* Modal Header */}
                <View style={[styles.modalHeader, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                    <TouchableOpacity onPress={() => setIsPaymentModalVisible(false)}>
                        <Ionicons name="chevron-back" size={28} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>{t.paymentOptions}</Text>
                    <View style={{ width: 28 }} />
                </View>

                <ScrollView
                    style={styles.modalContent}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.paymentScrollContent}
                >
                    {/* Your Card Section */}
                    <Text style={[styles.paymentSectionTitle, { color: colors.text }]}>{t.yourCard}</Text>

                    {/* Mastercard */}
                    <TouchableOpacity
                        style={[styles.paymentCardItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        onPress={() => setSelectedPaymentCard('1')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.paymentCardLeft}>
                            <View style={styles.paymentCardLogoContainer}>
                                <View style={styles.mastercardLogo}>
                                    <View style={[styles.mcCircle, styles.mcRed]} />
                                    <View style={[styles.mcCircle, styles.mcOrange]} />
                                </View>
                            </View>
                            <View>
                                <Text style={[styles.paymentCardNumber, { color: colors.text }]}>Mastercard *** *** 4589</Text>
                                <Text style={[styles.paymentCardExpiry, { color: colors.textSecondary }]}>Expires on 16/24</Text>
                            </View>
                        </View>
                        <View style={[styles.radioOuter, selectedPaymentCard === '1' && styles.radioOuterSelected]}>
                            {selectedPaymentCard === '1' && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>

                    {/* Visa */}
                    <TouchableOpacity
                        style={[styles.paymentCardItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        onPress={() => setSelectedPaymentCard('2')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.paymentCardLeft}>
                            <View style={styles.paymentCardLogoContainer}>
                                <Text style={styles.visaLogo}>VISA</Text>
                            </View>
                            <View>
                                <Text style={[styles.paymentCardNumber, { color: colors.text }]}>visa *** *** 4589</Text>
                                <Text style={[styles.paymentCardExpiry, { color: colors.textSecondary }]}>Expires on 16/24</Text>
                            </View>
                        </View>
                        <View style={[styles.radioOuter, selectedPaymentCard === '2' && styles.radioOuterSelected]}>
                            {selectedPaymentCard === '2' && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>

                    {/* Add New Card */}
                    <TouchableOpacity
                        style={styles.addNewCardLink}
                        onPress={() => {
                            setIsPaymentModalVisible(false);
                            setTimeout(() => setIsAddCardModalVisible(true), 1);
                        }}
                    >
                        <Text style={styles.addNewCardText}>+Add New Card</Text>
                    </TouchableOpacity>

                    {/* Wallet Section */}
                    <Text style={[styles.paymentSectionTitle, { color: colors.text, marginTop: 24 }]}>Wallet</Text>

                    <View style={[styles.walletContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        {/* PayPal */}
                        <TouchableOpacity
                            style={[styles.walletItem, { borderBottomColor: colors.border }]}
                            onPress={() => setSelectedPaymentCard('paypal')}
                            activeOpacity={0.7}
                        >
                            <View style={styles.walletItemLeft}>
                                <View style={styles.walletIconContainer}>
                                    <Text style={styles.paypalIcon}>P</Text>
                                </View>
                                <Text style={[styles.walletItemText, { color: colors.text }]}>Pay Pal</Text>
                            </View>
                            <View style={[styles.radioOuter, selectedPaymentCard === 'paypal' && styles.radioOuterSelected]}>
                                {selectedPaymentCard === 'paypal' && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>

                        {/* Apple Pay */}
                        <TouchableOpacity
                            style={[styles.walletItem, { borderBottomColor: colors.border }]}
                            onPress={() => setSelectedPaymentCard('applepay')}
                            activeOpacity={0.7}
                        >
                            <View style={styles.walletItemLeft}>
                                <View style={styles.walletIconContainer}>
                                    <Text style={styles.applePayIcon}>{"\uF8FF"}Pay</Text>
                                </View>
                                <Text style={[styles.walletItemText, { color: colors.text }]}>Apple Pay</Text>
                            </View>
                            <View style={[styles.radioOuter, selectedPaymentCard === 'applepay' && styles.radioOuterSelected]}>
                                {selectedPaymentCard === 'applepay' && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>

                        {/* Google Pay */}
                        <TouchableOpacity
                            style={[styles.walletItem, { borderBottomColor: colors.border }]}
                            onPress={() => setSelectedPaymentCard('googlepay')}
                            activeOpacity={0.7}
                        >
                            <View style={styles.walletItemLeft}>
                                <View style={styles.walletIconContainer}>
                                    <Ionicons name="logo-google" size={24} color="#4285F4" />
                                </View>
                                <Text style={[styles.walletItemText, { color: colors.text }]}>Google Pay</Text>
                            </View>
                            <View style={[styles.radioOuter, selectedPaymentCard === 'googlepay' && styles.radioOuterSelected]}>
                                {selectedPaymentCard === 'googlepay' && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>

                        {/* Cash on Delivery */}
                        <TouchableOpacity
                            style={[styles.walletItem, { borderBottomWidth: 0 }]}
                            onPress={() => setSelectedPaymentCard('cod')}
                            activeOpacity={0.7}
                        >
                            <View style={styles.walletItemLeft}>
                                <View style={styles.walletIconContainer}>
                                    <Ionicons name="cash-outline" size={24} color="#4CAF50" />
                                </View>
                                <Text style={[styles.walletItemText, { color: colors.text }]}>Cash on Delivery</Text>
                            </View>
                            <View style={[styles.radioOuter, selectedPaymentCard === 'cod' && styles.radioOuterSelected]}>
                                {selectedPaymentCard === 'cod' && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );

    const renderAddCardModal = () => (
        <Modal
            visible={isAddCardModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setIsAddCardModalVisible(false)}
        >
            <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                {/* Modal Header */}
                <View style={[styles.modalHeader, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                    <TouchableOpacity onPress={() => setIsAddCardModalVisible(false)}>
                        <Ionicons name="chevron-back" size={28} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>{t.addNewCard}</Text>
                    <View style={{ width: 28 }} />
                </View>

                <ScrollView
                    style={[styles.modalContent, { backgroundColor: colors.background }]}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.addCardScrollContent}
                >
                    {/* Card Number */}
                    <View style={styles.fieldContainer}>
                        <Text style={[styles.addCardLabel, { color: colors.text }]}>{t.cardNumber}</Text>
                        <View style={[styles.addCardInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <TextInput
                                style={[styles.addCardTextInput, { color: colors.text }]}
                                placeholder={t.enterCardNumber}
                                placeholderTextColor={colors.textSecondary}
                                keyboardType="number-pad"
                                value={newCardData.cardNumber}
                                onChangeText={(text) => setNewCardData({ ...newCardData, cardNumber: text })}
                            />
                        </View>
                    </View>

                    {/* Card Holder Name */}
                    <View style={styles.fieldContainer}>
                        <Text style={[styles.addCardLabel, { color: colors.text }]}>{t.cardHolderName}</Text>
                        <View style={[styles.addCardInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <TextInput
                                style={[styles.addCardTextInput, { color: colors.text }]}
                                placeholder={t.enterHolderName}
                                placeholderTextColor={colors.textSecondary}
                                value={newCardData.holderName}
                                onChangeText={(text) => setNewCardData({ ...newCardData, holderName: text })}
                            />
                        </View>
                    </View>

                    {/* CVV and Exp. Date Row */}
                    <View style={styles.addCardRow}>
                        <View style={[styles.fieldContainer, { flex: 1, marginRight: 12 }]}>
                            <Text style={[styles.addCardLabel, { color: colors.text }]}>{t.cvv}</Text>
                            <View style={[styles.addCardInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <TextInput
                                    style={[styles.addCardTextInput, { color: colors.text }]}
                                    placeholder={t.enterCvv}
                                    placeholderTextColor={colors.textSecondary}
                                    keyboardType="number-pad"
                                    secureTextEntry
                                    maxLength={4}
                                    value={newCardData.cvv}
                                    onChangeText={(text) => setNewCardData({ ...newCardData, cvv: text })}
                                />
                            </View>
                        </View>
                        <View style={[styles.fieldContainer, { flex: 1.5 }]}>
                            <Text style={[styles.addCardLabel, { color: colors.text }]}>{t.expDate}</Text>
                            <TouchableOpacity
                                style={[styles.addCardInput, { backgroundColor: colors.surface, borderColor: colors.border }]}
                                onPress={() => setShowDatePicker(true)}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.addCardTextInput, { color: newCardData.expDate ? colors.text : colors.textSecondary, flex: 1, paddingVertical: 14 }]}>
                                    {newCardData.expDate || 'mm/dd/yyyy'}
                                </Text>
                                <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={selectedDate}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                                    onChange={(event: any, date?: Date) => {
                                        setShowDatePicker(Platform.OS === 'ios');
                                        if (date) {
                                            setSelectedDate(date);
                                            const month = String(date.getMonth() + 1).padStart(2, '0');
                                            const day = String(date.getDate()).padStart(2, '0');
                                            const year = date.getFullYear();
                                            setNewCardData({ ...newCardData, expDate: `${month}/${day}/${year}` });
                                        }
                                    }}
                                />
                            )}
                        </View>
                    </View>
                </ScrollView>

                {/* Add Card Button */}
                <View style={[styles.addCardFooter, { backgroundColor: colors.background }]}>
                    <TouchableOpacity
                        style={[styles.addCardButton, { backgroundColor: colors.primary }]}
                        onPress={handleAddCard}
                    >
                        <Text style={[styles.addCardButtonText, { color: colors.primaryText }]}>{t.addCard}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    const renderAddressModal = () => (
        <Modal
            visible={isAddressModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setIsAddressModalVisible(false)}
        >
            <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                {/* Modal Header */}
                <View style={[styles.modalHeader, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                    <TouchableOpacity 
                        onPress={() => 
                            setIsAddressModalVisible(false)
                        }
                    >
                        <Ionicons name="chevron-back" size={28} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>{t.savedAddress}</Text>
                    <View style={{ width: 28 }} />
                </View>

                <ScrollView
                    style={styles.modalContent}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.addressScrollContent}
                >
                    {addressData.map((addr) => (
                        <TouchableOpacity
                            key={addr.id}
                            style={[styles.addressCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            onPress={() => setSelectedAddress(addr.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.addressHeader}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                                    <View style={[styles.radioOuter, selectedAddress === addr.id && styles.radioOuterSelected]}>
                                        {selectedAddress === addr.id && <View style={styles.radioInner} />}
                                    </View>
                                    <Text style={[styles.addressLabel, { color: colors.text }]}>{addr.label}</Text>
                                </View>
                                <TouchableOpacity
                                    style={[styles.addressEditBtn, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
                                    onPress={() => {
                                        setEditingAddress({ ...addr });
                                        setIsAddressModalVisible(false);
                                        setTimeout(() => setIsEditAddressVisible(true), 1);
                                    }}
                                >
                                    <Ionicons name="pencil" size={16} color={colors.text} />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.addressText, { color: colors.text }]}>
                                {addr.address}
                            </Text>
                            <Text style={[styles.addressPhone, { color: colors.textSecondary }]}>
                                Phone no. : <Text style={{ color: colors.text }}>{addr.phone}</Text>
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Apply Button */}
                <View style={[styles.addressFooter, { backgroundColor: colors.background }]}>
                    <TouchableOpacity
                        style={[styles.addressApplyButton, { backgroundColor: colors.primary }]}
                        onPress={() => {
                            setIsAddressModalVisible(false);

                            setTimeout(() => {
                                router.push('/payment')
                            }, 300);
                        }
                    }
                >
                        <Text style={[styles.addressApplyText, { color: colors.primaryText }]}>Apply</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    const renderEditAddressModal = () => (
        <Modal
            visible={isEditAddressVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setIsEditAddressVisible(false)}
        >
            <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                {/* Modal Header */}
                <View style={[styles.modalHeader, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                    <TouchableOpacity onPress={() => setIsEditAddressVisible(false)}>
                        <Ionicons name="chevron-back" size={28} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>{t.editAddress}</Text>
                    <View style={{ width: 28 }} />
                </View>

                <ScrollView
                    style={[styles.modalContent, { backgroundColor: colors.background }]}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.editAddrScrollContent}
                >
                    {/* Label */}
                    <View style={styles.fieldContainer}>
                        <Text style={[styles.addCardLabel, { color: colors.text }]}>{t.label}</Text>
                        <View style={[styles.addCardInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <TextInput
                                style={[styles.addCardTextInput, { color: colors.text }]}
                                placeholder="e.g. Home, Office"
                                placeholderTextColor={colors.textSecondary}
                                value={editingAddress.label}
                                onChangeText={(text) => setEditingAddress({ ...editingAddress, label: text })}
                            />
                        </View>
                    </View>

                    {/* Address */}
                    <View style={styles.fieldContainer}>
                        <Text style={[styles.addCardLabel, { color: colors.text }]}>{t.address}</Text>
                        <View style={[styles.addCardInput, { backgroundColor: colors.surface, borderColor: colors.border, height: 100, alignItems: 'flex-start', paddingVertical: 12 }]}>
                            <TextInput
                                style={[styles.addCardTextInput, { color: colors.text, textAlignVertical: 'top' }]}
                                placeholder={t.enterAddress}
                                placeholderTextColor={colors.textSecondary}
                                multiline
                                numberOfLines={3}
                                value={editingAddress.address}
                                onChangeText={(text) => setEditingAddress({ ...editingAddress, address: text })}
                            />
                        </View>
                    </View>

                    {/* Phone */}
                    <View style={styles.fieldContainer}>
                        <Text style={[styles.addCardLabel, { color: colors.text }]}>{t.phoneNumber}</Text>
                        <View style={[styles.addCardInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <TextInput
                                style={[styles.addCardTextInput, { color: colors.text }]}
                                placeholder={t.enterPhone}
                                placeholderTextColor={colors.textSecondary}
                                keyboardType="phone-pad"
                                value={editingAddress.phone}
                                onChangeText={(text) => setEditingAddress({ ...editingAddress, phone: text })}
                            />
                        </View>
                    </View>
                </ScrollView>

                {/* Save Button */}
                <View style={[styles.addressFooter, { backgroundColor: colors.background }]}>
                    <TouchableOpacity
                        style={[styles.addressApplyButton, { backgroundColor: colors.primary }]}
                        onPress={() => {
                            setAddressData(prev => prev.map(a => a.id === editingAddress.id ? { ...editingAddress } : a));
                            setIsEditAddressVisible(false);
                        }}
                    >
                        <Text style={[styles.addressApplyText, { color: colors.primaryText }]}>{t.save}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    const LANGUAGES = ['English', 'Spanish', 'France', 'Portuguese', 'Russian', 'Chinese', 'Tiếng Việt'];

    const renderLanguageModal = () => (
        <Modal
            visible={isLanguageModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setIsLanguageModalVisible(false)}
        >
            <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                {/* Modal Header */}
                <View style={[styles.modalHeader, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                    <TouchableOpacity onPress={() => setIsLanguageModalVisible(false)}>
                        <Ionicons name="chevron-back" size={28} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>{t.languages}</Text>
                    <View style={{ width: 28 }} />
                </View>

                <ScrollView
                    style={styles.modalContent}
                    showsVerticalScrollIndicator={false}
                >
                    {LANGUAGES.map((lang) => (
                        <TouchableOpacity
                            key={lang}
                            style={[styles.langItem, { borderBottomColor: colors.border }]}
                            onPress={() => setSelectedLanguage(lang)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.langText, { color: colors.text }]}>{lang}</Text>
                            <View style={[styles.radioOuter, selectedLanguage === lang && styles.radioOuterSelected]}>
                                {selectedLanguage === lang && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </Modal>
    );

    const renderOrdersModal = () => (
        <Modal
            visible={isOrdersModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setIsOrdersModalVisible(false)}
        >
            <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                {/* Modal Header */}
                <View style={[styles.modalHeader, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                    <TouchableOpacity onPress={() => setIsOrdersModalVisible(false)}>
                        <Ionicons name="chevron-back" size={28} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>{t.orderHistory}</Text>
                    <View style={{ width: 28 }} />
                </View>

                {/* Search Bar */}
                <View style={[styles.orderSearchContainer, { backgroundColor: colors.background }]}>
                    <View style={[styles.orderSearchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
                        <TextInput
                            style={[styles.orderSearchInput, { color: colors.text }]}
                            placeholder={t.searchHere}
                            placeholderTextColor={colors.textSecondary}
                            value={orderSearchQuery}
                            onChangeText={setOrderSearchQuery}
                        />
                    </View>
                </View>

                {/* Orders List */}
                <ScrollView
                    style={styles.modalContent}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.ordersScrollContent}
                >
                    {filteredOrders.map((order) => (
                        <View key={order.id} style={[styles.orderCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            {/* Order Info Row */}
                            <View style={styles.orderInfoRow}>
                                <View style={[styles.orderImageContainer, { backgroundColor: colors.surfaceSecondary }]}>
                                    <Image source={order.image} style={styles.orderImage} resizeMode="contain" />
                                </View>
                                <View style={styles.orderDetails}>
                                    <View style={styles.orderNameRow}>
                                        <Text style={[styles.orderName, { color: colors.text }]}>{order.name}</Text>
                                        <View style={[
                                            styles.orderStatusBadge,
                                            order.status === 'Ongoing'
                                                ? styles.orderStatusOngoing
                                                : styles.orderStatusDelivered
                                        ]}>
                                            <Text style={[
                                                styles.orderStatusText,
                                                order.status === 'Ongoing'
                                                    ? styles.orderStatusTextOngoing
                                                    : styles.orderStatusTextDelivered
                                            ]}>{order.status}</Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.orderQty, { color: colors.textSecondary }]}>{t.qty}:{order.qty}</Text>
                                    <TouchableOpacity>
                                        <Text style={styles.orderViewDetails}>{t.viewDetails}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Order Footer */}
                            <View style={[styles.orderFooter, { borderTopColor: colors.border }]}>
                                <Text style={[styles.orderDateLabel, { color: colors.textSecondary }]}>
                                    Order : <Text style={[styles.orderDateValue, { color: colors.text }]}>{order.orderDate}</Text>
                                </Text>
                                <Text style={[styles.orderDispatch, { color: colors.text }]}>{order.dispatchStatus}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </Modal>
    );

    const renderHelpModal = () => (
        <Modal
            visible={isHelpModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setIsHelpModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={() => setIsHelpModalVisible(false)}>
                        <Ionicons name="chevron-back" size={28} color="#1a2632" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>{t.helpCenter}</Text>
                    <View style={{ width: 28 }} />
                </View>

                {/* Modal Content */}
                <ScrollView
                    style={styles.modalContent}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.helpModalScrollContent}
                >
                    {/* Help Header Section */}
                    <View style={styles.helpHeaderSection}>
                        <View style={styles.helpIconContainer}>
                            <Ionicons name="help-circle" size={60} color="#0F1B28" />
                        </View>
                        <Text style={styles.helpHeaderTitle}>{t.helpCenter}</Text>
                        <Text style={styles.helpHeaderSubtitle}>
                            Please get in touch and we will be happy to help you. Get quick customer support by selecting your item
                        </Text>
                    </View>

                    {/* Help Question Section */}
                    <View style={styles.helpQuestionSection}>
                        <Text style={styles.helpQuestionTitle}>{t.whatIssues}</Text>

                        {/* Help Items */}
                        <View style={styles.helpItemsContainer}>
                            {HELP_ITEMS.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.helpItemButton}
                                    onPress={() =>
                                        setExpandedHelpId(
                                            expandedHelpId === item.id ? null : item.id
                                        )
                                    }
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.helpItemHeader}>
                                        <Text style={styles.helpItemQuestion}>{item.question}</Text>
                                        <Ionicons
                                            name={expandedHelpId === item.id ? 'chevron-up' : 'chevron-down'}
                                            size={20}
                                            color="#8B9DB8"
                                        />
                                    </View>

                                    {expandedHelpId === item.id && (
                                        <View style={styles.helpItemContent}>
                                            <Text style={styles.helpItemAnswer}>{item.answer}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Contact Support */}
                        <TouchableOpacity style={styles.contactSupportButton}>
                            <Ionicons name="call-outline" size={20} color="#FFFFFF" />
                            <Text style={styles.contactSupportText}>{t.contactSupport}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );

    const renderTermsModal = () => (
        <Modal
            visible={isTermsModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setIsTermsModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={() => setIsTermsModalVisible(false)}>
                        <Ionicons name="chevron-back" size={28} color="#1a2632" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>{t.termsConditions}</Text>
                    <View style={{ width: 28 }} />
                </View>

                {/* Modal Content */}
                <ScrollView
                    style={styles.modalContent}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.termsModalScrollContent}
                >
                    {/* Welcome Section */}
                    <View style={styles.termsSectionContainer}>
                        <Text style={styles.termsSectionTitle}>Welcome to Fuzzy Furniture Store!</Text>
                        <Text style={styles.termsText}>
                            These terms and conditions outline the rules and regulations for the use of Fuzzy's website.
                        </Text>
                        <Text style={styles.termsText}>
                            By accessing this website we assume you accept these terms and conditions. Do not continue to use Fuzzy Furniture Store if you do not agree to take all of the terms and conditions stated on this page.
                        </Text>
                        <Text style={styles.termsText}>
                            The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company's terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client's needs in respect of provision of the Company's stated services, in accordance with and subject to, prevailing law of CA.
                        </Text>
                    </View>

                    {/* Cookies Section */}
                    <View style={styles.termsSectionContainer}>
                        <Text style={styles.termsSectionTitle}>Cookies</Text>
                        <Text style={styles.termsText}>
                            We employ the use of cookies. By accessing Fuzzy Furniture Store, you agreed to use cookies in agreement with the Fuzzy's Privacy Policy.
                        </Text>
                        <Text style={styles.termsText}>
                            Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.
                        </Text>
                    </View>

                    {/* License Section */}
                    <View style={styles.termsSectionContainer}>
                        <Text style={styles.termsSectionTitle}>License</Text>
                        <Text style={styles.termsText}>
                            Unless otherwise stated, Fuzzy and/or its licensors own the intellectual property rights for all material on Fuzzy Furniture Store. All intellectual property rights are reserved. You may access this from Fuzzy Furniture Store for your own personal use subjected to restrictions set in these terms and conditions.
                        </Text>
                        <Text style={styles.termsText}>You must not:</Text>
                        <Text style={styles.termsListItem}>• Republish material from Fuzzy Furniture Store</Text>
                        <Text style={styles.termsListItem}>• Sell, rent or sub-license material from Fuzzy Furniture Store</Text>
                        <Text style={styles.termsListItem}>• Reproduce, duplicate or copy material from Fuzzy Furniture Store</Text>
                        <Text style={styles.termsListItem}>• Redistribute content from Fuzzy Furniture Store</Text>
                        <Text style={styles.termsText}>
                            Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. Fuzzy does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of Fuzzy, its agents and/or affiliates.
                        </Text>
                        <Text style={styles.termsText}>
                            Fuzzy reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive or causes breach of these Terms and Conditions.
                        </Text>
                        <Text style={styles.termsText}>You warrant and represent that:</Text>
                        <Text style={styles.termsListItem}>• You are entitled to post the Comments on our website and have all necessary licenses and consents to do so;</Text>
                        <Text style={styles.termsListItem}>• The Comments do not invade any intellectual property right, including without limitation copyright, patent or trademark of any third party;</Text>
                        <Text style={styles.termsListItem}>• The Comments do not contain any defamatory, libelous, offensive, indecent or otherwise unlawful material which is an invasion of privacy;</Text>
                        <Text style={styles.termsListItem}>• The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.</Text>
                    </View>

                    {/* Hyperlinking Section */}
                    <View style={styles.termsSectionContainer}>
                        <Text style={styles.termsSectionTitle}>Hyperlinking to our Content</Text>
                        <Text style={styles.termsText}>The following organizations may link to our Website without prior written approval:</Text>
                        <Text style={styles.termsListItem}>• Government agencies;</Text>
                        <Text style={styles.termsListItem}>• Search engines;</Text>
                        <Text style={styles.termsListItem}>• News organizations;</Text>
                        <Text style={styles.termsListItem}>• Online directory distributors;</Text>
                        <Text style={styles.termsListItem}>• System wide Accredited Businesses.</Text>
                        <Text style={styles.termsText}>
                            These organizations may link to our home page, to publications or to other Website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party's site.
                        </Text>
                    </View>

                    {/* Reservation of Rights */}
                    <View style={styles.termsSectionContainer}>
                        <Text style={styles.termsSectionTitle}>Reservation of Rights</Text>
                        <Text style={styles.termsText}>
                            We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amend these terms and conditions and it's linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
                        </Text>
                    </View>

                    {/* Removal of Links */}
                    <View style={styles.termsSectionContainer}>
                        <Text style={styles.termsSectionTitle}>Removal of Links from our Website</Text>
                        <Text style={styles.termsText}>
                            If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.
                        </Text>
                        <Text style={styles.termsText}>
                            We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.
                        </Text>
                    </View>

                    {/* Disclaimer */}
                    <View style={styles.termsSectionContainer}>
                        <Text style={styles.termsSectionTitle}>Disclaimer</Text>
                        <Text style={styles.termsText}>
                            To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
                        </Text>
                        <Text style={styles.termsListItem}>• Limit or exclude our or your liability for death or personal injury;</Text>
                        <Text style={styles.termsListItem}>• Limit or exclude our or your liability for fraud or fraudulent misrepresentation;</Text>
                        <Text style={styles.termsListItem}>• Limit any of our or your liabilities in any way that is not permitted under applicable law;</Text>
                        <Text style={styles.termsListItem}>• Exclude any of our or your liabilities that may not be excluded under applicable law.</Text>
                        <Text style={styles.termsText}>
                            As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.
                        </Text>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );

    const renderSettingsModal = () => (
        <Modal
            visible={isSettingsModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setIsSettingsModalVisible(false)}
        >
            <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                {/* Modal Header */}
                <View style={[styles.modalHeader, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                    <TouchableOpacity onPress={() => setIsSettingsModalVisible(false)}>
                        <Ionicons name="chevron-back" size={28} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>{t.settings}</Text>
                    <View style={{ width: 28 }} />
                </View>

                {/* Modal Content */}
                <View style={[styles.settingsContent, { backgroundColor: colors.background }]}>
                    {/* Dark/Light Toggle */}
                    <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.settingLabel, { color: colors.text }]}>{t.darkLight}</Text>
                        <Switch
                            value={isDarkMode}
                            onValueChange={(value: boolean) => setDarkMode(value)}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={'#FFFFFF'}
                            ios_backgroundColor={colors.border}
                        />
                    </View>

                    {/* Notification Toggle */}
                    <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.settingLabel, { color: colors.text }]}>{t.notification}</Text>
                        <Switch
                            value={settings.notification}
                            onValueChange={(value: boolean) => setSettings(prev => ({ ...prev, notification: value }))}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={'#FFFFFF'}
                            ios_backgroundColor={colors.border}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                setEditData({
                    ...editData,
                    avatar: result.assets[0].uri,
                });
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể chọn ảnh');
        }
    };

    const renderProfileHeader = () => (
        <View style={[styles.profileHeader, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.profileContent}>
                <View style={styles.avatarContainer}>
                    {profileData.avatar ? (
                        <Image
                            source={{ uri: profileData.avatar }}
                            style={styles.avatar}
                        />
                    ) : (
                        <View style={styles.avatar} />
                    )}
                </View>
                <View style={styles.profileInfo}>
                    <Text style={[styles.profileName, { color: colors.text }]}>{profileData.name}</Text>
                </View>
            </View>
            <TouchableOpacity style={[styles.editButton, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]} onPress={handleEditPress}>
                <Ionicons name="pencil" size={20} color={colors.text} />
            </TouchableOpacity>
        </View>
    );

    const renderMenuItem = (item: MenuItem) => (
        <TouchableOpacity
            key={item.id}
            style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => handleMenuPress(item)}
            activeOpacity={0.7}
        >
            <View style={[styles.menuIconContainer, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
                <Ionicons name={item.icon as any} size={22} color={colors.text} />
            </View>
            <View style={styles.menuTextContainer}>
                <Text style={[styles.menuTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.menuDescription, { color: colors.textSecondary }]}>{item.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
    );

    const renderEditModal = () => (
        <Modal
            visible={isEditModalVisible}
            transparent
            animationType="slide"
            onRequestClose={handleCancel}
        >
            <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                {/* Modal Header */}
                <View style={[styles.modalHeader, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                    <TouchableOpacity onPress={handleCancel}>
                        <Ionicons name="chevron-back" size={28} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>Profile</Text>
                    <View style={{ width: 28 }} />
                </View>

                {/* Modal Content */}
                <ScrollView
                    style={[styles.modalContent, { backgroundColor: colors.background }]}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.modalScrollContent}
                >
                    {/* Avatar Section */}
                    <View style={styles.modalAvatarContainer}>
                        {editData.avatar ? (
                            <Image
                                source={{ uri: editData.avatar }}
                                style={styles.modalAvatar}
                            />
                        ) : (
                            <View style={styles.modalAvatar} />
                        )}
                        <TouchableOpacity
                            style={[styles.avatarEditButton, { backgroundColor: colors.primary }]}
                            onPress={pickImage}
                        >
                            <Ionicons name="camera-outline" size={16} color={colors.primaryText} />
                        </TouchableOpacity>
                    </View>

                    {/* Name Field */}
                    <View style={styles.fieldContainer}>
                        <Text style={[styles.fieldLabel, { color: colors.text }]}>Name</Text>
                        <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.textInput, { color: colors.text }]}
                                placeholder="Enter your name"
                                placeholderTextColor={colors.textSecondary}
                                value={editData.name}
                                onChangeText={(text) => setEditData({ ...editData, name: text })}
                            />
                        </View>
                    </View>

                    {/* Email Field */}
                    <View style={styles.fieldContainer}>
                        <Text style={[styles.fieldLabel, { color: colors.text }]}>Email id</Text>
                        <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.textInput, { color: colors.text }]}
                                placeholder="Enter your email"
                                placeholderTextColor={colors.textSecondary}
                                keyboardType="email-address"
                                value={editData.email}
                                onChangeText={(text) => setEditData({ ...editData, email: text })}
                            />
                        </View>
                    </View>

                    {/* Phone Field */}
                    <View style={styles.fieldContainer}>
                        <Text style={[styles.fieldLabel, { color: colors.text }]}>Phone Number</Text>
                        <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Ionicons name="call-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.textInput, { color: colors.text }]}
                                placeholder="Enter your phone number"
                                placeholderTextColor={colors.textSecondary}
                                keyboardType="phone-pad"
                                value={editData.phone}
                                onChangeText={(text) => setEditData({ ...editData, phone: text })}
                            />
                        </View>
                    </View>
                </ScrollView>

                {/* Modal Footer - Buttons */}
                <View style={[styles.modalFooter, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                    <TouchableOpacity
                        style={[styles.cancelButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        onPress={handleCancel}
                    >
                        <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.saveButton, { backgroundColor: colors.primary }]}
                        onPress={handleSaveProfile}
                    >
                        <Text style={[styles.saveButtonText, { color: colors.primaryText }]}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <Text style={[styles.title, { color: colors.text }]}>{t.profile}</Text>
            </View>

            {/* Content */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Profile Section */}
                {renderProfileHeader()}

                {/* Menu Items */}
                <View style={styles.menuContainer}>
                    {MENU_ITEMS.map(item => renderMenuItem(item))}
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={20} color="#FF4444" />
                    <Text style={styles.logoutText}>{t.logout}</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Edit Modal */}
            {renderEditModal()}

            {/* Help Modal */}
            {renderHelpModal()}

            {/* Terms Modal */}
            {renderTermsModal()}

            {/* Settings Modal */}
            {renderSettingsModal()}

            {/* Orders Modal */}
            {renderOrdersModal()}

            {/* Payment Modal */}
            {renderPaymentModal()}

            {/* Add Card Modal */}
            {renderAddCardModal()}

            {/* Address Modal */}
            {renderAddressModal()}

            {/* Edit Address Modal */}
            {renderEditAddressModal()}

            {/* Language Modal */}
            {renderLanguageModal()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1a2632',
    },
    profileHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 20,
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        marginBottom: 20,
        marginTop: 12,
    },
    profileContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        marginRight: 16,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#D4A574',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a2632',
    },
    editButton: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E8EEF5',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    menuContainer: {
        marginTop: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 8,
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E8EEF5',
    },
    menuIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        borderWidth: 1,
        borderColor: '#E8EEF5',
    },
    menuTextContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a2632',
        marginBottom: 4,
    },
    menuDescription: {
        fontSize: 13,
        color: '#8B9DB8',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: '#FFF5F5',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFE8E8',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF4444',
        marginLeft: 8,
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E8EEF5',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a2632',
        flex: 1,
        textAlign: 'center',
    },
    modalContent: {
        flex: 1,
    },
    modalScrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    modalAvatarContainer: {
        alignItems: 'center',
        marginBottom: 30,
        position: 'relative',
    },
    modalAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#D4A574',
    },
    avatarEditButton: {
        position: 'absolute',
        bottom: 0,
        right: '35%',
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#0F1B28',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    fieldContainer: {
        marginBottom: 24,
    },
    fieldLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a2632',
        marginBottom: 10,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E8EEF5',
        paddingHorizontal: 12,
        height: 50,
    },
    inputIcon: {
        marginRight: 10,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#1a2632',
        paddingVertical: 0,
    },
    modalFooter: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 16,
        paddingBottom: Platform.OS === 'ios' ? 30 : 16,
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#F5F7FA',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E8EEF5',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#8B9DB8',
    },
    saveButton: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#0F1B28',
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    // Help Modal Styles
    helpModalScrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        paddingBottom: 50,
    },
    helpHeaderSection: {
        alignItems: 'center',
        marginBottom: 30,
        paddingVertical: 20,
    },
    helpIconContainer: {
        marginBottom: 16,
    },
    helpHeaderTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a2632',
        marginBottom: 8,
    },
    helpHeaderSubtitle: {
        fontSize: 14,
        color: '#8B9DB8',
        textAlign: 'center',
        lineHeight: 20,
    },
    helpQuestionSection: {
        marginTop: 20,
    },
    helpQuestionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a2632',
        marginBottom: 16,
    },
    helpItemsContainer: {
        marginBottom: 20,
        gap: 8,
    },
    helpItemButton: {
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E8EEF5',
        overflow: 'hidden',
    },
    helpItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    helpItemQuestion: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1a2632',
        flex: 1,
        marginRight: 12,
    },
    helpItemContent: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E8EEF5',
    },
    helpItemAnswer: {
        fontSize: 14,
        color: '#555555',
        lineHeight: 20,
    },
    contactSupportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0F1B28',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        gap: 8,
    },
    contactSupportText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    // Terms Modal Styles
    termsModalScrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        paddingBottom: 50,
    },
    termsSectionContainer: {
        marginBottom: 24,
    },
    termsSectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a2632',
        marginBottom: 12,
    },
    termsText: {
        fontSize: 14,
        color: '#555555',
        lineHeight: 22,
        marginBottom: 10,
    },
    termsListItem: {
        fontSize: 14,
        color: '#555555',
        lineHeight: 22,
        marginBottom: 6,
        marginLeft: 8,
    },
    // Settings Modal Styles
    settingsContent: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E8EEF5',
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a2632',
    },
    // Orders Modal Styles
    orderSearchContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    orderSearchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E8EEF5',
        paddingHorizontal: 14,
        height: 48,
        gap: 10,
    },
    orderSearchInput: {
        flex: 1,
        fontSize: 15,
        color: '#1a2632',
        paddingVertical: 0,
    },
    ordersScrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        paddingBottom: 50,
        gap: 16,
    },
    orderCard: {
        backgroundColor: '#F5F7FA',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E8EEF5',
        overflow: 'hidden',
    },
    orderInfoRow: {
        flexDirection: 'row',
        padding: 14,
        gap: 14,
    },
    orderImageContainer: {
        width: 70,
        height: 70,
        borderRadius: 12,
        backgroundColor: '#EDF1F7',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    orderImage: {
        width: 55,
        height: 55,
    },
    orderDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    orderNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 4,
    },
    orderName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a2632',
    },
    orderStatusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    orderStatusOngoing: {
        backgroundColor: '#E6F7ED',
    },
    orderStatusDelivered: {
        backgroundColor: '#FFF0F0',
    },
    orderStatusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    orderStatusTextOngoing: {
        color: '#2E7D4F',
    },
    orderStatusTextDelivered: {
        color: '#E04040',
    },
    orderQty: {
        fontSize: 13,
        color: '#8B9DB8',
        marginBottom: 4,
    },
    orderViewDetails: {
        fontSize: 13,
        fontWeight: '600',
        color: '#2E7D4F',
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#E8EEF5',
    },
    orderDateLabel: {
        fontSize: 13,
        color: '#8B9DB8',
    },
    orderDateValue: {
        color: '#1a2632',
        fontWeight: '600',
    },
    orderDispatch: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1a2632',
    },
    // Payment Modal Styles
    paymentScrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        paddingBottom: 50,
    },
    paymentSectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a2632',
        marginBottom: 16,
    },
    paymentCardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F5F7FA',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E8EEF5',
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginBottom: 12,
    },
    paymentCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    paymentCardLogoContainer: {
        width: 44,
        height: 34,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mastercardLogo: {
        flexDirection: 'row',
        width: 40,
        height: 26,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mcCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
    },
    mcRed: {
        backgroundColor: '#EB001B',
        marginRight: -6,
        zIndex: 1,
    },
    mcOrange: {
        backgroundColor: '#F79E1B',
        opacity: 0.85,
    },
    visaLogo: {
        fontSize: 18,
        fontWeight: '800',
        fontStyle: 'italic',
        color: '#1A1F71',
    },
    paymentCardNumber: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1a2632',
    },
    paymentCardExpiry: {
        fontSize: 13,
        color: '#8B9DB8',
        marginTop: 2,
    },
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#C4CDD5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioOuterSelected: {
        borderColor: '#0F1B28',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#0F1B28',
    },
    addNewCardLink: {
        alignSelf: 'flex-end',
        marginBottom: 8,
    },
    addNewCardText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0F1B28',
    },
    walletContainer: {
        backgroundColor: '#F5F7FA',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E8EEF5',
        overflow: 'hidden',
    },
    walletItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#E8EEF5',
    },
    walletItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    walletIconContainer: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paypalIcon: {
        fontSize: 22,
        fontWeight: '800',
        color: '#003087',
    },
    applePayIcon: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000000',
    },
    walletItemText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a2632',
    },
    // Add Card Modal Styles
    addCardScrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    addCardLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a2632',
        marginBottom: 10,
    },
    addCardInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E8EEF5',
        paddingHorizontal: 14,
        height: 50,
    },
    addCardTextInput: {
        flex: 1,
        fontSize: 15,
        color: '#1a2632',
        paddingVertical: 0,
    },
    addCardRow: {
        flexDirection: 'row',
    },
    addCardFooter: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    },
    addCardButton: {
        height: 54,
        borderRadius: 14,
        backgroundColor: '#0F1B28',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addCardButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    // Address Modal Styles
    addressScrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        paddingBottom: 50,
        gap: 16,
    },
    addressCard: {
        backgroundColor: '#F5F7FA',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E8EEF5',
        padding: 18,
    },
    addressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 10,
    },
    addressLabel: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1a2632',
    },
    addressText: {
        fontSize: 15,
        color: '#1a2632',
        lineHeight: 22,
        marginLeft: 34,
        marginBottom: 6,
    },
    addressPhone: {
        fontSize: 14,
        color: '#8B9DB8',
        marginLeft: 34,
    },
    addressFooter: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    },
    addressApplyButton: {
        height: 54,
        borderRadius: 14,
        backgroundColor: '#0F1B28',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addressApplyText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    addressEditBtn: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E8EEF5',
    },
    editAddrScrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    // Language Modal Styles
    langItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E8EEF5',
    },
    langText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a2632',
    },
});
