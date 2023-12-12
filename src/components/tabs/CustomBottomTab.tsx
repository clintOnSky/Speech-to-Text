import { StyleSheet, View } from "react-native";
import React from "react";
import { BottomTabBar, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { COLORS } from "@const/index";

const CustomBottomTab = (props: BottomTabBarProps) => {
  return (
    <View style={styles.container}>
      <BottomTabBar {...props} />
    </View>
  );
};

export default CustomBottomTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.light,
    paddingBottom: 10,
  },
});
