import { useClerk, useUser } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { useRef, useState, useEffect } from 'react'
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import UserBusinessCard from '../CreateOwnBusinesses/UserBusinessCard.jsx'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../../Configs/FireBaseConfig'

const { width, height } = Dimensions.get('window')
const LIGHT_RED = '#ffe5e5'
const RED_ACCENT = '#ff6f6f'
const TEXT_RED = '#d42525'

export default function Profile() {
  const { user } = useUser()
  const { signOut, openSignIn } = useClerk()
  const router = useRouter()
  const [showSignOutModal, setShowSignOutModal] = useState(false)
  const [userBusinessCount, setUserBusinessCount] = useState(0)
  const slideAnim = useRef(new Animated.Value(height)).current 

  const imageUrl = user?.imageUrl
  const name = user?.fullName || user?.firstName || 'User'
  const email = user?.emailAddresses?.[0]?.emailAddress || 'No email'
  const userId = user?.id
  const ADMIN_EMAIL = process.env.EXPO_PUBLIC_ADMIN_EMAIL

  const avatarSize = width * 0.3
  const horizontalPadding = width * 0.05
  const spacing = width * 0.03

  // Live Fetch user's business count
  useEffect(() => {
    if (!email) return

    const q = query(collection(db, 'Business List'), where('userEmail', '==', email))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => setUserBusinessCount(snapshot.size),
      (error) => console.error('Error fetching user businesses:', error)
    )

    return () => unsubscribe()
  }, [email])

  const handleSignOutPress = () => {
    setShowSignOutModal(true)
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

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

  const handleCreateBusiness = () => {
    if (userBusinessCount >= 2) {
      Alert.alert(
        'Limit Reached',
        'You already have 2 businesses. You cannot create more.'
      )
      return
    }
    router.push({
      pathname: '/CreateOwnBusinesses/CreateOwnBusiness',
      params: {
        userEmail: email,
        userId: userId,
      },
    })
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

          <View>
            <Text style={{ fontSize: RFValue(14), fontFamily: 'Outfit-Bold', color: TEXT_RED }}>
              Total Businesses
            </Text>
            <Text style={{ fontSize: RFValue(14), fontFamily: 'Outfit-Regular', color: '#555' }}>
              {userBusinessCount}
            </Text>
          </View>
        </View>

        {/* User Business Card with live data */}
        {user?.emailAddresses?.[0]?.emailAddress && (
          <UserBusinessCard
            userEmail={email}
            liveUpdate={true} // add prop to handle live updates if needed in the component
            onView={(businessId) =>
              router.push('/BusinessDetails/' + encodeURIComponent(businessId))
            }
          />
        )}

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

        {/* Create Your Own Business Button */}
        <TouchableOpacity
          onPress={handleCreateBusiness}
          activeOpacity={0.8}
          style={{ marginBottom: spacing * 2 }}
        >
          <LinearGradient
            colors={['#4e9eff', '#7fbfff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: spacing,
              borderRadius: 12,
              elevation: 3,
            }}
          >
            <Ionicons
              name="person-add-outline"
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
              Create your own Business
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Admin Panel Button */}
        {ADMIN_EMAIL && email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && (
          <TouchableOpacity
            onPress={() => router.push('/Admin/AdminPanel')}
            activeOpacity={0.8}
            style={{ marginTop: spacing * 2 }}
          >
            <LinearGradient
              colors={['#6b42c1', '#b06ab3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: spacing,
                borderRadius: 12,
                elevation: 3,
              }}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={RFValue(18)}
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
                Admin Panel
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
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
