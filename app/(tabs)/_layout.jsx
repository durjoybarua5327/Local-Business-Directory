import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

// Define colors
const LIGHT_RED = "#ffcccc";
const RED_ACCENT = "#ff6f6f";
const ICON_GRAY = "#888"; // Icon color before active

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: RED_ACCENT,
        tabBarInactiveTintColor: ICON_GRAY, // Inactive icons are gray for contrast
        tabBarStyle: {
          backgroundColor: LIGHT_RED,
          borderTopColor: RED_ACCENT,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}