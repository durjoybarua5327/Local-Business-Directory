import { useOAuth, useAuth } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get("window");

const LIGHT_RED = "#ffcccc";
const RED_ACCENT = "#ff6f6f";
const TEXT_RED = "#d42525";

export default function LoginScreen() {
  const router = useRouter();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { isSignedIn, user } = useAuth(); 

  React.useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  // Navigate to main page once user is signed in
  React.useEffect(() => {
    if (isSignedIn && user) {
      router.replace("/app_layout");
    }
  }, [isSignedIn, user, router]);

  const onPress = async () => {
    try {
      await startOAuthFlow({
        redirectUrl: AuthSession.makeRedirectUri({ useProxy: true }),
      });
    } catch (err) {
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
