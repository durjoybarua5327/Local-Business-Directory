import { useUser } from '@clerk/clerk-expo'
import React from 'react'
import { Image, Text, TextInput, View } from 'react-native'

const LIGHT_RED = '#ffcccc'
const RED_ACCENT = '#ff6f6f'
const TEXT_RED = '#d42525'

export default function Header() {
  const { user } = useUser()
  return (
    <View
      style={{
        paddingTop: 20,
        paddingHorizontal: 16,
        backgroundColor: LIGHT_RED,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        shadowColor: RED_ACCENT,
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
        <Image
          source={{ uri: user?.imageUrl }}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            borderWidth: 2,
            borderColor: RED_ACCENT,
            backgroundColor: LIGHT_RED,
            marginRight: 12,
          }}
        />
        <View>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Outfit-Bold',
              color: TEXT_RED,
            }}
          >
            {user?.firstName} {user?.lastName}
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Outfit-Regular',
              color: RED_ACCENT,
            }}
          >
            {user?.emailAddresses?.[0]?.emailAddress}
          </Text>
        </View>
      </View>
      <TextInput
        placeholder="Search businesses..."
        style={{
          width: '100%',
          height: 44,
          backgroundColor: '#ffeaea',
          borderRadius: 12,
          paddingHorizontal: 16,
          fontSize: 16,
          fontFamily: 'Outfit-Regular',
          marginBottom: 8,
          borderWidth: 1,
          borderColor: RED_ACCENT,
          color: TEXT_RED,
        }}
        placeholderTextColor={RED_ACCENT}
      />
    </View>
  )
}
