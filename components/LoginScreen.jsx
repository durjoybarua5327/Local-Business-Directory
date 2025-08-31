import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import { useSSO } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'

export default function LoginScreen() {
  const router = useRouter()
  const { startSSOFlow } = useSSO({ strategy: 'oauth_google' })

  const onPress = async () => {
    try {
      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
        // For native environments, you must pass a redirectUri.
        redirectUrl: AuthSession.makeRedirectUri({
          useProxy: true,
          // or provide your custom scheme if you didn’t configure a proxy
          // scheme: "myapp",
        }),
      })

      if (createdSessionId) {
        await setActive?.({ session: createdSessionId })
        router.replace('/')
      } else {
        // If the session wasn’t created—for example due to MFA—you can handle next steps using signIn or signUp
      }
    } catch (err) {
      console.error('SSO/OAuth error:', err)
    }
  }

  React.useEffect(() => {
    // Optimize OAuth experience on Android
    WebBrowser.warmUpAsync()
    return () => {
      WebBrowser.coolDownAsync()
    }
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ alignItems: 'center', marginTop: 80 }}>
        <Image
          source={require('../assets/images/picture1.jpg')}
          style={{
            width: 220,
            height: 450,
            borderRadius: 20,
            borderWidth: 4,
            borderColor: '#d42525ff',
          }}
        />
      </View>
      <View style={styles.subcontainer}>
        <Text style={styles.headerPrimary}>Your ultimate</Text>
        <Text style={styles.headerSecondary}>Community Business Directory</Text>
        <Text style={styles.headerApp}>App</Text>
        <Text style={styles.description}>
          Find your favourite business near you and post your own business to your community
        </Text>
        <TouchableOpacity style={styles.btn} onPress={onPress}>
          <Text style={styles.btnText}>Continue with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  subcontainer: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
    flex: 1,
  },
  headerPrimary: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#d42525ff',
    marginBottom: 5,
    textAlign: 'center',
  },
  headerSecondary: {
    fontSize: 22,
    color: '#2c1eceff',
    fontFamily: 'Outfit-Medium',
    textAlign: 'center',
  },
  headerApp: {
    fontSize: 26,
    fontFamily: 'Outfit-Extra-Bold',
    color: '#d42525ff',
    marginTop: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    textAlign: 'center',
    marginVertical: 2,
    color: '#706c6cff',
    paddingHorizontal: 20,
  },
  btn: {
    backgroundColor: '#d42525ff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    width: '90%',
    marginTop: 16,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
