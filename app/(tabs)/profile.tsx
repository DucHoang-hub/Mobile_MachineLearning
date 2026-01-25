import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MenuItem {
    id: string;
    icon: string;
    title: string;
    description: string;
    route?: string;
}

const MENU_ITEMS: MenuItem[] = [
    {
        id: '1',
        icon: 'cube-outline',
        title: 'Orders',
        description: 'Ongoing orders, Recent orders..',
    },
    {
        id: '2',
        icon: 'heart-outline',
        title: 'Wishlist',
        description: 'Your save product',
    },
    {
        id: '3',
        icon: 'card-outline',
        title: 'Payment',
        description: 'Saved card, Wallets',
    },
    {
        id: '4',
        icon: 'location-outline',
        title: 'Saved Address',
        description: 'Home, Office',
    },
    {
        id: '5',
        icon: 'globe-outline',
        title: 'Language',
        description: 'Select your language here',
    },
    {
        id: '6',
        icon: 'notifications-outline',
        title: 'Notification',
        description: 'Offers, Order tracking messages',
    },
    {
        id: '7',
        icon: 'settings-outline',
        title: 'Settings',
        description: 'app settings, Dark mode',
    },
    {
        id: '8',
        icon: 'information-circle-outline',
        title: 'Terms & Conditions',
        description: 'T&C for use of platform',
    },
    {
        id: '9',
        icon: 'call-outline',
        title: 'Help',
        description: 'Customer Support, FAQs',
    },
];

export default function ProfileScreen() {
    const router = useRouter();

    const handleMenuPress = (item: MenuItem) => {
        // Handle menu item press
        console.log('Pressed:', item.title);
    };

    const renderProfileHeader = () => (
        <View style={styles.profileHeader}>
            <View style={styles.profileContent}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar} />
                </View>
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>Marlin Watkin</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.editButton}>
                <Ionicons name="pencil" size={20} color="#1a2632" />
            </TouchableOpacity>
        </View>
    );

    const renderMenuItem = (item: MenuItem) => (
        <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => handleMenuPress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon as any} size={22} color="#1a2632" />
            </View>
            <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8B9DB8" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Profile</Text>
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
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
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
});
