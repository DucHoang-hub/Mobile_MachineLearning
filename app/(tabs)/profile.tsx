import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Modal, Platform, ScrollView, StatusBar, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isHelpModalVisible, setIsHelpModalVisible] = useState(false);
    const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
    const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
    const [expandedHelpId, setExpandedHelpId] = useState<string | null>(null);
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

    const handleMenuPress = (item: MenuItem) => {
        // Handle menu item press
        if (item.id === '9') {
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
                    <Text style={styles.modalTitle}>Help Center</Text>
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
                        <Text style={styles.helpHeaderTitle}>Help Center</Text>
                        <Text style={styles.helpHeaderSubtitle}>
                            Please get in touch and we will be happy to help you. Get quick customer support by selecting your item
                        </Text>
                    </View>

                    {/* Help Question Section */}
                    <View style={styles.helpQuestionSection}>
                        <Text style={styles.helpQuestionTitle}>What issues are you facing?</Text>

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
                            <Text style={styles.contactSupportText}>Contact Support</Text>
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
                    <Text style={styles.modalTitle}>Terms & Conditions</Text>
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
                    <Text style={[styles.modalTitle, { color: colors.text }]}>Setting</Text>
                    <View style={{ width: 28 }} />
                </View>

                {/* Modal Content */}
                <View style={[styles.settingsContent, { backgroundColor: colors.background }]}>
                    {/* Dark/Light Toggle */}
                    <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.settingLabel, { color: colors.text }]}>Dark/Light</Text>
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
                        <Text style={[styles.settingLabel, { color: colors.text }]}>Notification</Text>
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
                <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
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

            {/* Edit Modal */}
            {renderEditModal()}

            {/* Help Modal */}
            {renderHelpModal()}

            {/* Terms Modal */}
            {renderTermsModal()}

            {/* Settings Modal */}
            {renderSettingsModal()}
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
});
