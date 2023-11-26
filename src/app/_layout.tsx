import { View } from "react-native";
import { useCallback } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "(auth)",
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    nunitoRegular: require("assets/fonts/Nunito-Regular.ttf"),
    nunitoMedium: require("assets/fonts/Nunito-Medium.ttf"),
    nunitoSemiBold: require("assets/fonts/Nunito-SemiBold.ttf"),
    nunitoBold: require("assets/fonts/Nunito-Bold.ttf"),
    nunitoExtraBold: require("assets/fonts/Nunito-ExtraBold.ttf"),
    nunitoBlack: require("assets/fonts/Nunito-Black.ttf"),
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Stack
        initialRouteName="(auth)"
        screenOptions={{
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="(auth)/index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}
