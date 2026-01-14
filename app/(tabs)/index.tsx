import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const userName = "Minh"; // This would come from user data/auth

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      {/* Header Section */}
      <View style={styles.header}>
        {/* Menu Icon */}
        <TouchableOpacity
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={28} color="#1a2632" />
        </TouchableOpacity>

        {/* User Info */}
        <View style={styles.userInfo}>
          {/* Avatar - Using Ionicons as placeholder */}
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={32} color="#FFFFFF" />
          </View>

          {/* Greeting */}
          <View style={styles.greetingContainer}>
            <Text style={styles.helloText}>Hello</Text>
            <Text style={styles.userName}>{userName}!</Text>
          </View>
        </View>

        {/* Notification Bell */}
        <TouchableOpacity
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={28} color="#1a2632" />
          {/* Notification Badge */}
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* Search and Filter Section */}
      <View style={styles.searchSection}>
        {/* Search Bar */}
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

        {/* Filter Button */}
        <TouchableOpacity
          style={styles.filterButton}
          activeOpacity={0.7}
        >
          <Ionicons name="options-outline" size={24} color="#1a2632" />
        </TouchableOpacity>
      </View>

      {/* Content Area - You can add your content here */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentPlaceholder}>
          <Text style={styles.placeholderText}>Anh em code tiếp ở đây nhé!...</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF0',
  },
  iconButton: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 15,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFB800',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  greetingContainer: {
    justifyContent: 'center',
  },
  helloText: {
    fontSize: 14,
    color: '#8B9DB8',
    fontWeight: '400',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a2632',
    marginTop: 2,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF4444',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1a2632',
    padding: 0,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  contentPlaceholder: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  placeholderText: {
    fontSize: 16,
    color: '#8B9DB8',
  },
});
