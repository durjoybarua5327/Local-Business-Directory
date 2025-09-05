import { Ionicons } from '@expo/vector-icons'
import { RFValue } from 'react-native-responsive-fontsize'
import React from 'react'

import {
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native'
const { width } = Dimensions.get('window')

  const avatarSize = width * 0.12
  const horizontalPadding = width * 0.04 
  const spacing = width * 0.02 
  const LIGHT_RED = '#ffcccc'
  const RED_ACCENT = '#ff6f6f'
  const TEXT_RED = '#d42525'


export default function explore() {
  return (
    <View>
      <Text>explore more</Text>
      {/*Search Bar*/}
      <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            height: RFValue(40),
            backgroundColor: '#ffeaea',
            borderRadius: 10,
            paddingHorizontal: spacing,
            borderWidth: 1,
            borderColor: RED_ACCENT,
          }}
        >
          <Ionicons name="search" size={RFValue(16)} color={RED_ACCENT} style={{ marginRight: spacing }} />
          <TextInput
            placeholder="Search businesses..."
            style={{
              flex: 1,
              fontSize: RFValue(14),
              fontFamily: 'Outfit-Regular',
              color: TEXT_RED,
              paddingVertical: 0,
            }}
            placeholderTextColor={RED_ACCENT}
          />
        </View>
      {/*Categories*/}
      {/*BusinessList*/}


    </View>


  )
}