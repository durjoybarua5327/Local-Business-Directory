import { useUser } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {
    Dimensions,
    Image,
    Platform,
    SafeAreaView,
    StatusBar,
    Text,
    TextInput,
    View,
} from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'

const { width } = Dimensions.get('window')

// Color Constants
const LIGHT_RED = '#ffcccc'
const RED_ACCENT = '#ff6f6f'
const TEXT_RED = '#d42525'

export default function Header() {
  const { user } = useUser()

  const imageUrl = user?.imageUrl
  const name = user?.fullName || user?.firstName || 'User'

  const avatarSize = width * 0.12
  const horizontalPadding = width * 0.04 
  const spacing = width * 0.02 

  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: LIGHT_RED,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        boxShadowColor: RED_ACCENT,
        boxShadowOpacity: 0.12,
        boxShadowRadius: 8,
        elevation: 3,
      }}
    >
      <View style={{ paddingHorizontal: horizontalPadding, paddingBottom: spacing * 2 }}>
=        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing }}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={{
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
                borderWidth: 2,
                borderColor: RED_ACCENT,
                backgroundColor: LIGHT_RED,
                marginRight: spacing * 2,
              }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
                backgroundColor: RED_ACCENT,
                marginRight: spacing * 2,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: RFValue(18),
                  fontFamily: 'Outfit-Bold',
                }}
              >
                {name.charAt(0)}
              </Text>
            </View>
          )}

          <View>
            <Text
              style={{
                fontSize: RFValue(18),
                fontFamily: 'Outfit-Bold',
                color: TEXT_RED,
              }}
            >
              Welcome,
            </Text>
            <Text
              style={{
                fontSize: RFValue(15),
                fontFamily: 'Outfit-Regular',
                color: TEXT_RED,
                marginTop: spacing / 2,
              }}
            >
              {name}
            </Text>
          </View>
        </View>

        {/* Search Bar */}
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
      </View>
    </SafeAreaView>
  )
}
