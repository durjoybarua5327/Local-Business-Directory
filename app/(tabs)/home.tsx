import React from 'react'
import { Text, View } from 'react-native'
import Header from '../../components/Home/Header.jsx'
import Slider from '../../components/Home/Slider.jsx'
export default function home() {
  return (
    <View>
      <Header />
      <Slider />
    </View>
  )
}