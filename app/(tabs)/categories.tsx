import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CategoriesScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View style={styles.header}>
                <Text style={styles.title}>Categories</Text>
            </View>
            <TouchableOpacity style={styles.iconButton}>
                      <Ionicons name="notifications-outline" size={24} color="#1a2632" />
                      <View style={styles.notificationBadge} />
            </TouchableOpacity>
            {/* Search */}
        <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#8B9DB8" style={styles.searchIcon} />
            <TextInput
                style={styles.searchInput}
                placeholder="Search here..."
                placeholderTextColor="#8B9DB8"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            </View>
            <TouchableOpacity style={styles.filterButton}>
            <MaterialCommunityIcons name="view-grid-outline" size={24} color="#1a2632" />
            </TouchableOpacity>
        </View>
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
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1a2632',
        alignContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
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
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 48,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#1a2632',
    },
    filterButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F5F7FA',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
