import { View, TouchableOpacity, Text } from "react-native";
import { Link, Redirect } from "expo-router";
import { COLORS } from "@const/index";
const RootPage = () => {
  // The index page is always opened first before the page passed in the initialRouteName prop in the layout
  // So the index page must not be deleted
  // return <Redirect href={"/home"} />;
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: COLORS.light,
        justifyContent: "center",
        gap: 15,
      }}
    >
      <Link href="/(auth)/signin">Sign In</Link>
      <Link href="/home">Home</Link>
    </View>
  );
};

export default RootPage;
