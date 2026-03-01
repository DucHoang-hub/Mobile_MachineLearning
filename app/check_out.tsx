import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Image, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CheckoutScreen() {
    const router = useRouter();
    const { cartItems, getTotalPrice } = useCart();
    const { isDarkMode, colors } = useTheme();

    const subTotal = getTotalPrice();
    const shippingCharge = 20.00;
    const discount = 0.00; // Có thể tính toán dựa trên coupon
    const grandTotal = subTotal + shippingCharge - discount;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{headerShown: false}}/>

            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface }]}>
                <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: colors.surfaceSecondary }]}
                    onPress={() => router.replace('/(tabs)')}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Checkout</Text>
                <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.surfaceSecondary }]}>
                    <Ionicons 
                        name="heart-outline" 
                        size={24} 
                        color={colors.text} 
                        onPress={() => router.replace('/(tabs)/favorites')}/>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Shipping Address */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Shipping Address</Text>
                <View style={[styles.addressCard, { backgroundColor: colors.surface }]}>
                    <View style={[styles.addressIconContainer, { backgroundColor: colors.surfaceSecondary }]}>
                        <Ionicons name="location" size={24} color={colors.primary} />
                    </View>
                    <View style={styles.addressInfo}>
                        <Text style={[styles.addressType, { color: colors.text }]}>Home</Text>
                        <Text style={[styles.addressText, { color: colors.textSecondary }]}>790 Hyde Park Rd, Ontario</Text>
                    </View>
                </View>

                {/* Items Summary */}
                <View style={styles.itemsList}>
                    {cartItems.map((item, index) => (
                        <View key={index} style={[styles.itemCard, { backgroundColor: colors.surface }]}>
                            <View style={[styles.imageWrapper, { backgroundColor: colors.surfaceSecondary }]}>
                                <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
                            </View>
                            <View style={styles.itemDetails}>
                                <View style={styles.itemNameRow}>
                                    <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                                    <TouchableOpacity><Ionicons name="trash-outline" size={18} color={colors.textSecondary} /></TouchableOpacity>
                                </View>
                                <Text style={[styles.itemSubtext, { color: colors.textSecondary }]}>
                                    Qty : {item.quantity}  •  <View style={[styles.dot, { backgroundColor: item.colorHex }]} /> {item.color}
                                </Text>
                                <View style={styles.itemPriceRow}>
                                    <Text style={[styles.itemPrice, { color: colors.text }]}>${item.price}</Text>
                                    <Text style={styles.itemOldPrice}>${item.oldPrice}</Text>
                                    <View style={styles.qtyControlsSmall}>
                                        <TouchableOpacity style={styles.qtyBtnSmall}><Ionicons name="remove" size={12} color={colors.text} /></TouchableOpacity>
                                        <Text style={[styles.qtyTextSmall, { color: colors.text }]}>{item.quantity}</Text>
                                        <TouchableOpacity style={[styles.qtyBtnSmall, { backgroundColor: colors.primary }]}><Ionicons name="add" size={12} color={colors.primaryText} /></TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Choose Shipping */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Choose Shipping</Text>
                <TouchableOpacity style={[styles.selectorButton, { backgroundColor: colors.surface }]}>
                    <View style={styles.selectorLeft}>
                        <Ionicons name="car-outline" size={20} color={colors.text} />
                        <Text style={[styles.selectorText, { color: colors.text }]}>Choose Shipping Type</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </TouchableOpacity>

                {/* Apply Coupon */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>apply Coupon</Text>
                <TouchableOpacity style={[styles.couponButton, { backgroundColor: colors.surface, borderColor: colors.primary, borderStyle: 'dashed', borderWidth: 1 }]}>
                    <Text style={[styles.couponText, { color: colors.text }]}>#GOOGLE20</Text>
                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </TouchableOpacity>

                {/* Billing Details */}
                <View style={[styles.billingContainer, { borderTopColor: colors.surfaceSecondary }]}>
                    <View style={styles.billingRow}>
                        <Text style={[styles.billingLabel, { color: colors.textSecondary }]}>Sub Total</Text>
                        <Text style={[styles.billingValue, { color: colors.text }]}>${subTotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.billingRow}>
                        <Text style={[styles.billingLabel, { color: colors.textSecondary }]}>Shipping charge</Text>
                        <Text style={[styles.billingValue, { color: colors.text }]}>${shippingCharge.toFixed(2)}</Text>
                    </View>
                    <View style={styles.billingRow}>
                        <Text style={[styles.billingLabel, { color: colors.textSecondary }]}>Discount (10%)</Text>
                        <Text style={[styles.billingValue, { color: colors.text }]}>${discount.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.divider, { backgroundColor: colors.surfaceSecondary }]} />
                    <View style={styles.billingRow}>
                        <Text style={[styles.grandTotalLabel, { color: colors.text }]}>Grand Total</Text>
                        <Text style={[styles.grandTotalValue, { color: colors.text }]}>${grandTotal.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Action Button */}
                <TouchableOpacity style={[styles.paymentButton, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.paymentButtonText, { color: colors.primaryText }]}>Continue to Payment</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1 
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingBottom: 20,
    },
    iconButton: { 
        width: 45, 
        height: 45, 
        borderRadius: 25, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    title: { 
        fontSize: 18, 
        fontWeight: '700' 
    },
    scrollContent: { 
        paddingHorizontal: 20, 
        paddingBottom: 40 },
    sectionTitle: { 
        fontSize: 16, 
        fontWeight: '700', 
        marginTop: 25, 
        marginBottom: 15 
    },
    
    // Address Card
    addressCard: { 
        flexDirection: 'row', 
        padding: 15, 
        borderRadius: 16, 
        alignItems: 'center' 
    },
    addressIconContainer: { 
        width: 50, 
        height: 50, 
        borderRadius: 25, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginRight: 15 
    },
    addressInfo: { 
        flex: 1 
    },
    addressType: { 
        fontSize: 16, 
        fontWeight: '700' 
    },
    addressText: { 
        fontSize: 13, 
        marginTop: 4 
    },

    // Item Cards
    itemsList: { 
        marginTop: 10 
    },
    itemCard: { 
        flexDirection: 'row', 
        padding: 12, 
        borderRadius: 16, 
        marginBottom: 12 
    },
    imageWrapper: { 
        width: 80, 
        height: 80, 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    itemImage: { 
        width: '80%', 
        height: '80%' 
    },
    itemDetails: { 
        flex: 1, 
        marginLeft: 15, 
        justifyContent: 'space-between' 
    },
    itemNameRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    itemName: { 
        fontSize: 14, 
        fontWeight: '700' 
    },
    itemSubtext: { 
        fontSize: 12, 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    dot: { 
        width: 8, 
        height: 8, 
        borderRadius: 4, 
        marginRight: 4 
    },
    itemPriceRow: { 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    itemPrice: { 
        fontSize: 16, 
        fontWeight: '700', 
        marginRight: 8 
    },
    itemOldPrice: { 
        fontSize: 12, 
        color: '#A0A0A0', 
        textDecorationLine: 'line-through' 
    },
    
    // Qty Controls in Item Card
    qtyControlsSmall: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginLeft: 'auto', 
        gap: 8 
    },
    qtyBtnSmall: {
         width: 22,
          height: 22, 
          borderRadius: 11, 
          backgroundColor: '#F0F0F0', 
          justifyContent: 'center', 
          alignItems: 'center' 
        },
    qtyTextSmall: { 
        fontSize: 12, 
        fontWeight: '600' 
    },

    // Selectors
    selectorButton: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 16, 
        borderRadius: 12 
    },
    selectorLeft: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 10 
    },
    selectorText: { 
        fontSize: 14, 
        fontWeight: '500' 
    },
    couponButton: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 16, 
        borderRadius: 12 
    },
    couponText: { 
        fontSize: 14, 
        fontWeight: '600', 
        letterSpacing: 1 
    },

    // Billing
    billingContainer: { 
        marginTop: 25, 
        paddingTop: 20, 
        borderTopWidth: 1 
    },
    billingRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 12 
    },
    billingLabel: { 
        fontSize: 14 
    },
    billingValue: { 
        fontSize: 14, 
        fontWeight: '600' 
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
        fontSize: 18, 
        fontWeight: '800' 
    },

    // Payment Button
    paymentButton: { 
        borderRadius: 12, 
        paddingVertical: 18, 
        alignItems: 'center', 
        marginTop: 30 
    },
    paymentButtonText: { 
        fontSize: 16, 
        fontWeight: '700' 
    },
});