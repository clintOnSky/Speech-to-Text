import { TouchableOpacity, View } from "react-native";
import { useCallback } from "react";
import { Stack, router, SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import { COLORS } from "@const/index";
import Ionicons from "@expo/vector-icons/Ionicons";
import DatabaseProvider from "@context/database";
import RecordingProvider from "@context/recordingContext";
import TranscriptProvider from "@context/transcriptContext";
import PlaybackProvider from "@context/playbackContext";
import { AuthUserProvider } from "@context/authContext";

SplashScreen.preventAutoHideAsync();

// export const unstable_settings = {
//   // Ensure any route can link back to `/`
//   initialRouteName: "(auth)/signin",
// };

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
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <PlaybackProvider>
      <AuthUserProvider>
        <DatabaseProvider>
          <RecordingProvider>
            <TranscriptProvider>
              <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
                <Stack
                  screenOptions={{
                    headerShadowVisible: false,
                    statusBarStyle: "dark",
                    statusBarTranslucent: true,
                  }}
                >
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="(auth)/signin"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(auth)/signup"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(auth)/forgotPassword"
                    options={{
                      title: "",
                      headerStyle: { backgroundColor: COLORS.light },
                      headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                          <Ionicons
                            name="arrow-back"
                            size={24}
                            color={COLORS.primary}
                          />
                        </TouchableOpacity>
                      ),
                    }}
                  />
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />

                  <Stack.Screen
                    name="(stack)/[id]"
                    options={{
                      title: "",
                      headerTitleAlign: "center",
                    }}
                  />
                  <Stack.Screen
                    name="(stack)/feedback"
                    options={{
                      headerShown: false,
                    }}
                  />
                </Stack>
              </View>
            </TranscriptProvider>
          </RecordingProvider>
        </DatabaseProvider>
      </AuthUserProvider>
    </PlaybackProvider>
  );
}
