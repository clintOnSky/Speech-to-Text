import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomBottomTab from "@comp/tabs/CustomBottomTab";
import { COLORS, FONTS, SIZES } from "@const/index";
import { globalStyles } from "global/styles";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.light,
          paddingBottom: 0,
          elevation: 0,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          textTransform: "capitalize",
          fontFamily: FONTS.regular,
          fontSize: wp(SIZES.verySmall),
        },
        headerStyle: { backgroundColor: COLORS.light },
        headerShadowVisible: false,
        headerTitleStyle: {
          ...globalStyles.fontBold20,
        },
      }}
      tabBar={(props) => <CustomBottomTab {...props} />}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name={"home-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          title: "Recordings",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name={"mic-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transcript"
        options={{
          title: "Transcripts",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="reader-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
