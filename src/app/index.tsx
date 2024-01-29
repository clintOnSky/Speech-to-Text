import { ActivityIndicator, View } from "react-native";
import { COLORS } from "@const/index";
const RootPage = () => {
  // The index page is always opened first before the page passed in the initialRouteName prop in the layout
  // So the index page must not be deleted
  // return <Redirect href={"/home"} />;
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.light,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
};

export default RootPage;
