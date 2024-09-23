import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { StatusBar } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
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
        name="teacher-home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="teacher-gatepass"
        options={{
          tabBarLabel: 'GatePass',
          tabBarIcon: ({ color, size }) => (
            <Fontisto name="passport" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="teacher-events"
        options={{
          tabBarLabel: 'Events',
          tabBarIcon: ({ color, size }) => (
            <Fontisto name="calendar" size={size} color={color} />
          ),
        }}
      />

        <Tabs.Screen
        name="teacher-chats"
        options={{
          tabBarLabel: 'Groups',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="group" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="teacher-responsibilities"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="centercode" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.black,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 99,
    height: 90,
    paddingHorizontal: 10,
    bottom: 12,
    zIndex: 999,
    left: 15,
    right: 15,
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
