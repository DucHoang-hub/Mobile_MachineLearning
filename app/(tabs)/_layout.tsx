import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#1a2632',
        tabBarInactiveTintColor: '#8B9DB8',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabItem, focused && styles.activeTabItem]}>
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={33}
                color={focused ? '#1a2632' : color}
              />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <Ionicons
                name={focused ? "grid" : "grid-outline"}
                size={33}
                color={focused ? '#1a2632' : color}
              />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <Ionicons
                name={focused ? "bag-handle" : "bag-handle-outline"}
                size={33}
                color={focused ? '#1a2632' : color}
              />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <Ionicons
                name={focused ? "heart" : "heart-outline"}
                size={33}
                color={focused ? '#1a2632' : color}
              />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={33}
                color={focused ? '#1a2632' : color}
              />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      {/* Hide explore from tab bar */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 75 : 55,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 8 : 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    width: 50,
  },
  activeTabItem: {
    // Can add additional styles for active state
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 50,
    height: 2.5,
    backgroundColor: '#1a2632',
    borderRadius: 2,
  },
});
