import { Tabs } from 'expo-router'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { ColorSpace } from 'react-native-reanimated';

import {Colors} from '../../app-example/constants/Colors';
export default function TabLayout() {
  return (
    <Tabs screenOptions={{headerShown: false,
     tabBarActiveTintColor:Colors.PRIMARY}}>
      <Tabs.Screen name='home'
      options={{tabBarLabel: 'Home',
        tabBarIcon: ({color, size}) => <Ionicons name="home" size={24} color={color} />
      }}
      />
      <Tabs.Screen name='explore'
      options={{tabBarLabel: 'Explore',
        tabBarIcon: ({color, size}) => <Ionicons name="search" size={24} color={color} />
      }}
      />
      <Tabs.Screen name='profile'
      options={{tabBarLabel: 'Profile',
        tabBarIcon: ({color, size}) => <Ionicons name="people" size={24} color={color} />
      }}
      />
    </Tabs>
  )
}