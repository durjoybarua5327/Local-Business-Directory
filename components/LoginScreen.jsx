import { useAuth, useClerk, useOAuth } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { doc, getDoc } from 'firebase/firestore';
import React from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from '../Configs/FireBaseConfig';

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get("window");

const LIGHT_RED = "#ffcccc";
const RED_ACCENT = "#ff6f6f";
const TEXT_RED = "#d42525";

export default function LoginScreen() {
  const router = useRouter();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { isSignedIn, user } = useAuth();
  const { signOut } = useClerk()

  React.useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  // When a user signs in, check whether they've been banned in Firestore.
  // If banned, sign them out and show an alert. Otherwise navigate into the app.
  React.useEffect(() => {
    if (!isSignedIn || !user) return;

    let mounted = true

    const checkBanAndNavigate = async () => {
      try {
        const email = user?.emailAddresses?.[0]?.emailAddress
        if (!email) {
          router.replace('/app_layout')
          return
        }

        const ref = doc(db, 'BannedUsers', email)
        const snap = await getDoc(ref)

        if (snap.exists()) {
          const data = snap.data()
          const bannedUntil = data?.bannedUntil

          let isBanned = false
          let untilText = ''

          // bannedUntil can be: null (lifetime ban), Firestore Timestamp, or JS Date
          if (bannedUntil === null) {
            isBanned = true
            untilText = 'permanently'
          } else if (bannedUntil && typeof bannedUntil === 'object') {
            // Firestore Timestamp has .seconds OR .toDate(); support both
            let until = null
            if (typeof bannedUntil.seconds === 'number') {
              until = new Date(bannedUntil.seconds * 1000)
            } else if (typeof bannedUntil.toDate === 'function') {
              until = bannedUntil.toDate()
            } else if (bannedUntil instanceof Date) {
              until = bannedUntil
            }

            if (until) {
              if (until > new Date()) {
                isBanned = true
                untilText = `until ${until.toLocaleString()}`
              }
            }
          }

          if (isBanned) {
            // Inform user and sign out
            Alert.alert('Account banned', `Your account is banned ${untilText}. If you think this is a mistake contact the admins.`)
            try {
              await signOut()
            } catch (e) {
              console.error('Failed to sign out banned user', e)
            }
            return
          }
        }

        // Not banned — navigate into the app
        if (mounted) router.replace('/app_layout')
      } catch (err) {
        console.error('Failed to check ban status', err)
        // On error, fall back to allowing access so users aren't permanently locked out
        if (mounted) router.replace('/app_layout')
      }
    }

    checkBanAndNavigate()

    return () => {
      mounted = false
    }
  }, [isSignedIn, user, router, signOut])

  const onPress = async () => {
    // If already signed in, avoid starting a new OAuth flow which causes
    // Clerk to throw "You're already signed in." — instead navigate.
    if (isSignedIn) {
      console.log("User already signed in — navigating to app layout");
      router.replace("/app_layout");
      return;
    }

    try {
      await startOAuthFlow({
        redirectUrl: AuthSession.makeRedirectUri({ useProxy: true }),
      });
    } catch (err) {
      // Log and show a helpful message; do not rethrow so the dev server
      // / app doesn't crash from this error.
      console.error("OAuth error:", err);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/images/picture1.jpg")}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Text + Button Section */}
        <View style={styles.subcontainer}>
          <Text style={styles.headerPrimary}>Your ultimate</Text>
          <Text style={styles.headerSecondary}>
            Community Business Directory
          </Text>
          <Text style={styles.headerApp}>App</Text>

          <Text style={styles.description}>
            Find your favourite business near you and post your own business to
            your community
          </Text>

          <TouchableOpacity style={styles.btn} onPress={onPress}>
            <Text style={styles.btnText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_RED,
    alignItems: "center",
    paddingBottom: 20,
  },
  imageContainer: {
    marginTop: height * 0.08,
    alignItems: "center",
  },
  image: {
    width: width * 0.6,
    height: height * 0.5,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: RED_ACCENT,
    backgroundColor: LIGHT_RED,
  },
  subcontainer: {
    flex: 1,
    width: "90%",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#ffeaea",
    borderRadius: 16,
    padding: 12,
  },
  headerPrimary: {
    fontSize: width * 0.055,
    fontWeight: "bold",
    color: TEXT_RED,
    textAlign: "center",
    marginBottom: 5,
  },
  headerSecondary: {
    fontSize: width * 0.055,
    color: RED_ACCENT,
    fontFamily: "Outfit-Medium",
    textAlign: "center",
  },
  headerApp: {
    fontSize: width * 0.065,
    fontFamily: "Outfit-Extra-Bold",
    color: TEXT_RED,
    marginTop: 8,
    textAlign: "center",
  },
  description: {
    fontSize: width * 0.04,
    fontFamily: "Outfit-Regular",
    textAlign: "center",
    marginVertical: 8,
    color: RED_ACCENT,
    paddingHorizontal: 10,
  },
  btn: {
    backgroundColor: RED_ACCENT,
    paddingVertical: height * 0.018,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    marginTop: 16,
  },
  btnText: {
    color: LIGHT_RED,
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
});
