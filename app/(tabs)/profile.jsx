import { useUser, useClerk } from '@clerk/clerk-expo'
import React, { useState, useRef, useEffect } from 'react'
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Animated,
} from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window')
const LIGHT_RED = '#ffe5e5'
const RED_ACCENT = '#ff6f6f'
const TEXT_RED = '#d42525'

export default function Profile() {
  const { user } = useUser()
  const { signOut, openSignIn } = useClerk()
  const [showSignOutModal, setShowSignOutModal] = useState(false)
  const slideAnim = useRef(new Animated.Value(height)).current // start offscreen

  const imageUrl = user?.imageUrl
  const name = user?.fullName || user?.firstName || 'User'
  const email = user?.emailAddresses?.[0]?.emailAddress || 'No email'

  const avatarSize = width * 0.3
  const horizontalPadding = width * 0.05
  const spacing = width * 0.03

  // Open modal with slide animation
  const handleSignOutPress = () => {
    setShowSignOutModal(true)
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  // Close modal with slide-down animation
  const handleCloseModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowSignOutModal(false))
  }

  const handleConfirmSignOut = () => {
    handleCloseModal()
    signOut()
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#fff',
      }}
    >
      <ScrollView contentContainerStyle={{ paddingHorizontal: horizontalPadding }}>
        {/* Header Gradient */}
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

        {/* Account Info */}
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

        {/* Sign In / Sign Out Button */}
        <TouchableOpacity
          onPress={() => (user ? handleSignOutPress() : openSignIn())}
          activeOpacity={0.8}
          style={{ marginBottom: spacing * 2 }}
        >
          <LinearGradient
            colors={user ? ['#ff4e4e', '#ff7f7f'] : ['#4e9eff', '#7fbfff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: spacing,
              borderRadius: 12,
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            <Ionicons
              name={user ? 'log-out-outline' : 'log-in-outline'}
              size={RFValue(20)}
              color="#fff"
              style={{ marginRight: spacing / 2 }}
            />
            <Text
              style={{
                color: '#fff',
                fontSize: RFValue(16),
                fontFamily: 'Outfit-Bold',
              }}
            >
              {user ? 'Sign Out' : 'Sign In'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Settings */}
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

      {/* Animated Slide-Up Modal */}
      <Modal transparent visible={showSignOutModal} animationType="none">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'flex-end',
          }}
        >
          <Animated.View
            style={{
              transform: [{ translateY: slideAnim }],
              backgroundColor: '#fff',
              padding: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              shadowColor: RED_ACCENT,
              shadowOpacity: 0.4,
              shadowRadius: 10,
              elevation: 10,
            }}
          >
            <Text
              style={{
                fontSize: RFValue(18),
                fontFamily: 'Outfit-Bold',
                color: RED_ACCENT,
                textAlign: 'center',
                marginBottom: 15,
              }}
            >
              Confirm Sign Out
            </Text>

            <Text
              style={{
                fontSize: RFValue(16),
                fontFamily: 'Outfit-Medium',
                color: '#333',
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              Are you sure you want to sign out?
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress={handleCloseModal}
                style={{
                  flex: 1,
                  backgroundColor: '#ccc',
                  padding: 12,
                  borderRadius: 10,
                  marginRight: 10,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: RFValue(14), fontFamily: 'Outfit-Bold' }}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmSignOut}
                style={{
                  flex: 1,
                  backgroundColor: RED_ACCENT,
                  padding: 12,
                  borderRadius: 10,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: RFValue(14),
                    fontFamily: 'Outfit-Bold',
                    color: '#fff',
                  }}
                >
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
