import React from 'react'
import { View,ScrollView } from 'react-native'
import Header from '../../components/Home/Header.jsx'
import Slider from '../../components/Home/Slider.jsx'
import Category from '../../components/Home/Category.jsx'
import BusinessList from '../../components/Home/BusinessList.jsx'

export default function home() {
  return (
    <ScrollView>
      <Header />
      <Slider />
      <Category />
      <BusinessList />
      <View style={{height:50}}></View>
    </ScrollView>
    
  )
}
