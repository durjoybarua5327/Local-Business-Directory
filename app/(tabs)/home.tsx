import React from 'react'
import { View, ScrollView, LogBox } from 'react-native'
import Header from '../../components/Home/Header.jsx'
import Slider from '../../components/Home/Slider.jsx'
import Category from '../../components/Home/Category.jsx'
import BusinessList from '../../components/Home/BusinessList.jsx'

// Ignore minor warnings for now
LogBox.ignoreLogs([
  'Warning: Text strings must be rendered within a <Text>',
]);

export default function home() {
  return (
    <ScrollView 
      nestedScrollEnabled={true} // ✅ allow nested FlatLists to scroll properly
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      <Header />
      <Slider />
      <Category />
      <BusinessList /> {/* FlatList inside this will now scroll correctly */}
      <View style={{ height: 50 }} />
    </ScrollView>
  )
}
