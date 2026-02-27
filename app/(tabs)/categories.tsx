import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, Platform, Pressable, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const CATEGORIES_DATA = [
    {
        id: '1',
        title: 'Chairs',
        count: 29,
        image: require('../../assets/images/screen4_img1.png')
    },
    {
        id: '2',
        title: 'Tables',
        count: 45,
        image: require('../../assets/images/screen4_img2.png')
    },
    {
        id: '3',
        title: 'Sofas',
        count: 31,
        image: require('../../assets/images/screen4_img3.png')
    },
    {
        id: '4',
        title: 'Hanging chairs',
        count: 19,
        image: require('../../assets/images/screen4_img7.png')
    },
    {
        id: '5',
        title: 'Cabinets',
        count: 21,
        image: require('../../assets/images/screen4_img4.png')
    },
    {
        id: '6',
        title: 'Lamps',
        count: 32,
        image: require('../../assets/images/screen4_img5.png')
    },
    {
        id: '7',
        title: 'Cupboards',
        count: 18,
        image: require('../../assets/images/screen4_img6.png')
    },
];

export default function CategoriesScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const { isDarkMode, colors } = useTheme();
    const { t } = useLanguage();

    const filteredData = CATEGORIES_DATA.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <TouchableOpacity
                    style={[styles.backButton, { backgroundColor: colors.surface }]}
                    onPress={() => router.push('/(tabs)')}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>{t.categories}</Text>
                <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.surface }]}>
                    <Ionicons name="notifications-outline" size={24} color={colors.text} />
                    <View style={styles.notificationBadge} />
                </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchSection}>
                <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Ionicons name="search-outline" size={20} color={colors.textSecondary} style={styles.searchIcon} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder={t.searchHere}
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>
            {/* Card Categories */}
            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                renderItem={({ item }) => (
                    <Pressable
                        style={({ pressed }) => [styles.categoriesCard, { backgroundColor: colors.surface }, { opacity: pressed ? 0.9 : 1 }]}
                        onPress={() => router.push({
                            pathname: '/category-products',
                            params: { title: item.title }
                        })}
                    >
                        <View style={styles.cardContent}>
                            <View>
                                <Text style={[styles.categoriesTitle, { color: colors.text }]}>{item.title}</Text>
                                <Text style={[styles.categoriesSubtitle, { color: colors.textSecondary }]}>Total {item.count} {t.totalItems}</Text>
                            </View>
                            <Ionicons name="arrow-forward" size={24} color={colors.text} />
                        </View>
                        <Image source={item.image} style={styles.image} resizeMode="contain" />
                    </Pressable>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1a2632',
        textAlign: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F7FA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholder: {
        width: 40,
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
    searchSection: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 10,
        gap: 10,
        marginBottom: 10,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 48,
        borderColor: '#E2E8F0'
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#1a2632',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    categoriesCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 24,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        height: 140,

        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    cardContent: {
        flex: 1.5,
        height: '100%',
        justifyContent: 'center',
        paddingVertical: 5,
    },
    image: {
        width: 100,
        height: 100,
        flex: 1,
    },
    categoriesSubtitle: {
        fontSize: 13,
        fontWeight: '400',
        color: '#8B9DB8',
        marginTop: 4,
    },
    categoriesTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a2632',
        marginBottom: 4,
    },
});
