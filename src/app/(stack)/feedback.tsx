import { StyleSheet } from "react-native";
import React from "react";
import WebView from "react-native-webview";
import Constants from "expo-constants";

const Feedback = () => {
  return (
    <WebView
      style={styles.container}
      source={{
        uri: "https://docs.google.com/forms/d/e/1FAIpQLSc2sPg-V1_aybb9BN5rdn_lPgShfa1q-fMlzZsDzSVhWeXhOA/viewform?usp=sf_link",
      }}
    />
  );
};

export default Feedback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
