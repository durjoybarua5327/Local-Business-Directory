import { useUser } from '@clerk/clerk-expo'
import React from 'react'
import { Image, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'  // ✅ import icon library

const LIGHT_RED = '#ffcccc'
const RED_ACCENT = '#ff6f6f'
const TEXT_RED = '#d42525'

export default function Header() {
  const { user } = useUser()
  
  const imageUrl = user?.imageUrl 
  const name = user?.fullName || user?.firstName || 'User'

  return (
    <View
      style={{
        paddingTop: 15,
        paddingHorizontal: 16,
        backgroundColor: LIGHT_RED,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        shadowColor: RED_ACCENT,
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 3,
        boxShadow: '0px 4px 8px rgba(255, 111, 111, 0.12)', // web shadow
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom:5 }}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              borderWidth: 2,
              borderColor: RED_ACCENT,
              backgroundColor: LIGHT_RED,
              marginRight: 12,
            }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: RED_ACCENT,
              marginRight: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 18, fontFamily: 'Outfit-Bold' }}>
              {name.charAt(0)}
            </Text>
          </View>
        )}

        <View>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Outfit-Bold',
              color: TEXT_RED,
            }}
          >
            Welcome, Game play
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Outfit-Regular',
              color: TEXT_RED,
              marginTop: 2,
            }}
          >
            {name}
          </Text>
        </View>
      </View>

      <View
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 38,
    backgroundColor: '#ffeaea',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: RED_ACCENT,
  }}
>
  <Ionicons name="search" size={16} color={RED_ACCENT} style={{ marginRight: 6 }} />
  <TextInput
    placeholder="Search businesses..."
    style={{
      flex: 1,
      fontSize: 14,
      
      textAlignVertical: 'center',
      textAlingnHorizontal: 'center',
      fontFamily: 'Outfit-Regular',
      color: TEXT_RED,
    }}
    placeholderTextColor={RED_ACCENT}
  />
</View>

    </View>
  )
}
