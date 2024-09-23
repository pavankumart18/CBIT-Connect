import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { StatusBar } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Writing this comment to get the understanding of the code 
// This is the layout for the tab navigation
// This layout is used in the social module
// This layout is used to navigate between the posts and create posts screen
// we can include two types of styles on is inline styles or we can stylesheets so this app contains different types of styles
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: Colors.gray,
        tabBarIconStyle: styles.tabBarIcon,
        tabBarItemStyle: styles.tabBarItem, 
      }}
    >
      <Tabs.Screen
        name="posts"
        options={{
          tabBarLabel: 'Posts',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="post" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="createposts"
        options={{
          tabBarLabel: 'Create-Post',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="create" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {

    backgroundColor: Colors.black,
    borderTopWidth: 1,
    borderTopColor: Colors.gray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
    height: 90,
    paddingHorizontal: 10,
    zIndex: 999,
    position: 'absolute',

  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 0,
    paddingBottom: 0,
  },
  tabBarIcon: {
    marginBottom:0

  },
  tabBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
