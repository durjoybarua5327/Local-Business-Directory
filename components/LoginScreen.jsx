import { View, Text, Image } from 'react-native'
import React from 'react'

export default function LoginScreen() {
  return (
    <View>
      <Image source={require('../assets/picture1.jpg')} 
      style={{ 
      width: 100, 
      height: 100, 
      alignSelf: 'center', 
      marginTop: 50 }} />
    </View>
  )
}