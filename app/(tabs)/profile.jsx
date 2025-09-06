import { useUser } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { LinearGradient } from 'expo-linear-gradient'

const { width } = Dimensions.get('window')
const LIGHT_RED = '#ffe5e5'
const RED_ACCENT = '#ff6f6f'
const TEXT_RED = '#d42525'

export default function Profile() {
  const { user } = useUser()

  const imageUrl = user?.imageUrl
  const name = user?.fullName || user?.firstName || 'User'
  const email = user?.emailAddresses?.[0]?.emailAddress || 'No email'

  const avatarSize = width * 0.3
  const horizontalPadding = width * 0.05
  const spacing = width * 0.03

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#fff',
      }}
    >
      <ScrollView contentContainerStyle={{ paddingHorizontal: horizontalPadding }}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#ff7f7f', '#ffb3b3']}
          style={{
            borderRadius: 20,
            padding: spacing * 2,
            marginVertical: spacing * 2,
            alignItems: 'center',
            shadowColor: RED_ACCENT,
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 5,
          }}
        >
          {/* User Avatar */}
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={{
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
                borderWidth: 3,
                borderColor: '#fff',
                backgroundColor: LIGHT_RED,
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
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: RED_ACCENT,
                shadowOpacity: 0.5,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: RFValue(36),
                  fontFamily: 'Outfit-Bold',
                }}
              >
                {name.charAt(0)}
              </Text>
            </View>
          )}

          {/* User Name */}
          <Text
            style={{
              fontSize: RFValue(26),
              fontFamily: 'Outfit-Bold',
              color: '#fff',
              marginTop: spacing,
              textShadowColor: 'rgba(0,0,0,0.2)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 3,
            }}
          >
            {name}
          </Text>

          {/* User Email */}
          <Text
            style={{
              fontSize: RFValue(16),
              fontFamily: 'Outfit-Medium',
              color: '#fff',
              marginTop: spacing / 2,
              opacity: 0.9,
            }}
          >
            {email}
          </Text>
        </LinearGradient>

        {/* Account Info Card */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 20,
            padding: spacing * 2,
            marginBottom: spacing * 2,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 5,
          }}
        >
          <Text
            style={{
              fontSize: RFValue(20),
              fontFamily: 'Outfit-Bold',
              color: TEXT_RED,
              marginBottom: spacing,
            }}
          >
            Account Information
          </Text>

          <View style={{ marginBottom: spacing }}>
            <Text style={{ fontSize: RFValue(14), fontFamily: 'Outfit-Bold', color: TEXT_RED }}>
              Full Name
            </Text>
            <Text style={{ fontSize: RFValue(14), fontFamily: 'Outfit-Regular', color: '#555' }}>
              {name}
            </Text>
          </View>

          <View style={{ marginBottom: spacing }}>
            <Text style={{ fontSize: RFValue(14), fontFamily: 'Outfit-Bold', color: TEXT_RED }}>
              Email
            </Text>
            <Text style={{ fontSize: RFValue(14), fontFamily: 'Outfit-Regular', color: '#555' }}>
              {email}
            </Text>
          </View>
        </View>

        {/* Settings Card */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 20,
            padding: spacing * 2,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Text
            style={{
              fontSize: RFValue(18),
              fontFamily: 'Outfit-Bold',
              color: TEXT_RED,
              marginBottom: spacing,
            }}
          >
            Settings & Preferences
          </Text>
          <Text style={{ fontSize: RFValue(14), color: '#555' }}>Coming Soon...</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
