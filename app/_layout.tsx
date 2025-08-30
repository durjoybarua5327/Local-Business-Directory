import { useFonts } from "expo-font";
import { Stack } from "expo-router";

export default function RootLayout() {
  useFonts({
    "Outfit-Regular": require("../assets/fonts/Outfit-Regular.ttf"),
    "Outfit-Extra-Bold": require("../assets/fonts/Outfit-ExtraBold.ttf"),
    "Outfit-Medium": require("../assets/fonts/Outfit-Medium.ttf")
  });
  return (
  <Stack screenOptions={{headerShown: false}}>
    <Stack.Screen name="(tabs)"/>
  </Stack>
)
}
